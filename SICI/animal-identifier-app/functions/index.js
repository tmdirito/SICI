/**
 * Cloud Function (Generation 2, ES Module) triggered when a new image file is uploaded to Firebase Storage.
 * - Uses Modular Admin SDK.
 */

// --- 1. Modular Imports ---
import { onObjectFinalized } from "firebase-functions/v2/storage"; 
import { onDocumentCreated } from "firebase-functions/v2/firestore"; 
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { GoogleGenAI } from "@google/genai";

// --- 2. Modular Admin SDK Initialization (Global) ---
initializeApp();
const db = getFirestore();
const storage = getStorage();

// --- 3. FINALIZED Storage Trigger (For Uploading Images) ---
export const processImageForAI = onObjectFinalized({ 
    memory: "2GiB",        
    cpu: 1,                
    timeoutSeconds: 300    
}, async (event) => {
    
    // Initialize AI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY }); 

    const fileBucket = event.data.bucket;
    const filePath = event.data.name;     
    const contentType = event.data.contentType; 
    
    // 1. Basic Validation
    if (!filePath || !filePath.startsWith("userUploads/") || !contentType || !contentType.startsWith("image/")) {
        console.log("File skipped: Not a user upload or not an image.");
        return null;
    }

    const pathParts = filePath.split("/");
    const userId = pathParts[1];

    const file = storage.bucket(fileBucket).file(filePath);

    try {
        // 2. Prepare image data
        const [fileDownload] = await file.download(); 
        const imagePart = {
            inlineData: {
                data: fileDownload.toString("base64"),
                mimeType: contentType,
            },
        };

        // 3. Prompt (Strict JSON instruction for IMAGES)
        const prompt = `
        Analyze the image and identify the main subject. The subject will be either an animal or a plant.
        
        Return a single valid JSON object. Do not wrap the JSON in markdown code blocks.
        
        Structure your response with these exact keys:
        {
            "commonName": "The common name of the animal or plant",
            "scientificName": "The scientific name (genus and species)",
            "description": "A concise description of the organism (2-3 sentences).",
            "conservationStatus": "The IUCN conservation status (e.g., 'Least Concern', 'Endangered'). If not evaluated, use 'Not Evaluated'.",
            "type": "Return either 'animal' or 'plant' based on your identification"
        }
        `;
        
        // 4. Call the Gemini AI API (Using explicit strict structure for the new SDK)
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        imagePart 
                    ]
                }
            ]
        });

        const aiResultPart = response.text;
        
        // 5. ROBUST JSON PARSING
        const startIndex = aiResultPart.indexOf('{');
        const endIndex = aiResultPart.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            throw new Error("AI response did not contain a valid JSON object within the text.");
        }
        
        const cleanedJson = aiResultPart.substring(startIndex, endIndex + 1).trim();
        const aiData = JSON.parse(cleanedJson);
        
        // 6. Save result to Firestore
        const animalData = {
            ...aiData,
            imagePath: filePath, 
            userId: userId,
            createdAt: FieldValue.serverTimestamp(), 
            isPublic: false, 
        };

        await db.collection("users").doc(userId).collection("animals").add(animalData);
        
        console.log(`Successfully analyzed and saved result for user ${userId}.`);

        return null;

    } catch (error) {
        console.error(`❌ AI processing failed for ${filePath}:`, error);
        return null;
    }
});


// --- 4. Firestore Trigger for Local Wildlife Requests (For the Area/Collection Page) ---
// --- Updated Firestore Trigger for Local Wildlife Requests ---
export const processLocationRequest = onDocumentCreated({
    document: "users/{userId}/locationRequests/{requestId}",
    memory: "1GiB",
    timeoutSeconds: 120
}, async (event) => {
    const snap = event.data;
    if (!snap) return null;
    
    const { userId, requestId } = event.params; // Get IDs from the URL params
    const requestData = snap.data();

    if (requestData.status !== 'pending') {
        return null; 
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

        const prompt = `You are a wildlife expert creating a checklist of exactly 5 wild animals native to ${requestData.location}. 
        The user has already discovered these animals: ${requestData.alreadyFound}.
        
        CRITICAL INSTRUCTIONS: 
        1. If any of the 'already discovered' animals are native to ${requestData.location}, you MUST include them in your list of 5.
        2. Fill the remaining spots (up to exactly 5 total) with common native animals they have not discovered yet.
        
        Return ONLY a raw JSON array of strings representing the common names. 
        Example: ["Bison", "Red Fox", "Raccoon", "Mule Deer", "Black Bear"]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const aiResultText = response.text;
        const startIndex = aiResultText.indexOf('[');
        const endIndex = aiResultText.lastIndexOf(']');
        const animalsList = JSON.parse(aiResultText.substring(startIndex, endIndex + 1).trim());

        // 1. Update the original request document
        await snap.ref.update({
            animals: animalsList,
            status: 'completed',
            processedAt: FieldValue.serverTimestamp()
        });

        // 2. NEW: Save this as a permanent "Area" in the user's collection
        // This makes it easy to load "My Saved Locations" later
        await db.collection("users").doc(userId).collection("areas").add({
            locationName: requestData.location,
            animalsSuggested: animalsList,
            createdAt: FieldValue.serverTimestamp(),
            requestId: requestId
        });

        console.log(`Successfully saved area and animals for ${requestData.location}`);
        return null;

    } catch (error) {
        console.error("❌ Error processing Gemini request:", error);
        await snap.ref.update({ status: 'error', errorMessage: error.message });
        return null;
    }
});

/**
 * Cloud Function (Generation 2, ES Module) triggered when a new image file is uploaded to Firebase Storage.
 * - Uses Modular Admin SDK.
 */

// --- 1. Modular Imports ---
import { onObjectFinalized } from "firebase-functions/v2/storage"; 
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { GoogleGenAI } from "@google/genai";

// --- 2. Modular Admin SDK Initialization (Global) ---
initializeApp();
const db = getFirestore();
const storage = getStorage();

// --- 3. FINALIZED Storage Trigger ---
export const processImageForAI = onObjectFinalized({ 
    memory: "2GiB",        
    cpu: 1,                // FIXED: Must be a number (1), not a string
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

        // 3. Prompt (Strict JSON instruction)
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
        
        // 4. Call the Gemini AI API
        // Using the 2.5 model as you requested.
        const model = "gemini-2.5-flash-image"; 

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }]
            // Note: 'generationConfig' removed to prevent 400 Errors with this specific model
        });

        const aiResultPart = response.candidates[0].content.parts[0].text;
        
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

        // 7. Cleanup
        await file.delete();
        console.log(`Cleaned up temporary file: ${filePath}`);

        return null;

    } catch (error) {
        console.error(`❌ AI processing failed for ${filePath}:`, error);
        return null;
    }
});
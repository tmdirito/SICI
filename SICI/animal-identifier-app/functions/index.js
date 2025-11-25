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
// Removed: defineSecret, config

// --- 2. Modular Admin SDK Initialization (Global) ---
initializeApp();
const db = getFirestore();
const storage = getStorage();

// --- 3. FINALIZED Storage Trigger with Resource Tuning and Robustness ---
export const processImageForAI = onObjectFinalized({ 
    memory: "2GiB",        // Recommended bump for image processing performance
    cpu: "gcf_gen2",       // Ensures dedicated CPU
    timeoutSeconds: 300    // Long timeout for safety
}, async (event) => {
    // Initialize the AI client INSIDE the handler using process.env.GEMINI_KEY
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

        // 3. Optimized Prompt (Focus on compliance, not just request)
        const prompt = "Identify the animal in this image. You must return the analysis as a single JSON object " +
                        "that strictly conforms to the provided schema. Do not include any commentary, " +
                        "explanations, or extraneous text outside the JSON object.";
        
        // 4. Call the Gemini AI API
        const model = "gemini-2.5-flash"; 

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "commonName": { "type": "STRING" },
                        "scientificName": { "type": "STRING" },
                        "conservationStatus": { "type": "STRING" },
                        "description": { "type": "STRING" }
                    },
                }
            }
        });

        const aiResultPart = response.candidates[0].content.parts[0].text;
        
        // 5. ROBUST JSON PARSING (Fixes the Mumbling/Monologue Issue)
        // Find the first opening brace '{' and the last closing brace '}'
        const startIndex = aiResultPart.indexOf('{');
        const endIndex = aiResultPart.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            throw new Error("AI response did not contain a valid JSON object within the text.");
        }
        
        // Extract only the content between (and including) the braces
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
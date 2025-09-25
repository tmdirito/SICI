/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
// Import the specific v2 functions we need
const {onObjectFinalized} = require("firebase-functions/v2/storage");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {FieldValue} = require("firebase-admin/firestore");
// Set global options for all functions
setGlobalOptions({timeoutSeconds: 300, memory: "1GiB"});

admin.initializeApp();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// This is the new, correct v2 syntax for a Storage Trigger
exports.identifyAnimal = onObjectFinalized(async (event) => {
  // The event object contains all the file information
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  // Exit if the file is not an image
  if (!contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return;
  }

  console.log(`✅ New image detected: ${filePath}. Starting analysis.`);

  // Extract user ID from the file path (e.g., "userUploads/test-user/...")
  const userId = filePath.split("/")[1];
  if (!userId) {
    console.error("❌ Could not determine user ID from file path.");
    return;
  }

  try {
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const [fileBuffer] = await file.download();
    const imagePart = fileToGenerativePart(fileBuffer, contentType);

    console.log("✅ Image downloaded. Calling Gemini API...");

    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash-image-preview"});
    const prompt = `Identify the animal in this image. Provide a detailed response formatted as a single JSON object. The JSON object must have these exact keys and nothing else: "commonName", "scientificName", "description", and "conservationStatus". If the image does not contain an animal, the value for all keys should be the string "N/A".`;
    const result = await model.generateContent([prompt, imagePart]);

    console.log("✅ Gemini API call successful. Parsing response...");
    const responseText = result.response.text();
    const cleanedJson = responseText.replaceAll("```json", "").replaceAll("```", "").trim();
    const animalData = JSON.parse(cleanedJson);

    console.log("✅ Response parsed. Saving to Firestore...");
    await admin.firestore().collection("users").doc(userId).collection("animals").add({
      ...animalData,
      imagePath: filePath,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`✅ Successfully identified ${animalData.commonName} and saved for user ${userId}.`);
  } catch (error) {
    console.error("❌ ERROR in identifyAnimal trigger:", error);
  }
});

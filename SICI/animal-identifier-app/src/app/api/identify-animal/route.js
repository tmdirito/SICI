import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// ------------------------------------------------------------------
// 1. CONFIGURE EMULATOR CONNECTION (Crucial Step)
// This code runs on the server, so we must set environment variables
// manually so the Admin SDK knows where to look.
// ------------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  // These ports match your firebase.json and the logs you shared
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  console.log("🔧 API Route: Configured to use Local Emulators");
}

// ------------------------------------------------------------------
// 2. INITIALIZE FIREBASE ADMIN
// Next.js hot-reloading can try to initialize twice, so we check apps.length
// ------------------------------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    // REPLACE 'your-project-id' with the project ID from your .firebaserc file
    // If just testing locally, "demo-project" usually works too.
    projectId: "your-project-id" 
  });
}

const db = admin.firestore();

// ------------------------------------------------------------------
// 3. THE API HANDLER
// ------------------------------------------------------------------
export async function POST(request) {
  try {
    console.log("🚀 API Endpoint hit!");

    // OPTIONAL: Parse body if you are sending data
    // const body = await request.json(); 

    // --- DEBUG: Write to Emulator ---
    // This creates a document in a collection called "debug_logs".
    // If this works, you will see it immediately in the Emulator UI (localhost:4000)
    const docRef = await db.collection('debug_logs').add({
      msg: "Connection successful!",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      source: "Next.js API Route"
    });

    console.log(`✅ Successfully wrote to Emulator. Doc ID: ${docRef.id}`);

    // Return success
    return NextResponse.json({ 
      message: "API connected to Emulator successfully", 
      debugDocId: docRef.id,
      identified: true 
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}

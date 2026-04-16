import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { location, alreadyFound } = await request.json();
    console.log(`🚀 Looking for animals in: ${location}`);

    // Simulate an AI processing delay (1.5 seconds) so the UI loading state still works
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Hardcoded dummy data so you don't need a Gemini API key
    const dummyAnimals = [
      "Bison", 
      "Mountain Lion", 
      "Mule Deer", 
      "Red-Tailed Hawk", 
      "Cottontail Rabbit", 
      "Garter Snake",
      "Raccoon",
      "Black Bear"
    ];

    // Send the simulated data back to the frontend
    return NextResponse.json({ animals: dummyAnimals });

  } catch (error) {
    console.error("🚨 API Error:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
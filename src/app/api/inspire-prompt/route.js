import { NextResponse } from 'next/server';

/**
 * API route to generate an inspirational prompt using the Gemini API.
 */
export async function POST(request) {
  try {
    // 1. Prepare the request to the Gemini API for an inspirational prompt.
    const chatHistory = [{
        role: "user",
        parts: [{ text: "You are a creative muse. Generate a single, short, and highly imaginative prompt for a text-to-image model. The prompt should be visually striking and under 20 words. Return only the prompt itself, without any introductory text or quotation marks." }]
    }];

    const payload = { contents: chatHistory };
    const apiKey = process.env.GOOGLE_AI_API_KEY; // Canvas will provide this.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // 2. Make the fetch call to the Gemini API.
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Gemini API Error:", errorBody);
        return NextResponse.json({ error: 'Failed to get an inspirational prompt from the AI model.' }, { status: apiResponse.status });
    }

    const result = await apiResponse.json();

    // 3. Extract and clean the inspirational prompt from the response.
    let inspirationPrompt = 'A cat napping on a crescent moon.'; // Default fallback
     if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      inspirationPrompt = result.candidates[0].content.parts[0].text.trim();
      // Clean up any potential unwanted formatting from the model
      inspirationPrompt = inspirationPrompt.replace(/^"|"$/g, '');
    }

    // 4. Send the inspirational prompt back to the client.
    return NextResponse.json({ inspirationPrompt });

  } catch (error) {
    console.error('Error in /api/inspire-prompt:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
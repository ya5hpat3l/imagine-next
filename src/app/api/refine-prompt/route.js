import { NextResponse } from 'next/server';

/**
 * API route to refine a user's prompt using the Gemini API.
 */
export async function POST(request) {
  try {
    // 1. Extract the user's prompt from the request body.
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // 2. Prepare the request to the Gemini API.
    // We ask it to act as a prompt engineer.
    const chatHistory = [{
        role: "user",
        parts: [{ text: `You are an expert prompt engineer for a text-to-image model. Refine the following prompt to make it more vivid, detailed, and imaginative. Return only the refined prompt itself, without any introductory text. Prompt: "${prompt}"` }]
    }];

    const payload = { contents: chatHistory };
    const apiKey = process.env.GOOGLE_AI_API_KEY; // Canvas will provide this.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // 3. Make the fetch call to the Gemini API.
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Gemini API Error:", errorBody);
        return NextResponse.json({ error: 'Failed to communicate with the AI model.' }, { status: apiResponse.status });
    }

    const result = await apiResponse.json();

    // 4. Extract and clean the refined prompt from the response.
    let refinedPrompt = 'Could not refine prompt.'; // Default fallback
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      refinedPrompt = result.candidates[0].content.parts[0].text.trim();
      // Sometimes the model might still add quotes, so we remove them.
      refinedPrompt = refinedPrompt.replace(/^"|"$/g, '');
    }

    // 5. Send the refined prompt back to the client.
    return NextResponse.json({ refinedPrompt });

  } catch (error) {
    console.error('Error in /api/refine-prompt:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

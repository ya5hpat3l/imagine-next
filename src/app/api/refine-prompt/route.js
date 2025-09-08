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
        parts: [{ text: `You are an expert prompt engineer for text-to-image models such as Stable Diffusion, MidJourney, and DALL·E. Your task is to refine existing prompts to make them more vivid, detailed, imaginative, and visually striking, while preserving the original concept.

Guidelines:

1. Expand the scene with specific visual elements, textures, lighting, moods, and perspectives.

2. Add artistic and stylistic descriptors (e.g., oil painting, cinematic lighting, photorealism, watercolor, neon cyberpunk, surrealist, abstract, retro poster).

3. Introduce creative and coherent randomness to enhance uniqueness:

  -> Add subtle fantastical or surreal elements without changing the main idea.

  -> Enhance environmental details, background elements, and atmospheric effects.

  -> Occasionally combine unusual or contrasting elements to make the prompt more imaginative.

4. Maintain clarity and coherence: the refined prompt should still describe a single, unified scene.

5. Use rich adjectives and adverbs to intensify visual impact.

6. Avoid repeating words or phrases from the original prompt unnecessarily.

Y7. our output must always be only the refined prompt itself, without explanation, commentary, or extra text.

==============
Input Prompt:
==============
"${prompt}"` }]
    }];

    const payload = { contents: chatHistory };
    const apiKey = process.env.GOOGLE_AI_API_KEY; // Canvas will provide this.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

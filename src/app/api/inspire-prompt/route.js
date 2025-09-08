import { NextResponse } from 'next/server';

/**
 * API route to generate a detailed and varied inspirational prompt using the Gemini API.
 */
export async function POST(request) {
  try {
    // 1. Define a new, much more detailed prompt with few-shot examples.
    // This teaches the model the desired style, length, and variety.
    const detailedPrompt = `You are an expert prompt engineer for generative AI image models such as Stable Diffusion, MidJourney, and DALL·E.
Your task is to generate long, highly imaginative, and visually descriptive prompts that inspire the creation of unique, non-repetitive, and stunning images.

Guidelines:

1. Prompts must be between 100–200 words long.

2. Each prompt should mix unexpected and imaginative elements — such as unusual creatures, surreal environments, strange materials, odd perspectives, magical phenomena, futuristic inventions, or mythological hybrids.

3. Introduce randomness and unpredictability:

    -> Vary settings (fantasy, sci-fi, historical, abstract, dreamlike).
    
    -> Randomize moods (whimsical, eerie, majestic, melancholic, chaotic).
    
    -> Switch art styles often (oil painting, neon cyberpunk, baroque, watercolor, pixel art, surrealist photography, etc.).
    
    -> Sometimes combine contradictory elements (e.g., ancient ruins floating in space, bioluminescent plants inside a cyberpunk city, clockwork animals in a desert storm).

4. Despite randomness, ensure coherence: the scene must feel like one unified image, not disconnected fragments.

5. Always include artistic descriptors (lighting, textures, atmosphere, detail level, medium).

6. Do not repeat formulas or structures across prompts — every output must feel freshly invented.

7. Your output must always be only the final prompt, without explanation, commentary, or extra text.`;

    const chatHistory = [{
        role: "user",
        parts: [{ text: detailedPrompt }]
    }];

    const payload = { contents: chatHistory };
    const apiKey = process.env.GOOGLE_AI_API_KEY; // Canvas will provide this.
    
    // 2. Change the model to a more powerful and creative one.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // 3. Make the fetch call to the Gemini API (this part remains the same).
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

    // 4. Extract and clean the inspirational prompt (this part remains the same).
    let inspirationPrompt = 'A cat napping on a crescent moon.'; // Default fallback
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        inspirationPrompt = result.candidates[0].content.parts[0].text.trim();
        // Clean up any potential unwanted formatting from the model
        inspirationPrompt = inspirationPrompt.replace(/^"|"$/g, '');
    }

    // 5. Send the inspirational prompt back to the client (this part remains the same).
    return NextResponse.json({ inspirationPrompt });

  } catch (error) {
    console.error('Error in /api/inspire-prompt:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
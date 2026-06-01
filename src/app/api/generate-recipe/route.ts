import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ingredients, mode, language } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is missing. Please add GROQ_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const langName = language === 'zh' ? 'Simplified Chinese (简体中文)' : language === 'ms' ? 'Bahasa Melayu' : 'English';

    const prompt = `
You are a culinary assistant specializing in Malaysian cuisine (Malay, Chinese, Indian). The user has provided their current ingredients. Based on their chosen mode, generate a recipe.

Ingredients they currently have:
${ingredients.map((item: any) => `- ${item.item_name} (${item.quantity} ${item.unit})`).join('\n')}

Chosen Mode: ${mode === 'existing' ? 'Use Existing Only (Strictly use ONLY ingredients they currently have)' : 'Mix (Use Existing + Need to Buy. You can add a few highly essential ingredients that they need to buy)'}.

Requirements:
1. The recipe must be heavily inspired by authentic Malaysian cuisine.
2. The instructions must be in ${langName}.
3. The response must be a valid JSON object matching the requested schema.

JSON Output Schema:
{
  "recipeName": "Name of the recipe in ${langName}",
  "ingredientsToUse": ["Array of ingredients they already have that are used in this recipe"],
  "ingredientsToBuy": ["Array of ingredients to buy (MUST be an empty array if Mode is Use Existing Only)"],
  "prepSteps": ["Beginner-friendly prep steps (e.g., washing, chopping sizes, measuring, marinating time)"],
  "cookingSteps": ["Step-by-step cooking steps from heat setup to plating"]
}
`;

    // Fetch from Groq's OpenAI-compatible API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Using Meta's top-tier Llama 3.3 70B model
        model: 'llama-3.3-70b-versatile',
        response_format: { type: "json_object" }, // Guarantees JSON output format
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are a professional JSON-only response assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to communicate with Groq');
    }

    // Parse the generated message content which is guaranteed to be JSON
    const recipeText = data.choices[0].message.content;
    const recipe = JSON.parse(recipeText);

    return NextResponse.json(recipe);
  } catch (error: any) {
    console.error("Groq Recipe Generation Error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}

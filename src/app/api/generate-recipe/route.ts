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
You are a culinary assistant specializing in Malaysian cuisine (Malay, Chinese, Indian). The user has selected a list of ingredients they would like to use from their pantry. Based on their chosen mode, generate a recipe.

Ingredients they selected to use:
${ingredients.map((item: any) => `- ${item.item_name} (${item.quantity} ${item.unit})`).join('\n')}

Chosen Mode: ${mode === 'existing' ? 'Use Existing Only (Strictly use ONLY ingredients from their selected list)' : 'Mix (Use Existing + Need to Buy. You can use their selected ingredients and add a few highly essential ingredients that they need to buy)'}.

Requirements:
1. The recipe must be heavily inspired by authentic Malaysian cuisine.
2. The recipe must be culinary-sound and reasonable (合理). You DO NOT need to use all of the selected ingredients in the recipe. Choose only the subset of selected ingredients that make sense together culinary-wise. Do not force-include ingredients that do not fit the dish profile (e.g., do not put unrelated ingredients in the same dish).
3. You must generate exactly ONE single, cohesive dish/recipe (do not combine multiple distinct dishes, combo meals, or set menus in the response).
4. The instructions must be in ${langName}.
5. The response must be a valid JSON object matching the requested schema.

JSON Output Schema:
{
  "recipeName": "Name of the recipe in ${langName}",
  "ingredientsToUse": ["Array of ingredients from their selected list that are actually used in this recipe"],
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

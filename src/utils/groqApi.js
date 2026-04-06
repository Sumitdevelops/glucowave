/**
 * Utility to interact with the Groq API for estimating carbohydrates.
 */

export async function estimateCarbs(mealDescription) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

  if (!apiKey) {
    console.warn("No Groq API key found. Defaulting to 60g carbs.");
    return 60; // Fallback
  }

  const prompt = `You are an expert nutritionist. I will provide you with a description of a meal. Your ONLY job is to estimate the total carbohydrates in grams for this meal. Return ONLY the integer number. Do NOT include any text, reasoning, or units. Just the integer. If you don't know, make a reasonable guess.
  
Meal: "${mealDescription}"`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 10
      })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract numbers just in case the AI added extra characters
    const carbsInt = parseInt(content.replace(/[^0-9]/g, ''), 10);
    
    return isNaN(carbsInt) ? 60 : carbsInt;

  } catch (error) {
    console.error("Failed to estimate carbs via Groq:", error);
    return 60; // Fallback if API fails
  }
}

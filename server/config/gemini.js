import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      tools: [{ googleSearch: {} }], 
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      }
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error.message);
    throw error;
  }
}

export default main;
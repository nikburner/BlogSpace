import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple cache for generated content
const contentCache = new Map();

async function main(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Check cache first
    if (contentCache.has(prompt)) {
      console.log("Returning cached content for prompt");
      return contentCache.get(prompt);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Cache the result for 1 hour
    contentCache.set(prompt, text);
    setTimeout(() => contentCache.delete(prompt), 3600000);
    
    return text;
  } catch (error) {
    console.error("Error generating content:", error.message);
    throw error;
  }
}

export default main;

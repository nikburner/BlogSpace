import dotenv from "dotenv";
dotenv.config();

import main from "./config/gemini.js";

async function test() {
  console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY.substring(0, 20) + "...");
  
  try {
    const result = await main("Write a short blog about artificial intelligence Generate a blog content for this topic in simple text format");
    console.log("\n✅ SUCCESS! API is working!\n");
    console.log("Generated content:");
    console.log(result.substring(0, 300) + "...\n");
    return true;
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    return false;
  }
}

test().then(success => {
  if (success) {
    console.log("The 'Generate with AI' feature is WORKING ✅");
  } else {
    console.log("The 'Generate with AI' feature is NOT working ❌");
  }
  process.exit(0);
});

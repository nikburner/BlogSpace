import Blog from "../models/blog.js";
import { pipeline } from "@xenova/transformers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load Xenova model once
let embedder = null;
const getEmbedder = async () => {
    if (!embedder) {
        console.log("⏳ Loading local embedding model...");
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        console.log("✅ Local embedding model loaded!");
    }
    return embedder;
};

// Get embedding for any text
const getEmbedding = async (text) => {
    const model = await getEmbedder();
    const output = await model(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
};

// Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dot / (magA * magB);
};

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithBlog = async (req, res) => {
    try {
        const { blogId, question, history = [] } = req.body;

        if (!blogId || !question) {
            return res.status(400).json({
                success: false,
                message: "blogId and question are required"
            });
        }

        // Step 1 — Fetch blog from MongoDB
        const blog = await Blog.findById(blogId).populate("author", "name");
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        let chunkTexts = blog.chunkTexts;
        let chunkEmbeddings = blog.chunkEmbeddings;

        // Step 2 — Generate & cache if first time
        if (!chunkTexts || chunkTexts.length === 0) {
            console.log("⏳ First time — chunking & embedding blog...");

            const stripHtml = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            const blogContent = `
                Title: ${blog.title}
                Subtitle: ${blog.subTitle || ''}
                Category: ${blog.category}
                Author: ${blog.author?.name || 'Unknown'}
                Content: ${stripHtml(blog.description)}
            `;

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 100,
            });
            const docs = await splitter.createDocuments([blogContent]);
            chunkTexts = docs.map(d => d.pageContent);

            // Embed all chunks locally
            chunkEmbeddings = await Promise.all(
                chunkTexts.map(text => getEmbedding(text))
            );

            // Save to MongoDB
            await Blog.findByIdAndUpdate(blogId, { chunkTexts, chunkEmbeddings });
            console.log("✅ Embeddings cached in MongoDB!");

        } else {
            console.log("⚡ Using cached embeddings from MongoDB!");
        }

        // Step 3 — Embed question locally (instant!)
        console.log("⚡ Embedding question locally...");
        const questionEmbedding = await getEmbedding(question);

        // Step 4 — Find top 3 similar chunks
        const scored = chunkTexts.map((text, i) => ({
            text,
            score: cosineSimilarity(questionEmbedding, chunkEmbeddings[i])
        }));
        scored.sort((a, b) => b.score - a.score);
        const context = scored.slice(0, 3).map(c => c.text).join("\n\n");

        // Step 5 — Gemini answer
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        });

        // Build conversation history for Gemini
        const historyForGemini = history.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));

        const systemPrompt = `You are a helpful assistant for the blog: "${blog.title}".
        Answer questions ONLY based on the blog context below.
        If the answer is not found in the context say "I couldn't find that in this blog."
        Be concise and friendly.

        Blog Context:
        ${context}`;

        const chat = model.startChat({
            history: [
                // Add system prompt as first user+model exchange
                {
                    role: "user",
                    parts: [{ text: "You are a blog assistant. Follow these instructions: " + systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood! I'm ready to answer questions about this blog." }]
                },
                ...historyForGemini
            ],
        });

        const result = await chat.sendMessage(question);
        const answer = result.response.text();

        res.json({ success: true, answer });

    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
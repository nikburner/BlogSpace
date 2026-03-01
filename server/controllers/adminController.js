import Blog from "../models/blog.js";
import imagekit from "../config/imageKit.js";
import fs from "fs";
import main from "../config/gemini.js";

// Rate limiting map: userId -> timestamp of last request
const generateContentRateLimit = new Map();
const RATE_LIMIT_WINDOW = 10000; // 10 seconds

export const addBlog = async (req, res) => {
  try {
    // Parse the data from the request body
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    // Ensure all required fields are available
    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Read the file synchronously
    const fileBuffer = fs.readFileSync(imageFile.path);

    // // Upload Image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "blogs",
    });

    // // Optimize image via ImageKit transformation
    const optimizedImageUrl = imagekit.url({
      src: response.url,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "800" },
      ],
    });
    const image = optimizedImageUrl;
    // Create a new blog entry
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      author: req.user.userId,
    });

    res.json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBlogById = async (req, res) => {
  try {
    // Parse the blog data from the request body
    const blogId = req.params.id;
    const parsedBlog = JSON.parse(req.body.blog);

    // Find the existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog is not found" });
    }

    // Update fields
    existingBlog.title = parsedBlog.title;
    existingBlog.subTitle = parsedBlog.subTitle;
    existingBlog.description = parsedBlog.description;
    existingBlog.category = parsedBlog.category;
    existingBlog.isPublished = parsedBlog.isPublished;

    // If a new image was uploaded
    if (req.file) {
      // Optionally: remove old image if stored locally
      if (existingBlog.image && fs.existsSync(existingBlog.image)) {
        fs.unlinkSync(existingBlog.image);
      }

      // Store new image path
      existingBlog.image = `/uploads/${req.file.filename}`; // adjust path as per your setup
    }

    await existingBlog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: existingBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the blog",
    });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.userId;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Rate limiting check
    const lastRequestTime = generateContentRateLimit.get(userId);
    const now = Date.now();
    if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequestTime)) / 1000)} seconds before generating again`,
      });
    }

    // Update rate limit
    generateContentRateLimit.set(userId, now);

    const fullPrompt = `${prompt} Generate a blog content for this topic in simple text format`;
    const content = await main(fullPrompt);

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate content",
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Generate content error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error generating content",
    });
  }
};

import express from "express";
import Blog from "../models/blog.js";

import {
  login,
  getAllBlogs,
  getBlogById,
  signup,
  profile,
  logout,
} from "../controllers/blogController.js";

const blogRouter = express.Router();

blogRouter.post("/signup", signup);
blogRouter.post("/login", login);
blogRouter.get("/profile", profile);
blogRouter.post("/logout", logout);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.get("/", async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        // Search (case-insensitive regex)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        // Category filter (skip if "All")
        if (category && category !== "All") {
            filter.category = category;
        }

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default blogRouter;

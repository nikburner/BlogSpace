import express from "express";
import upload from "../middleware/multerMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addBlog,
  deleteBlogById,
  generateContent,
  updateBlogById,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/add", authMiddleware, upload.single("image"), addBlog);
adminRouter.put("/updateBlog/:id", authMiddleware, upload.single("image"), updateBlogById);
adminRouter.delete("/deleteBlog/:id", authMiddleware, deleteBlogById); 
adminRouter.post("/generateContent", authMiddleware, generateContent);
export default adminRouter;

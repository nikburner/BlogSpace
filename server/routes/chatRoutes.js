import express from "express";
import { chatWithBlog } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", chatWithBlog);

export default chatRouter;
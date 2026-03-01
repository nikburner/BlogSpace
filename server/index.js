import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

// Initialize express app
const app = express();

//connect to db
await connectDB();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

//routes
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRouter);

//port
const port = process.env.PORT || 3000;

//start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

import Blog from "../models/blog.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  // Extract user details from request body
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: false, // set to true in production
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    // Set the cookie
    res.cookie("token", token, cookieOptions).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const profile = async (req, res) => {
  // Check if token exists in cookies
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
    // Get user details from decoded token
    res.json(decoded);
  });
};

export const logout = async (req, res) => {
  // Clear the token from the cookies
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    // Extract blogId from request parameters
    const { blogId } = req.params;
    // Find the blog by ID and populate the author field
    const blog = await Blog.findById(blogId).populate("author", "name");
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

 import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Validate role to prevent privilege escalation
    const allowedRoles = ['donor', 'volunteer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(`Error in signup: ${err.message}`, err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Invalid input data" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY not configured');
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      donorName: user.name,
      donorId: user._id,
      role: user.role
    });
  } catch (err) {
    console.error(`Error in login: ${err.message}`, err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getMe(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(`Error in getMe: ${err.message}`, err.stack);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { signup, login, getMe };
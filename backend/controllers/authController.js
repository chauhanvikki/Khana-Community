import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import OTPModel from "../models/otpModel.js";
import { sendOTP, sendThankYou } from "../utils/email.js";

// Lazy-init: create client only when needed, so dotenv has loaded by then
let client;
function getGoogleClient() {
  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return client;
}

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword, role });
    await user.save();

    // Send welcome email (non-blocking - don't fail signup if email fails)
    sendThankYou(email, name, role).catch(err => 
      console.error('Welcome email failed:', err.message)
    );

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
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Role verification
    if (role && user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. This account is registered as a ${user.role}.` 
      });
    }

    if (!user.password) {
      return res.status(401).json({ 
        message: "This account uses Google Login. Please use 'Continue with Google'." 
      });
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

async function googleLogin(req, res) {
  console.log("POST /api/auth/google-login called with role:", req.body.role);
  try {
    const { token, role } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login is not configured on the server" });
    }

    let payload;
    try {
      const googleClient = getGoogleClient();
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error("Google token verification failed:", verifyErr.message);
      return res.status(401).json({ message: "Invalid Google token. Please try again." });
    }

    const { email, sub: googleId, name, picture } = payload;

    // Check if user exists
    const existingUser = await userModel.findOne({ email });

    // If user exists with a DIFFERENT role, block
    if (existingUser && existingUser.role !== role) {
      return res.status(403).json({ 
        message: `This email is already registered as a ${existingUser.role}. Please use the ${existingUser.role} login page.` 
      });
    }

    // EXISTING USER → direct login (no OTP needed)
    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
        existingUser.isGoogleUser = true;
        if (!existingUser.profileImage) existingUser.profileImage = picture;
        await existingUser.save();
      }

      const jwtToken = jwt.sign(
        { email: existingUser.email, name: existingUser.name, id: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      // Send welcome email (non-blocking)
      sendThankYou(existingUser.email, existingUser.name, existingUser.role).catch(err => 
        console.error('Welcome email failed:', err.message)
      );

      return res.status(200).json({
        message: "Google login successful",
        token: jwtToken,
        donorName: existingUser.name,
        donorId: existingUser._id,
        role: existingUser.role
      });
    }

    // NEW USER → Send OTP for verification before creating account
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTPModel.deleteMany({ email });
    const newOTP = new OTPModel({ email, otp });
    await newOTP.save();

    try {
      await sendOTP(email, otp);
      console.log(`OTP sent to ${email} for Google signup`);
    } catch (mailErr) {
      console.error("OTP email sending failed:", mailErr);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    // Return requireOTP flag so frontend shows OTP modal
    res.status(200).json({
      requireOTP: true,
      message: "OTP sent to your email for verification",
      email,
      googleData: {
        googleId,
        name,
        role: role || 'donor',
        picture: picture || '',
      }
    });
  } catch (err) {
    console.error(`Error in googleLogin: ${err.message}`, err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error during Google Auth" });
  }
}

async function verifyGoogleOTP(req, res) {
  const { email, otp, googleData } = req.body;
  console.log(`Verifying OTP for ${email}: ${otp}`);
  try {
    const { googleId, name, role, picture } = googleData;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTPModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTPModel.deleteMany({ email });

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        name,
        email,
        googleId,
        isGoogleUser: true,
        role: role || 'donor',
        profileImage: picture || '',
      });
      await user.save();
    } else {
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        user.googleId = googleId;
        if (!user.profileImage) user.profileImage = picture;
        await user.save();
      }
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Send welcome email (non-blocking - don't fail login if email fails)
    sendThankYou(user.email, user.name, user.role).catch(err => 
      console.error('Welcome email failed:', err.message)
    );

    res.status(200).json({
      message: "Authentication successful",
      token,
      donorName: user.name,
      donorId: user._id,
      role: user.role
    });
  } catch (err) {
    console.error(`Error in verifyGoogleOTP: ${err.message}`, err.stack);
    res.status(500).json({ message: "Internal Server Error during OTP verification" });
  }
}

async function resendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTPModel.deleteMany({ email });
    const newOTP = new OTPModel({ email, otp });
    await newOTP.save();

    try {
      await sendOTP(email, otp);
    } catch (mailErr) {
      console.error("Mail sending failed:", mailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error(`Error in resendOTP: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error during Resend OTP" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTPModel.deleteMany({ email });
    const newOTP = new OTPModel({ email, otp });
    await newOTP.save();

    try {
      await sendOTP(email, otp);
    } catch (err) {
      return res.status(500).json({ message: "Failed to send reset code" });
    }

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await OTPModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    // If it was a Google user, they now have a password too
    await user.save();
    await OTPModel.deleteMany({ email });

    res.status(200).json({ message: "Password reset successful. Please login." });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { signup, login, getMe, googleLogin, verifyGoogleOTP, resendOTP, forgotPassword, resetPassword };
// /backend/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerAuthRoutes from "./routes/volunteerAuth.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://khana-community.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || origin.includes('khana-community') && origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-requested-with,Accept,Origin,X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Static serving for profile uploads
const uploadsDir = path.resolve(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

// Socket.io setup with JWT auth
const io = new SocketIOServer(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || (origin.includes('khana-community') && origin.includes('vercel.app'))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST']
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) return next(new Error("Unauthorized: No token provided"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.user = decoded; // { id, name, email, role }
    next();
  } catch (err) {
    next(new Error("Unauthorized: Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?.id;
  if (userId) {
    // Join a personal room to receive direct events
    socket.join(userId);
  }

  // Typing indicators
  socket.on("typing", ({ to }) => {
    if (to) io.to(to).emit("typing", { from: userId });
  });
  socket.on("stop_typing", ({ to }) => {
    if (to) io.to(to).emit("stop_typing", { from: userId });
  });

  // Optional: handle socket-initiated message sending (REST already supported)
  // Expect payload: { to, message }
  socket.on("send_message", async ({ to, message }) => {
    try {
      if (!to || !message?.trim()) return;
      const { default: Message } = await import("./models/Message.js");
      const doc = new Message({ senderId: userId, recipientId: to, message: message.trim() });
      await doc.save();
      // Emit to sender and recipient
      io.to(to).emit("message", doc);
      io.to(userId).emit("message", doc);
      io.to(to).emit("notification", { type: "message", from: userId, message: doc.message, at: doc.createdAt });
    } catch (e) {
      console.error("Socket send_message error:", e);
    }
  });

  socket.on("disconnect", () => {
    // Cleanup if needed
  });
});

// Make io accessible in routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/auth/volunteer", volunteerAuthRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "🍱 Khana Community Backend Running", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "API is working",
    cors: {
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins
    }
  });
});

// DB Connection & Server Start
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => console.log(`🚀 Server (with Socket.io) running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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
import dns from "dns";

// Set DNS servers to resolve MongoDB SRV records if local DNS fails
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerAuthRoutes from "./routes/volunteerAuth.js";
import messageRoutes from "./routes/messages.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

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
  "https://khana-community.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

// Helper: check if origin is a local dev origin (any port on localhost/127.0.0.1)
const isLocalDevOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return (url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.protocol === 'http:';
  } catch { return false; }
};

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any localhost port in development
    if (isLocalDevOrigin(origin)) return callback(null, true);

    // Allow production origins
    if (allowedOrigins.includes(origin) || (origin.includes('khana-community') && origin.includes('vercel.app'))) {
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

// Socket.io setup with improved CORS and logging
const io = new SocketIOServer(server, {
  path: "/socket.io/",
  cors: {
    origin: function (origin, callback) {
      if (!origin || isLocalDevOrigin(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin) || (origin.includes('khana-community') && origin.includes('vercel.app'))) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowEIO3: true
});

io.use((socket, next) => {
  console.log(`[Socket] Incoming connection attempt: ${socket.id}`);
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) {
      console.log(`[Socket] Connection rejected: No token for ${socket.id}`);
      return next(new Error("No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.user = decoded;
    console.log(`[Socket] Authenticated user: ${decoded.id} for ${socket.id}`);
    next();
  } catch (err) {
    console.log(`[Socket] Authentication failed for ${socket.id}: ${err.message}`);
    // Temporarily sending the actual error message to help the user debug
    next(new Error(`Authentication error: ${err.message}`));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?.id?.toString();
  if (userId) {
    socket.join(userId);
    if (socket.user.role === 'volunteer') {
      socket.join('volunteers');
      console.log(`[Socket] Volunteer joined room: ${userId}`);
    } else {
      console.log(`[Socket] User connected: ${userId}`);
    }
  }

  socket.on("typing", ({ to }) => {
    if (to) io.to(to.toString()).emit("typing", { from: userId });
  });

  socket.on("stop_typing", ({ to }) => {
    if (to) io.to(to.toString()).emit("stop_typing", { from: userId });
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Disconnected: ${userId}`);
  });
});

// Make io accessible in routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/auth/volunteer", volunteerAuthRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contact", contactRoutes);

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

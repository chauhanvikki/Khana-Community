import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import userModel from "./models/userModel.js";

async function findAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const admins = await userModel.find({ role: "admin" }).select("+password");
    console.log("Found admins:", admins.map(a => ({ email: a.email, name: a.name })));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findAdmin();

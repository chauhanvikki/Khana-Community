import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import dns from "dns";
import bcrypt from "bcryptjs";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import userModel from "./models/userModel.js";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    // Check if an admin exists
    const admins = await userModel.find({ role: "admin" });
    if (admins.length > 0) {
      console.log("Admin already exists:", admins[0].email);
      process.exit(0);
    }

    const email = "admin@khana.com";
    const password = "AdminPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new userModel({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "admin"
    });
    
    await admin.save();
    console.log(`Successfully created admin user: ${email} / ${password}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();

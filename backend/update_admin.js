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

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const email = "singhvikki870@gmail.com";
    const password = "AdminPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let user = await userModel.findOne({ email });
    
    if (user) {
      // User exists, update their role and password
      user.role = "admin";
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated existing user ${email} to admin.`);
    } else {
      // User doesn't exist, create it
      user = new userModel({
        name: "Vikki Singh",
        email: email,
        password: hashedPassword,
        role: "admin"
      });
      await user.save();
      console.log(`Created new admin user: ${email}`);
    }
    
    // Optionally delete the temporary admin we made earlier
    await userModel.deleteOne({ email: "admin@khana.com" });
    console.log("Cleaned up temporary admin@khana.com account.");
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateAdmin();

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
import DonationModel from "./models/DonationModel.js";

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const donors = await userModel.countDocuments({ role: "donor" });
    const volunteers = await userModel.countDocuments({ role: "volunteer" });
    const admins = await userModel.countDocuments({ role: "admin" });
    const donations = await DonationModel.countDocuments();
    
    console.log(`Donors: ${donors}`);
    console.log(`Volunteers: ${volunteers}`);
    console.log(`Admins: ${admins}`);
    console.log(`Donations: ${donations}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();

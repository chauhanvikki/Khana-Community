import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function checkDatabases() {
  try {
    // Connect without specifying a database, so it defaults to 'test'
    const uri = "mongodb+srv://singhvikki870:Vikki00000@cluster0.lrf2tr3.mongodb.net/";
    const conn = await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    
    // Get all databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    
    console.log("Databases:");
    for (const dbInfo of dbs.databases) {
      if (dbInfo.name === 'admin' || dbInfo.name === 'local') continue;
      
      console.log(`\n--- Database: ${dbInfo.name} ---`);
      const db = mongoose.connection.client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`Collection '${col.name}': ${count} documents`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDatabases();

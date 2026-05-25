import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const promote = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await UserModel.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (user) {
      console.log(`SUCCESS: User ${email} is now an ADMIN.`);
    } else {
      console.log(`ERROR: User ${email} not found.`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Promotion failed:', err);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promoteAdmin.js example@email.com');
  process.exit(1);
}

promote(email);

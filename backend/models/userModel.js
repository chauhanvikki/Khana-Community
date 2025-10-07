// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
  },
  password : {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['donor', 'volunteer'],
    default: 'donor',
  },
  profileImage: {
    type: String, // URL like /uploads/<file>
    default: '',
  }
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;

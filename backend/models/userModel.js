// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser; // Password required only if not a Google user
    },
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
    enum: ['donor', 'volunteer', 'admin'],
    default: 'donor',
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple nulls
  },
  profileImage: {
    type: String, // URL like /uploads/<file>
    default: '',
  }
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;

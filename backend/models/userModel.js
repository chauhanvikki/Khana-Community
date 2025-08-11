// import mongoose from'mongoose'
// const userSchema = new mongoose.Schema({
//     name: {
//         type : String,
//         required: true,
//     },
//     password : {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phone: {
//         type: String,
//     }
// })

// const UserModel = mongoose.model('User', userSchema);
// export default UserModel;


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
  }
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;

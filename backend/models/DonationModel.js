
// import mongoose from 'mongoose';

// const donationSchema = new mongoose.Schema({
//   donorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true,
//   },
//   foodName: {
//     type: String,
//     required: true,
//   },
//   quantity: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   expiryDate: {
//     type: Date,
//     required: true,
//   },
//   imageUrl: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// const Donation = mongoose.model('Donation', donationSchema);

// export default Donation;



// DonationModel.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    ref:'Donor',
    required: true,
  },

  foodName: {
    type: String,
    required: true,
  },
  // expiryDate: {
  //   type: Date,
  //   required: true,
  // },
  quantity: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  // Add other fields if needed
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;


/**
 * Donation model for managing food donations
 * Handles the lifecycle of food donations from creation to completion
 */
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodName: { type: String, required: true },
  quantity: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  phoneNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },

  status: {
    type: String,
    enum: ['available', 'claimed', 'completed'],
    default: 'available',
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

/**
 * Donation model instance
 * @typedef {Object} Donation
 * @property {ObjectId} donorId - Reference to the donor user
 * @property {string} foodName - Name of the donated food
 * @property {string} quantity - Quantity of food donated
 * @property {Date} pickupDate - Date when food should be picked up
 * @property {string} phoneNo - Contact phone number (10 digits)
 * @property {string} location - Pickup location
 * @property {string} imageUrl - Optional image URL
 * @property {string} status - Current status (available, claimed, completed)
 * @property {ObjectId} claimedBy - Reference to volunteer who claimed the donation
 */
const Donation = mongoose.model('Donation', donationSchema);
export default Donation;

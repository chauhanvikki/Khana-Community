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

  // GeoJSON point — [longitude, latitude] order (MongoDB standard)
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],
      default: undefined,
      validate: {
        validator: (v) => !v || v.length === 0 || v.length === 2,
        message: 'Coordinates must have exactly 2 values [lng, lat]'
      }
    },
  },

  status: {
    type: String,
    enum: ['available', 'accepted', 'en_route', 'arrived', 'picked_up', 'completed',
           'claimed', 'delivered'], // keep old values for backward compat
    default: 'available',
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  acceptedAt: Date,
  pickedUpAt: Date,
  completedAt: Date,
}, { timestamps: true });

// 2dsphere index — required for $near geospatial queries
donationSchema.index({ coordinates: '2dsphere' });

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
 * @property {string} status - Current status (available, claimed, delivered, completed)
 * @property {ObjectId} claimedBy - Reference to volunteer who claimed the donation
 */
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
export default Donation;

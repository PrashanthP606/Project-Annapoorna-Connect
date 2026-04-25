// Backend/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  foodType: { type: String },
  quantity: { type: String },
  pickupAddress: { type: String },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  status: {
    type: String,
    enum: ['available','matched','accepted','picked_up','completed','cancelled','expired'],
    default: 'available'
  },
  images: [{ type: String }],
  availableFrom: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DonationSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Donation', DonationSchema);

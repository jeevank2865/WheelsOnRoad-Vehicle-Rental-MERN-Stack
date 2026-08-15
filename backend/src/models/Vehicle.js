const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, trim: true },
  year: { type: Number },
  description: { type: String, trim: true },
  vehicleType: { type: String, enum: ['Superbike', 'Car'], required: true },
  category: { type: String, required: true },
  engineCC: { type: Number },
  powerHP: { type: Number },
  dailyRate: { type: Number, required: true },
  weekendSurgeRate: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  fuelType: { type: String },
  transmission: { type: String, enum: ['Manual', 'Quickshifter', 'Automatic'], default: 'Manual' },
  seatingCapacity: { type: Number },
  images: [{ type: String, required: true }],
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  includedItems: [{ type: String }],
  externalLinks: {
    officialWebsite: String,
    specifications: String,
    brochure: String,
    video: String
  },
  locationBranch: { type: String, default: 'Central Hub' },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    userName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

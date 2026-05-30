const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  address: {
    street: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
  },
  contact: {
    phone: String,
    altPhone: String,
    email: String,
    website: String,
    whatsapp: String,
  },
  hours: [{
    day: String,
    openTime: String,
    closeTime: String,
    isClosed: { type: Boolean, default: false },
  }],
  images: [String],
  coverImage: { type: String, default: '' },
  location: {
    lat: { type: Number, default: 17.385 },
    lng: { type: Number, default: 78.4867 },
  },
  tags: [String],
  priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'pending', 'rejected'], default: 'pending' },
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
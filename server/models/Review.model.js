const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  comment: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
}, { timestamps: true });

reviewSchema.index({ business: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
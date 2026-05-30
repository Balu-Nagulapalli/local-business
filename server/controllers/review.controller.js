const Review = require('../models/Review.model');
const Business = require('../models/Business.model');

exports.getByBusiness = async (req, res, next) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId, isHidden: false })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const review = await Review.create({
      ...req.body,
      business: req.params.businessId,
      user: req.user._id
    });

    const reviews = await Review.find({ business: req.params.businessId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Business.findByIdAndUpdate(req.params.businessId, {
      avgRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length
    });

    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { next(err); }
};
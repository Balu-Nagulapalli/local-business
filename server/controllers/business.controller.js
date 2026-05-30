const Business = require('../models/Business.model');
const Category = require('../models/Category.model');

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

exports.getAll = async (req, res, next) => {
  try {
    const { category, city, rating, search, page = 1, limit = 10, featured } = req.query;
    const filter = { status: 'active', isApproved: true };

    if (category) {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
        else return res.json({ businesses: [], total: 0, page: 1, pages: 0 });
      }
    }

    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (rating) filter.avgRating = { $gte: Number(rating) };
    if (featured) filter.isFeatured = true;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tagline: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
    ];

    const total = await Business.countDocuments(filter);
    const businesses = await Business.find(filter)
      .populate('category', 'name slug')
      .sort({ isFeatured: -1, avgRating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ businesses, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('owner', 'name email');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    business.totalViews += 1;
    await business.save({ validateBeforeSave: false });
    res.json(business);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name);
    const business = await Business.create({ ...req.body, slug, owner: req.user._id });
    await Category.findByIdAndUpdate(req.body.category, { $inc: { businessCount: 1 } });
    res.status(201).json(business);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(business);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: 'Business deleted' });
  } catch (err) { next(err); }
};

exports.getMyListings = async (req, res, next) => {
  try {
    const businesses = await Business.find({ owner: req.user._id }).populate('category', 'name');
    res.json(businesses);
  } catch (err) { next(err); }
};

exports.adminGetAll = async (req, res, next) => {
  try {
    const businesses = await Business.find()
      .populate('category', 'name')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) { next(err); }
};
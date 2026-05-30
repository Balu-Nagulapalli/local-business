const router = require('express').Router();
const Business = require('../models/Business.model');
const Review = require('../models/Review.model');
const User = require('../models/User.model');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/stats', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const [totalBusinesses, totalUsers, totalReviews, pendingBusinesses] = 
      await Promise.all([
        Business.countDocuments(),
        User.countDocuments(),
        Review.countDocuments(),
        Business.countDocuments({ status: 'pending' })
      ]);
    res.json({ totalBusinesses, totalUsers, totalReviews, pendingBusinesses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/categories/:id/activate', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const Category = require('../models/Category.model');
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    res.json(cat);
  } catch (err) { next(err); }
});

module.exports = router;
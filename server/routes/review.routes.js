const router = require('express').Router();
const Review = require('../models/Review.model');
const { getByBusiness, create, remove } = require('../controllers/review.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/business/:businessId', getByBusiness);
router.get('/admin/all', verifyToken, requireRole('admin'), async (req, res, next) => {
	try {
		const reviews = await Review
			.find()
			.populate('user', 'name email')
			.populate('business', 'name slug')
			.sort({ createdAt: -1 });
		res.json(reviews);
	} catch (err) { next(err); }
});
router.put('/:id/hide', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const Review = require('../models/Review.model');
    await Review.findByIdAndUpdate(req.params.id, { isHidden: req.body.isHidden });
    res.json({ success: true });
  } catch (err) { next(err); }
});
router.post('/:businessId', verifyToken, create);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
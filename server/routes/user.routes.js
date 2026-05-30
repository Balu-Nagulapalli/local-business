const router = require('express').Router();
const Business = require('../models/Business.model');
const Review = require('../models/Review.model');
const User = require('../models/User.model');
const { getAll, remove, updateProfile } = require('../controllers/user.controller');
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

router.get('/saved', verifyToken, async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).populate({
			path: 'savedBusinesses',
			populate: { path: 'category', select: 'name slug' }
		});
		res.json(user.savedBusinesses || []);
	} catch (err) { next(err); }
});

router.get('/saved/:businessId', verifyToken, async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		const saved = user.savedBusinesses.includes(req.params.businessId);
		res.json({ saved });
	} catch (err) { next(err); }
});

router.post('/saved/:businessId', verifyToken, async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		const idx = user.savedBusinesses.indexOf(req.params.businessId);
		if (idx > -1) {
			user.savedBusinesses.splice(idx, 1);
			await user.save();
			res.json({ saved: false });
		} else {
			user.savedBusinesses.push(req.params.businessId);
			await user.save();
			res.json({ saved: true });
		}
	} catch (err) { next(err); }
});

router.get('/', verifyToken, requireRole('admin'), getAll);
router.put('/profile', verifyToken, updateProfile);
router.put('/:id', verifyToken, requireRole('admin'), async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		).select('-passwordHash');
		res.json(user);
	} catch (err) { next(err); }
});
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
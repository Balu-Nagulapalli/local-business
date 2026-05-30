const router = require('express').Router();
const c = require('../controllers/business.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', c.getAll);
router.get('/admin/all', verifyToken, requireRole('admin'), c.adminGetAll);
router.get('/my', verifyToken, requireRole('owner', 'admin'), c.getMyListings);
router.get('/:slug', c.getOne);
router.post('/', verifyToken, requireRole('owner', 'admin'), c.create);
router.put('/:id', verifyToken, requireRole('owner', 'admin'), c.update);
router.delete('/:id', verifyToken, requireRole('owner', 'admin', 'admin'), c.remove);

module.exports = router;
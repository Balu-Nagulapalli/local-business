const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/category.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', getAll);
router.post('/', verifyToken, requireRole('admin'), create);
router.put('/:id', verifyToken, requireRole('admin'), update);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
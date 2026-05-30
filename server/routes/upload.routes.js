const router = require('express').Router();
const upload = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, upload.array('images', 5), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
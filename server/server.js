const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// security headers
app.use(helmet());

// rate limiting — 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/businesses', require('./routes/business.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// error handler
app.use(require('./middleware/error.middleware'));

// db + start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`✅ MongoDB connected`);
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server up — http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
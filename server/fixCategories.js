require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category.model');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Category.updateMany({}, { isActive: true });
  console.log('✅ All categories set to active');
  mongoose.disconnect();
});
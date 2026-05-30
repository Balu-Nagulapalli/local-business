require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category.model');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const cats = await Category.find({}, 'name coverImage');
  cats.forEach(c => console.log(c.name, '→', c.coverImage || 'NO IMAGE'));
  mongoose.disconnect();
});
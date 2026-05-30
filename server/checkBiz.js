require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('./models/Business.model');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const bizs = await Business.find({}, 'name coverImage images');
  bizs.forEach(b => console.log(b.name, '→', b.coverImage || 'NO IMAGE'));
  mongoose.disconnect();
});
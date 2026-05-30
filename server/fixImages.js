require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category.model');
const Business = require('./models/Business.model');

const categoryImages = {
  'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'healthcare': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
  'education': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
  'shopping': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  'professional-services': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
  'hotels': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'beauty': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
};

const businessImages = {
  'rayalaseema-ruchulu-hyderabad': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'iron-paradise-gym-hyderabad': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  'lakshmi-medicals-visakhapatnam': 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800',
  'code-garage-bangalore': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
  'the-wardrobe-edit-chennai': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
};

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  for (const [slug, url] of Object.entries(categoryImages)) {
    await Category.findOneAndUpdate({ slug }, { coverImage: url, cover_image: url });
    console.log(`Updated category: ${slug}`);
  }

  for (const [slug, url] of Object.entries(businessImages)) {
    await Business.findOneAndUpdate({ slug }, { 
      coverImage: url, 
      cover_image: url,
      images: [url] 
    });
    console.log(`Updated business: ${slug}`);
  }

  console.log('✅ Images updated!');
  mongoose.disconnect();
}

fix().catch(console.error);
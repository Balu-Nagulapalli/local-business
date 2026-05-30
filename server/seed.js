require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Category = require('./models/Category.model');
const Business = require('./models/Business.model');
const Review = require('./models/Review.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // clear existing
  await User.deleteMany();
  await Category.deleteMany();
  await Business.deleteMany();
  await Review.deleteMany();
  console.log('Cleared existing data');

  // create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@locale.in',
    passwordHash: 'admin123',
    role: 'admin',
  });

  // create owner user
  const owner = await User.create({
    name: 'Krishna',
    email: 'krishna@locale.in',
    passwordHash: 'owner123',
    role: 'owner',
  });

  // create regular user
  const regularUser = await User.create({
    name: 'Priya Sharma',
    email: 'priya@locale.in',
    passwordHash: 'user123',
    role: 'user',
  });

  console.log('Users created');

  // create categories
  const categories = await Category.insertMany([
    { name: 'Restaurants', slug: 'restaurants', description: 'Local dining and eateries', businessCount: 0 },
    { name: 'Healthcare', slug: 'healthcare', description: 'Hospitals, clinics and pharmacies', businessCount: 0 },
    { name: 'Education', slug: 'education', description: 'Schools, colleges and coaching', businessCount: 0 },
    { name: 'Shopping', slug: 'shopping', description: 'Retail stores and boutiques', businessCount: 0 },
    { name: 'Fitness', slug: 'fitness', description: 'Gyms and wellness centers', businessCount: 0 },
    { name: 'Professional Services', slug: 'professional-services', description: 'Legal, finance and consulting', businessCount: 0 },
    { name: 'Hotels', slug: 'hotels', description: 'Stay and accommodation', businessCount: 0 },
    { name: 'Beauty', slug: 'beauty', description: 'Salons and spas', businessCount: 0 },
  ]);

  console.log('Categories created');

  // create businesses
  const businesses = await Business.insertMany([
    {
      name: 'Rayalaseema Ruchulu',
      slug: 'rayalaseema-ruchulu-hyderabad',
      category: categories[0]._id,
      owner: owner._id,
      tagline: 'Fiery Andhra meals since 1987',
      description: 'Authentic Andhra meals, known for their fiery gongura mutton and paper-thin dosas. Family-run since 1987.',
      address: { street: '12 Jubilee Hills Rd', area: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
      contact: { phone: '9040001234', email: 'info@rayalaseemaruchulu.com', whatsapp: '9040001234' },
      hours: [
        { day: 'monday', openTime: '08:00', closeTime: '23:00', isClosed: false },
        { day: 'tuesday', openTime: '08:00', closeTime: '23:00', isClosed: false },
        { day: 'wednesday', openTime: '08:00', closeTime: '23:00', isClosed: false },
        { day: 'thursday', openTime: '08:00', closeTime: '23:00', isClosed: false },
        { day: 'friday', openTime: '08:00', closeTime: '23:00', isClosed: false },
        { day: 'saturday', openTime: '08:00', closeTime: '23:30', isClosed: false },
        { day: 'sunday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      ],
      location: { lat: 17.4318, lng: 78.4071 },
      tags: ['andhra-food', 'family-restaurant', 'veg-nonveg'],
      priceRange: '₹₹',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
      status: 'active',
      avgRating: 4.7,
      totalReviews: 128,
    },
    {
      name: 'Iron Paradise Gym',
      slug: 'iron-paradise-gym-hyderabad',
      category: categories[4]._id,
      owner: owner._id,
      tagline: 'Old-school lifting, no mirror selfies',
      description: 'Old-school bodybuilding gym. No mirror selfie crowd. Just serious lifters since 2009.',
      address: { street: '45 Banjara Hills', area: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034' },
      contact: { phone: '9040005678', whatsapp: '9040005678' },
      hours: [
        { day: 'monday', openTime: '05:00', closeTime: '23:00', isClosed: false },
        { day: 'tuesday', openTime: '05:00', closeTime: '23:00', isClosed: false },
        { day: 'wednesday', openTime: '05:00', closeTime: '23:00', isClosed: false },
        { day: 'thursday', openTime: '05:00', closeTime: '23:00', isClosed: false },
        { day: 'friday', openTime: '05:00', closeTime: '23:00', isClosed: false },
        { day: 'saturday', openTime: '05:00', closeTime: '22:00', isClosed: false },
        { day: 'sunday', openTime: '06:00', closeTime: '20:00', isClosed: false },
      ],
      location: { lat: 17.4156, lng: 78.4347 },
      tags: ['gym', 'bodybuilding', 'fitness'],
      priceRange: '₹₹',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
      status: 'active',
      avgRating: 4.6,
      totalReviews: 112,
    },
    {
      name: 'Lakshmi Medicals',
      slug: 'lakshmi-medicals-visakhapatnam',
      category: categories[1]._id,
      owner: owner._id,
      tagline: '24-hour pharmacy with home delivery',
      description: '24-hour pharmacy with home delivery. Trusted by the Seethammadhara neighbourhood for over two decades.',
      address: { street: '8 Seethammadhara Main Rd', area: 'Seethammadhara', city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530013' },
      contact: { phone: '9041112233', whatsapp: '9041112233' },
      hours: [
        { day: 'monday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'tuesday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'wednesday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'thursday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'friday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'saturday', openTime: '00:00', closeTime: '23:59', isClosed: false },
        { day: 'sunday', openTime: '00:00', closeTime: '23:59', isClosed: false },
      ],
      location: { lat: 17.7231, lng: 83.3012 },
      tags: ['pharmacy', '24-hours', 'home-delivery'],
      priceRange: '₹',
      isVerified: true,
      isApproved: true,
      isFeatured: false,
      status: 'active',
      avgRating: 4.2,
      totalReviews: 87,
    },
    {
      name: 'Code Garage',
      slug: 'code-garage-bangalore',
      category: categories[2]._id,
      owner: owner._id,
      tagline: 'Weekend bootcamps, real projects, no fluff',
      description: 'Weekend bootcamps for working professionals. Small batches, real projects, no fluff.',
      address: { street: '22 Koramangala 5th Block', area: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095' },
      contact: { phone: '9042223344', email: 'hello@codegarage.in', website: 'https://codegarage.in' },
      hours: [
        { day: 'monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        { day: 'tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        { day: 'wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        { day: 'thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        { day: 'friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
        { day: 'saturday', openTime: '10:00', closeTime: '17:00', isClosed: false },
        { day: 'sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
      ],
      location: { lat: 12.9352, lng: 77.6245 },
      tags: ['coding', 'bootcamp', 'weekend-classes'],
      priceRange: '₹₹₹',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
      status: 'active',
      avgRating: 4.9,
      totalReviews: 203,
    },
    {
      name: 'The Wardrobe Edit',
      slug: 'the-wardrobe-edit-chennai',
      category: categories[3]._id,
      owner: owner._id,
      tagline: 'Indian handloom meets contemporary silhouettes',
      description: 'Curated women\'s fashion — blends Indian handloom with contemporary silhouettes.',
      address: { street: '17 T Nagar Main Rd', area: 'T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017' },
      contact: { phone: '9043334455', whatsapp: '9043334455', instagram: '@thewardrobeedit' },
      hours: [
        { day: 'monday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'tuesday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'wednesday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'thursday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'friday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'saturday', openTime: '10:00', closeTime: '21:00', isClosed: false },
        { day: 'sunday', openTime: '11:00', closeTime: '19:00', isClosed: false },
      ],
      location: { lat: 13.0418, lng: 80.2341 },
      tags: ['fashion', 'handloom', 'women'],
      priceRange: '₹₹₹',
      isVerified: true,
      isApproved: true,
      isFeatured: false,
      status: 'active',
      avgRating: 4.5,
      totalReviews: 94,
    },
  ]);

  console.log('Businesses created');

  // create reviews
  await Review.insertMany([
    {
      business: businesses[0]._id,
      user: regularUser._id,
      rating: 5,
      title: 'Best Andhra food in Hyderabad',
      comment: 'The gongura mutton is absolutely incredible. Been coming here for years and the quality never drops.',
    },
    {
      business: businesses[0]._id,
      user: admin._id,
      rating: 4,
      title: 'Authentic and affordable',
      comment: 'Great flavors, very authentic. Gets crowded on weekends so go early.',
    },
    {
      business: businesses[1]._id,
      user: regularUser._id,
      rating: 5,
      title: 'Serious gym for serious people',
      comment: 'No nonsense gym. Equipment is solid, no overcrowding, trainers actually know what they are doing.',
    },
    {
      business: businesses[3]._id,
      user: regularUser._id,
      rating: 5,
      title: 'Best coding bootcamp',
      comment: 'Joined the React weekend batch. Got a job in 3 months. Worth every rupee.',
    },
    {
      business: businesses[4]._id,
      user: admin._id,
      rating: 4,
      title: 'Unique collection',
      comment: 'Love the handloom pieces. Pricing is fair for the quality. Staff is very helpful.',
    },
  ]);

  console.log('Reviews created');
  console.log('✅ Seed complete!');
  console.log('---');
  console.log('Admin login:  admin@locale.in  / admin123');
  console.log('Owner login:  krishna@locale.in / owner123');
  console.log('User login:   priya@locale.in   / user123');

  mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
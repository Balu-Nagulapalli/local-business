/*
  # Seed data: categories, businesses, and reviews

  1. Creates a system user via auth.users + profiles for seed reviews
  2. Inserts 6 categories
  3. Inserts 10 businesses with realistic Indian data
  4. Inserts 6 sample reviews

  Notes:
  - All businesses set as active + approved for demo
  - Cover images use Pexels stock photo URLs
  - A system user is created so reviews have a valid user_id reference
*/

-- Create a system user for seed reviews
-- We need an auth.users entry for the profiles FK
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'system@locale.seed',
  crypt('systemseed123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Locale System"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create the profile for the system user (bypasses RLS since this is a migration)
INSERT INTO profiles (id, name, email, role, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Locale System', 'system@locale.seed', 'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, description, icon, cover_image, business_count, is_active) VALUES
  ('Restaurants', 'restaurants', 'From fiery Andhra meals to subtle Hyderabadi dum biryani — discover where the city actually eats.', 'utensils', 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true),
  ('Healthcare', 'healthcare', 'Pharmacies, clinics, and diagnostic centres open when you need them.', 'heart-pulse', 'https://images.pexels.com/photos/40568/medical-appointment-doctor-40568.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
  ('Education', 'education', 'Bootcamps, coaching centres, and skill workshops that deliver results.', 'graduation-cap', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
  ('Shopping', 'shopping', 'Handloom stores, curated boutiques, and neighbourhood shops worth knowing about.', 'shopping-bag', 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
  ('Fitness', 'fitness', 'Old-school gyms, yoga studios, and CrossFit boxes — find your tribe.', 'dumbbell', 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
  ('Professional Services', 'professional-services', 'CAs, lawyers, architects — the people who keep things running.', 'briefcase', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Businesses
INSERT INTO businesses (name, slug, category_id, owner_id, tagline, description, address, contact, hours, images, cover_image, location, tags, price_range, is_verified, is_approved, is_featured, status, avg_rating, total_reviews, total_views) VALUES
  (
    'Rayalaseema Ruchulu', 'rayalaseema-ruchulu-hyderabad',
    (SELECT id FROM categories WHERE slug = 'restaurants'),
    '00000000-0000-0000-0000-000000000001',
    'Fiery Andhra meals since 1987',
    'Authentic Andhra meals, known for their fiery gongura mutton and paper-thin dosas. Family-run since 1987. The kind of place where the cook knows your spice tolerance by the third visit.',
    '{"street":"12-2-1, Madhapur Main Road","area":"Madhapur","city":"Hyderabad","state":"Telangana","pincode":"500081"}'::jsonb,
    '{"phone":"+91 98480 12345","alt_phone":"","email":"info@rayalaseemaruchulu.com","website":"","whatsapp":"+91 98480 12345"}'::jsonb,
    '[{"day":"monday","open_time":"11:00","close_time":"22:30","is_closed":false},{"day":"tuesday","open_time":"11:00","close_time":"22:30","is_closed":false},{"day":"wednesday","open_time":"11:00","close_time":"22:30","is_closed":false},{"day":"thursday","open_time":"11:00","close_time":"22:30","is_closed":false},{"day":"friday","open_time":"11:00","close_time":"22:30","is_closed":false},{"day":"saturday","open_time":"11:00","close_time":"23:00","is_closed":false},{"day":"sunday","open_time":"11:00","close_time":"23:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":17.449259,"lng":78.391328}'::jsonb,
    '{"veg-only","home-delivery","parking","family-friendly"}'::text[],
    '₹₹', true, true, true, 'active', 4.7, 128, 3420
  ),
  (
    'Lakshmi Medicals & General Stores', 'lakshmi-medicals-visakhapatnam',
    (SELECT id FROM categories WHERE slug = 'healthcare'),
    '00000000-0000-0000-0000-000000000001',
    '24-hour pharmacy, trusted since 2002',
    '24-hour pharmacy with home delivery. Trusted by the Seethammadhara neighbourhood for over two decades. They stock everything from prescription meds to Ayurvedic basics, and the staff actually knows what they are talking about.',
    '{"street":"45-9-12, Seethammadhara Road","area":"Seethammadhara","city":"Visakhapatnam","state":"Andhra Pradesh","pincode":"530013"}'::jsonb,
    '{"phone":"+91 89125 67890","alt_phone":"+91 89125 67891","email":"lakshmimedicals@gmail.com","website":"","whatsapp":"+91 89125 67890"}'::jsonb,
    '[{"day":"monday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"tuesday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"wednesday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"thursday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"friday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"saturday","open_time":"00:00","close_time":"23:59","is_closed":false},{"day":"sunday","open_time":"00:00","close_time":"23:59","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/40568/medical-appointment-doctor-40568.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":17.725818,"lng":83.328456}'::jsonb,
    '{"24-hour","home-delivery","ayurvedic","insurance-accepted"}'::text[],
    '₹', true, true, true, 'active', 4.2, 64, 1890
  ),
  (
    'Code Garage', 'code-garage-bangalore',
    (SELECT id FROM categories WHERE slug = 'education'),
    '00000000-0000-0000-0000-000000000001',
    'No-fluff weekend bootcamps',
    'Weekend bootcamps for working professionals. Small batches, real projects, no fluff. Founded by two ex-Googlers who got tired of seeing 200-person batches produce zero employable devs. Batches max out at 15, and every project ships to a real URL.',
    '{"street":"3rd Floor, 27th Main, HSR Layout","area":"HSR Layout","city":"Bangalore","state":"Karnataka","pincode":"560102"}'::jsonb,
    '{"phone":"+91 80412 34567","alt_phone":"","email":"hello@codegarage.dev","website":"https://codegarage.dev","whatsapp":""}'::jsonb,
    '[{"day":"monday","open_time":"09:00","close_time":"18:00","is_closed":false},{"day":"tuesday","open_time":"09:00","close_time":"18:00","is_closed":false},{"day":"wednesday","open_time":"09:00","close_time":"18:00","is_closed":false},{"day":"thursday","open_time":"09:00","close_time":"18:00","is_closed":false},{"day":"friday","open_time":"09:00","close_time":"18:00","is_closed":false},{"day":"saturday","open_time":"09:00","close_time":"20:00","is_closed":false},{"day":"sunday","open_time":"10:00","close_time":"14:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":12.911677,"lng":77.638025}'::jsonb,
    '{"weekend-batches","placement-assistance","small-batches","live-projects"}'::text[],
    '₹₹₹', true, true, true, 'active', 4.9, 87, 4560
  ),
  (
    'The Wardrobe Edit', 'the-wardrobe-edit-chennai',
    (SELECT id FROM categories WHERE slug = 'shopping'),
    '00000000-0000-0000-0000-000000000001',
    'Handloom meets contemporary fashion',
    'Curated women''s fashion — blends Indian handloom with contemporary silhouettes. Every piece is sourced directly from weaver cooperatives in Kanchipuram and Chanderi. No mass production, no polyester pretending to be silk.',
    '{"street":"14, Wallace Garden Road","area":"Nungambakkam","city":"Chennai","state":"Tamil Nadu","pincode":"600034"}'::jsonb,
    '{"phone":"+91 44 2827 8901","alt_phone":"","email":"shop@wardrobeedit.in","website":"https://wardrobeedit.in","whatsapp":"+91 98401 23456"}'::jsonb,
    '[{"day":"monday","open_time":"10:30","close_time":"19:30","is_closed":false},{"day":"tuesday","open_time":"10:30","close_time":"19:30","is_closed":false},{"day":"wednesday","open_time":"10:30","close_time":"19:30","is_closed":false},{"day":"thursday","open_time":"10:30","close_time":"19:30","is_closed":false},{"day":"friday","open_time":"10:30","close_time":"19:30","is_closed":false},{"day":"saturday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"sunday","open_time":"11:00","close_time":"17:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":13.056340,"lng":80.240126}'::jsonb,
    '{"handloom","sustainable-fashion","custom-stitching","trials-available"}'::text[],
    '₹₹₹', true, true, true, 'active', 4.5, 93, 2780
  ),
  (
    'Iron Paradise Gym', 'iron-paradise-gym-hyderabad',
    (SELECT id FROM categories WHERE slug = 'fitness'),
    '00000000-0000-0000-0000-000000000001',
    'Old-school lifting, no mirror selfies',
    'Old-school bodybuilding gym. No mirror selfie crowd. Just serious lifters since 2009. Founder Ravi was a state-level powerlifter who built this place because every gym in the area was becoming a wellness spa. Has the only competition-grade squat rack in Jubilee Hills.',
    '{"street":"8-2-293/82/A, Road No. 36","area":"Jubilee Hills","city":"Hyderabad","state":"Telangana","pincode":"500033"}'::jsonb,
    '{"phone":"+91 98490 56789","alt_phone":"","email":"ironparadise@gmail.com","website":"","whatsapp":"+91 98490 56789"}'::jsonb,
    '[{"day":"monday","open_time":"05:30","close_time":"22:00","is_closed":false},{"day":"tuesday","open_time":"05:30","close_time":"22:00","is_closed":false},{"day":"wednesday","open_time":"05:30","close_time":"22:00","is_closed":false},{"day":"thursday","open_time":"05:30","close_time":"22:00","is_closed":false},{"day":"friday","open_time":"05:30","close_time":"22:00","is_closed":false},{"day":"saturday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"sunday","open_time":"07:00","close_time":"14:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":17.432670,"lng":78.407210}'::jsonb,
    '{"powerlifting","personal-training","competition-prep","no-contract"}'::text[],
    '₹₹', true, true, true, 'active', 4.6, 112, 3100
  ),
  (
    'Spice Kitchen', 'spice-kitchen-bangalore',
    (SELECT id FROM categories WHERE slug = 'restaurants'),
    '00000000-0000-0000-0000-000000000001',
    'Koramangala favourite for coastal cuisine',
    'Coastal Karnataka cuisine in the heart of Koramangala. Known for their fish curry meals and neer dosa. Tiny place, always packed. No reservations — come early or wait.',
    '{"street":"45, 1st Cross, 5th Block","area":"Koramangala","city":"Bangalore","state":"Karnataka","pincode":"560095"}'::jsonb,
    '{"phone":"+91 80 2552 7890","alt_phone":"","email":"","website":"","whatsapp":""}'::jsonb,
    '[{"day":"monday","open_time":"12:00","close_time":"15:00","is_closed":false},{"day":"tuesday","open_time":"12:00","close_time":"15:00","is_closed":false},{"day":"wednesday","open_time":"12:00","close_time":"22:00","is_closed":false},{"day":"thursday","open_time":"12:00","close_time":"22:00","is_closed":false},{"day":"friday","open_time":"12:00","close_time":"22:30","is_closed":false},{"day":"saturday","open_time":"12:00","close_time":"22:30","is_closed":false},{"day":"sunday","open_time":"12:00","close_time":"22:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":12.935195,"lng":77.624535}'::jsonb,
    '{"seafood","coastal-food","no-reservations"}'::text[],
    '₹₹', false, true, false, 'active', 4.3, 56, 1340
  ),
  (
    'Zenith CA Associates', 'zenith-ca-associates-hyderabad',
    (SELECT id FROM categories WHERE slug = 'professional-services'),
    '00000000-0000-0000-0000-000000000001',
    'Tax, audit, and compliance sorted',
    'Chartered accountancy firm specialising in SME tax compliance and GST filings. The senior partner has 22 years of experience dealing with the Telangana commercial tax department. Not the cheapest, but you will not get a notice.',
    '{"street":"6-1-1, Padmarao Nagar","area":"Secunderabad","city":"Hyderabad","state":"Telangana","pincode":"500025"}'::jsonb,
    '{"phone":"+91 40 2789 0123","alt_phone":"","email":"cas@zenithca.com","website":"https://zenithca.com","whatsapp":""}'::jsonb,
    '[{"day":"monday","open_time":"09:30","close_time":"18:00","is_closed":false},{"day":"tuesday","open_time":"09:30","close_time":"18:00","is_closed":false},{"day":"wednesday","open_time":"09:30","close_time":"18:00","is_closed":false},{"day":"thursday","open_time":"09:30","close_time":"18:00","is_closed":false},{"day":"friday","open_time":"09:30","close_time":"18:00","is_closed":false},{"day":"saturday","open_time":"09:30","close_time":"14:00","is_closed":false},{"day":"sunday","open_time":"","close_time":"","is_closed":true}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":17.439979,"lng":78.498235}'::jsonb,
    '{"gst-filing","tax-audit","company-registration","sme-specialist"}'::text[],
    '₹₹₹', true, true, false, 'active', 4.4, 41, 890
  ),
  (
    'Vijayawada Homeopathy Clinic', 'vijayawada-homeopathy-clinic',
    (SELECT id FROM categories WHERE slug = 'healthcare'),
    '00000000-0000-0000-0000-000000000001',
    'Gentle healing, 15 years of practice',
    'Dr. Srinivas practices classical homeopathy with a focus on chronic skin conditions and respiratory issues. Patients travel from as far as Guntur for weekly constitutional remedies.',
    '{"street":"29-5-32, Governorpet","area":"Governorpet","city":"Vijayawada","state":"Andhra Pradesh","pincode":"520002"}'::jsonb,
    '{"phone":"+91 86624 56789","alt_phone":"","email":"drsrinivas@homeopathy.in","website":"","whatsapp":"+91 86624 56789"}'::jsonb,
    '[{"day":"monday","open_time":"09:00","close_time":"13:00","is_closed":false},{"day":"tuesday","open_time":"09:00","close_time":"13:00","is_closed":false},{"day":"wednesday","open_time":"09:00","close_time":"13:00","is_closed":false},{"day":"thursday","open_time":"16:00","close_time":"20:00","is_closed":false},{"day":"friday","open_time":"09:00","close_time":"13:00","is_closed":false},{"day":"saturday","open_time":"09:00","close_time":"14:00","is_closed":false},{"day":"sunday","open_time":"","close_time":"","is_closed":true}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":16.519320,"lng":80.630490}'::jsonb,
    '{"homeopathy","skin-specialist","chronic-care","appointment-only"}'::text[],
    '₹', false, true, false, 'active', 4.1, 28, 620
  ),
  (
    'Chennai Yoga Studio', 'chennai-yoga-studio',
    (SELECT id FROM categories WHERE slug = 'fitness'),
    '00000000-0000-0000-0000-000000000001',
    'Iyengar yoga in Alwarpet',
    'Dedicated Iyengar yoga studio with rope walls and props. Founder Lakshmi trained directly at the Ramamani Iyengar Memorial Yoga Institute in Pune. Morning batches for seniors, evening batches for working folks.',
    '{"street":"15, 3rd Street, Abhiramapuram","area":"Alwarpet","city":"Chennai","state":"Tamil Nadu","pincode":"600018"}'::jsonb,
    '{"phone":"+91 44 2434 1234","alt_phone":"","email":"info@chennaiyoga.in","website":"","whatsapp":""}'::jsonb,
    '[{"day":"monday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"tuesday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"wednesday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"thursday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"friday","open_time":"06:00","close_time":"20:00","is_closed":false},{"day":"saturday","open_time":"06:00","close_time":"18:00","is_closed":false},{"day":"sunday","open_time":"07:00","close_time":"12:00","is_closed":false}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":13.047800,"lng":80.251000}'::jsonb,
    '{"iyengar-yoga","senior-batches","rope-wall","beginner-friendly"}'::text[],
    '₹₹', true, true, false, 'active', 4.8, 72, 1980
  ),
  (
    'Pune Book Corner', 'pune-book-corner',
    (SELECT id FROM categories WHERE slug = 'shopping'),
    '00000000-0000-0000-0000-000000000001',
    'Second-hand books, first-hand knowledge',
    'A hole-in-the-wall second-hand bookshop that has been running since 1995. Stacks go floor to ceiling, there is a resident cat named Mogambo, and the owner Ashok can find you any Marathi title within 48 hours.',
    '{"street":"22, Tulshibaugh","area":"Tulshibaugh","city":"Pune","state":"Maharashtra","pincode":"411002"}'::jsonb,
    '{"phone":"+91 20 2445 6789","alt_phone":"","email":"","website":"","whatsapp":""}'::jsonb,
    '[{"day":"monday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"tuesday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"wednesday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"thursday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"friday","open_time":"10:00","close_time":"20:00","is_closed":false},{"day":"saturday","open_time":"10:00","close_time":"21:00","is_closed":false},{"day":"sunday","open_time":"","close_time":"","is_closed":true}]'::jsonb,
    '{}'::text[],
    'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1200',
    '{"lat":18.519580,"lng":73.855350}'::jsonb,
    '{"second-hand","marathi-books","rare-finds","cash-only"}'::text[],
    '₹', false, true, false, 'active', 4.0, 34, 750
  )
ON CONFLICT (slug) DO NOTHING;

-- Reviews
INSERT INTO reviews (business_id, user_id, rating, title, comment, is_hidden, helpful_count, created_at) VALUES
  ((SELECT id FROM businesses WHERE slug = 'rayalaseema-ruchulu-hyderabad'), '00000000-0000-0000-0000-000000000001', 5, 'Best gongura in the city', 'I have been coming here for 6 years. The gongura mutton is genuinely the best in Hyderabad. Do not skip the appetisers either.', false, 14, now() - interval '3 days'),
  ((SELECT id FROM businesses WHERE slug = 'rayalaseema-ruchulu-hyderabad'), '00000000-0000-0000-0000-000000000001', 4, 'Spicy but worth it', 'Authentic taste, but be warned — their spice levels are not for the faint-hearted. The dosas are paper-thin as promised.', false, 8, now() - interval '1 week'),
  ((SELECT id FROM businesses WHERE slug = 'code-garage-bangalore'), '00000000-0000-0000-0000-000000000001', 5, 'Got placed within 3 months', 'Joined the full-stack weekend batch. Small class, real project, and I got placed at a startup within 3 months of finishing.', false, 22, now() - interval '5 days'),
  ((SELECT id FROM businesses WHERE slug = 'the-wardrobe-edit-chennai'), '00000000-0000-0000-0000-000000000001', 5, 'Finally a store that respects handloom', 'Meera curates with actual taste. Bought a Chanderi kurta that gets compliments every time I wear it. The fitting is impeccable.', false, 11, now() - interval '2 weeks'),
  ((SELECT id FROM businesses WHERE slug = 'iron-paradise-gym-hyderabad'), '00000000-0000-0000-0000-000000000001', 4, 'No frills, just iron', 'This is a real gym. No smoothie bar, no pretty lights. Just heavy iron and people who know what they are doing.', false, 9, now() - interval '4 days'),
  ((SELECT id FROM businesses WHERE slug = 'lakshmi-medicals-visakhapatnam'), '00000000-0000-0000-0000-000000000001', 4, 'Open at 2 AM when you need them', 'Had to get medicine at 2 AM after my kid got fever. They were open and the pharmacist was actually helpful, not half-asleep.', false, 6, now() - interval '1 month')
ON CONFLICT DO NOTHING;

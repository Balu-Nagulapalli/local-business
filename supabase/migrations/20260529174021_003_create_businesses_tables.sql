/*
  # Create saved_businesses and businesses tables

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, unique, not null)
      - `category_id` (uuid, references categories)
      - `owner_id` (uuid, references profiles)
      - `tagline` (text)
      - `description` (text)
      - `address` (jsonb: street, area, city, state, pincode)
      - `contact` (jsonb: phone, alt_phone, email, website, whatsapp)
      - `hours` (jsonb array: day, open_time, close_time, is_closed)
      - `images` (text array)
      - `cover_image` (text)
      - `location` (jsonb: lat, lng)
      - `tags` (text array)
      - `price_range` (text: ₹, ₹₹, ₹₹₹, ₹₹₹₹)
      - `is_verified` (boolean, default false)
      - `is_approved` (boolean, default false)
      - `is_featured` (boolean, default false)
      - `status` (text: active/pending/rejected, default pending)
      - `avg_rating` (numeric, default 0)
      - `total_reviews` (integer, default 0)
      - `total_views` (integer, default 0)
      - `created_at` (timestamptz, default now())

    - `saved_businesses`
      - `user_id` (uuid, references profiles)
      - `business_id` (uuid, references businesses)
      - `created_at` (timestamptz, default now())
      - Composite primary key on (user_id, business_id)

  2. Indexes
    - idx_businesses_slug on businesses(slug)
    - idx_businesses_category on businesses(category_id)
    - idx_businesses_city on businesses using GIN on address->city
    - idx_businesses_status on businesses(status)

  3. Security
    - Enable RLS on both tables
    - Anyone can read approved/active businesses
    - Owners can read/update own businesses
    - Admins can read/update/delete any business
    - Users can save/unsave businesses for themselves
*/

CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tagline text DEFAULT '',
  description text DEFAULT '',
  address jsonb DEFAULT '{}'::jsonb,
  contact jsonb DEFAULT '{}'::jsonb,
  hours jsonb DEFAULT '[]'::jsonb,
  images text[] DEFAULT '{}',
  cover_image text DEFAULT '',
  location jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  price_range text DEFAULT '₹' CHECK (price_range IN ('₹', '₹₹', '₹₹₹', '₹₹₹₹')),
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'rejected')),
  avg_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

CREATE TABLE IF NOT EXISTS saved_businesses (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, business_id)
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_businesses ENABLE ROW LEVEL SECURITY;

-- Businesses: anyone can read active/approved
CREATE POLICY "Anyone can read active businesses"
  ON businesses FOR SELECT
  TO authenticated, anon
  USING (status = 'active' AND is_approved = true);

-- Owners can read own businesses (including pending/rejected)
CREATE POLICY "Owners can read own businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Admins can read all businesses
CREATE POLICY "Admins can read all businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Owners can insert businesses
CREATE POLICY "Owners can insert businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('owner', 'admin')
    )
  );

-- Owners can update own businesses
CREATE POLICY "Owners can update own businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admins can update any business
CREATE POLICY "Admins can update any business"
  ON businesses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admins can delete businesses
CREATE POLICY "Admins can delete businesses"
  ON businesses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Saved businesses
CREATE POLICY "Users can read own saved businesses"
  ON saved_businesses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can save businesses"
  ON saved_businesses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave businesses"
  ON saved_businesses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

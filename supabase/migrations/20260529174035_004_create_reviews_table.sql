/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `title` (text) — short review headline
      - `comment` (text)
      - `is_hidden` (boolean, default false)
      - `helpful_count` (integer, default 0)
      - `created_at` (timestamptz, default now())

  2. Indexes
    - idx_reviews_business on reviews(business_id)
    - idx_reviews_user on reviews(user_id)
    - Unique constraint on (business_id, user_id) — one review per user per business

  3. Security
    - Enable RLS on reviews
    - Anyone can read non-hidden reviews
    - Authenticated users can insert reviews
    - Users can update/delete own reviews
    - Admins can update/delete any review
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text DEFAULT '',
  comment text DEFAULT '',
  is_hidden boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (business_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible reviews"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (is_hidden = false);

-- Users can also read their own hidden reviews
CREATE POLICY "Users can read own hidden reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all reviews
CREATE POLICY "Admins can read all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update any review"
  ON reviews FOR UPDATE
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

CREATE POLICY "Admins can delete any review"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

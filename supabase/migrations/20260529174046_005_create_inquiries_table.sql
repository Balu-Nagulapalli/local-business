/*
  # Create inquiries table for owner messages

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `sender_id` (uuid, references profiles)
      - `name` (text) — sender display name
      - `email` (text) — sender email
      - `phone` (text) — sender phone
      - `message` (text)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz, default now())

  2. Indexes
    - idx_inquiries_business on inquiries(business_id)

  3. Security
    - Enable RLS on inquiries
    - Business owners can read inquiries for their businesses
    - Authenticated users can send inquiries
    - Admins can read all inquiries
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  message text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_business ON inquiries(business_id);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read inquiries for their businesses"
  ON inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = inquiries.business_id AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can send inquiries"
  ON inquiries FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Owners can update inquiries for their businesses"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = inquiries.business_id AND businesses.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = inquiries.business_id AND businesses.owner_id = auth.uid()
    )
  );

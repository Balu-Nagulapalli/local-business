/*
  # Create increment_views RPC function

  1. New Function
    - `increment_views(business_id uuid)` — atomically increments total_views for a business
  
  2. Security
    - SECURITY DEFINER so anyone (including anon) can call it
    - Only increments views, no other data access
*/

CREATE OR REPLACE FUNCTION increment_views(business_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE businesses
  SET total_views = total_views + 1
  WHERE id = business_id;
END;
$$;

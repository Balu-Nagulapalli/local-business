/*
  # Create admin_stats RPC function

  1. New Function
    - `admin_stats()` — returns a JSON object with total counts for the admin dashboard
  
  2. Security
    - SECURITY DEFINER with admin check
    - Returns: { total_businesses, total_users, total_reviews, pending_businesses }
*/

CREATE OR REPLACE FUNCTION admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- verify admin role
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT json_build_object(
    'totalBusinesses', (SELECT count(*) FROM businesses),
    'totalUsers', (SELECT count(*) FROM profiles),
    'totalReviews', (SELECT count(*) FROM reviews),
    'pendingBusinesses', (SELECT count(*) FROM businesses WHERE status = 'pending')
  ) INTO result;

  RETURN result;
END;
$$;

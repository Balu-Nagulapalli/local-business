import { supabase } from './supabase';

// ─── Types ──────────────────────────────────────────────
export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string;
  business_count: number;
  is_active: boolean;
}

export interface BusinessRow {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  owner_id: string | null;
  tagline: string;
  description: string;
  address: {
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  contact: {
    phone?: string;
    alt_phone?: string;
    email?: string;
    website?: string;
    whatsapp?: string;
  };
  hours: Array<{
    day: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }>;
  images: string[];
  cover_image: string;
  location: { lat: number; lng: number };
  tags: string[];
  price_range: string;
  is_verified: boolean;
  is_approved: boolean;
  is_featured: boolean;
  status: string;
  avg_rating: number;
  total_reviews: number;
  total_views: number;
  created_at: string;
  // joined
  categories?: CategoryRow;
  review_stats?: { avg: number; total: number; distribution: number[] };
}

export interface ReviewRow {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  is_hidden: boolean;
  helpful_count: number;
  created_at: string;
  profiles?: { name: string; email: string };
}

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

// ─── Categories ─────────────────────────────────────────
export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

// ─── Businesses ────────────────────────────────────────
export async function fetchBusinesses(opts: {
  city?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}): Promise<{ businesses: BusinessRow[]; total: number }> {
  const { city, category, search, page = 1, limit = 12, featured } = opts;

  let query = supabase
    .from('businesses')
    .select('*, categories!category_id(*)', { count: 'exact' })
    .eq('status', 'active')
    .eq('is_approved', true);

  if (city) {
    // jsonb text search on address->city
    query = query.ilike('address->>city', `%${city}%`);
  }
  if (category) {
    // join filter — we match by category slug
    // supabase doesn't let us filter on joined columns easily, so we do it in two steps
  }
  if (featured) {
    query = query.eq('is_featured', true);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1).order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw error;

  let businesses = (data ?? []) as BusinessRow[];

  // if category filter specified, filter client-side by category slug
  if (category && businesses.length > 0) {
    businesses = businesses.filter((b) => b.categories?.slug === category);
  }

  return { businesses, total: count ?? 0 };
}

export async function fetchBusinessBySlug(slug: string): Promise<BusinessRow | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*, categories!category_id(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as BusinessRow | null;
}

export async function fetchFeaturedBusinesses(city?: string): Promise<BusinessRow[]> {
  const { businesses } = await fetchBusinesses({ featured: true, city, limit: 8 });
  return businesses;
}

export async function incrementBusinessViews(businessId: string): Promise<void> {
  // RPC call would be ideal, but we can do an update
  const { error } = await supabase.rpc('increment_views', { business_id: businessId });
  // if the RPC doesn't exist, that's fine — non-critical
  if (error && !error.message.includes('does not exist')) {
    console.warn('View increment failed:', error.message);
  }
}

// ─── Reviews ───────────────────────────────────────────
export async function fetchReviews(businessId: string): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles:user_id(name, email)')
    .eq('business_id', businessId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createReview(businessId: string, rating: number, title: string, comment: string): Promise<ReviewRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reviews')
    .insert({ business_id: businessId, user_id: user.id, rating, title, comment })
    .select('*, profiles:user_id(name, email)')
    .single();
  if (error) throw error;
  return data as ReviewRow;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) throw error;
}

// ─── Saved Businesses ──────────────────────────────────
export async function fetchSavedBusinesses(): Promise<BusinessRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_businesses')
    .select('business_id, businesses:business_id(*, categories!category_id(*))')
    .eq('user_id', user.id);
  if (error) throw error;

  return (data ?? []).map((s: any) => s.businesses) as BusinessRow[];
}

export async function toggleSaveBusiness(businessId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // check if already saved
  const { data: existing } = await supabase
    .from('saved_businesses')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('business_id', businessId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('saved_businesses')
      .delete()
      .eq('user_id', user.id)
      .eq('business_id', businessId);
    if (error) throw error;
    return false; // unsaved
  } else {
    const { error } = await supabase
      .from('saved_businesses')
      .insert({ user_id: user.id, business_id: businessId });
    if (error) throw error;
    return true; // saved
  }
}

export async function isBusinessSaved(businessId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_businesses')
    .select('business_id')
    .eq('user_id', user.id)
    .eq('business_id', businessId)
    .maybeSingle();

  return !!data;
}

// ─── Inquiries ─────────────────────────────────────────
export async function sendInquiry(businessId: string, message: string, phone?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  const { error } = await supabase.from('inquiries').insert({
    business_id: businessId,
    sender_id: user?.id ?? null,
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: phone ?? '',
    message,
  });
  if (error) throw error;
}

export async function fetchOwnerInquiries(): Promise<any[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, businesses!business_id(id, name, slug)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ─── Profile ───────────────────────────────────────────
export async function fetchProfile(): Promise<ProfileRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data as ProfileRow;
}

export async function updateProfile(updates: Partial<ProfileRow>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);
  if (error) throw error;
}

// ─── Owner: manage businesses ───────────────────────────
export async function fetchOwnerBusinesses(): Promise<BusinessRow[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*, categories!category_id(*)')
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BusinessRow[];
}

export async function createBusiness(biz: Partial<BusinessRow>): Promise<BusinessRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const slug = biz.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (biz.address?.city ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      ...biz,
      owner_id: user.id,
      slug,
      status: 'pending',
      is_approved: false,
      is_verified: false,
      is_featured: false,
      avg_rating: 0,
      total_reviews: 0,
      total_views: 0,
    })
    .select('*, categories!category_id(*)')
    .single();
  if (error) throw error;
  return data as BusinessRow;
}

export async function updateBusiness(id: string, updates: Partial<BusinessRow>): Promise<void> {
  const { error } = await supabase.from('businesses').update(updates).eq('id', id);
  if (error) throw error;
}

// ─── Admin ─────────────────────────────────────────────
export async function fetchAllBusinesses(opts?: { status?: string }): Promise<BusinessRow[]> {
  let query = supabase
    .from('businesses')
    .select('*, categories!category_id(*), profiles:owner_id(name, email)')
    .order('created_at', { ascending: false });

  if (opts?.status) {
    query = query.eq('status', opts.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as BusinessRow[];
}

export async function fetchAllUsers(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles:user_id(name, email), businesses!business_id(name, slug)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateBusiness(id: string, updates: Partial<BusinessRow>): Promise<void> {
  const { error } = await supabase.from('businesses').update(updates).eq('id', id);
  if (error) throw error;
}

export async function adminUpdateUser(id: string, updates: Partial<ProfileRow>): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

export async function adminToggleReviewVisibility(id: string, isHidden: boolean): Promise<void> {
  const { error } = await supabase.from('reviews').update({ is_hidden: isHidden }).eq('id', id);
  if (error) throw error;
}

export async function fetchAdminStats(): Promise<{
  totalBusinesses: number;
  totalUsers: number;
  totalReviews: number;
  pendingBusinesses: number;
}> {
  try {
    const { data, error } = await supabase.rpc('admin_stats');
    if (error) throw error;
    return data as any;
  } catch {
    // fallback if rpc fails — use individual counts (limited by RLS for non-admins)
    const [bizRes, userRes, reviewRes, pendingRes] = await Promise.all([
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    return {
      totalBusinesses: bizRes.count ?? 0,
      totalUsers: userRes.count ?? 0,
      totalReviews: reviewRes.count ?? 0,
      pendingBusinesses: pendingRes.count ?? 0,
    };
  }
}

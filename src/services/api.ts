import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export interface CategoryRow {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  cover_image: string;
  coverImage: string;
  business_count: number;
  businessCount: number;
  is_active: boolean;
  isActive: boolean;
}

export interface BusinessRow {
  _id: string;
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category: CategoryRow;
  owner_id: string;
  owner: any;
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
    altPhone?: string;
    email?: string;
    website?: string;
    whatsapp?: string;
  };
  hours: Array<{
    day: string;
    open_time?: string;
    openTime?: string;
    close_time?: string;
    closeTime?: string;
    is_closed?: boolean;
    isClosed?: boolean;
  }>;
  images: string[];
  cover_image: string;
  coverImage: string;
  location: { lat: number; lng: number };
  tags: string[];
  price_range: string;
  priceRange: string;
  is_verified: boolean;
  isVerified: boolean;
  is_approved: boolean;
  isApproved: boolean;
  is_featured: boolean;
  isFeatured: boolean;
  status: string;
  avg_rating: number;
  avgRating: number;
  total_reviews: number;
  totalReviews: number;
  total_views: number;
  totalViews: number;
  created_at: string;
  createdAt: string;
  categories?: CategoryRow;
}

export interface ReviewRow {
  _id: string;
  id: string;
  business_id: string;
  business: string;
  user_id: string;
  user: { _id: string; name: string; avatar: string };
  rating: number;
  title: string;
  comment: string;
  is_hidden: boolean;
  isHidden: boolean;
  helpful_count: number;
  helpfulCount: number;
  created_at: string;
  createdAt: string;
  profiles?: { name: string; email: string };
}

export interface ProfileRow {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  is_active: boolean;
  isActive: boolean;
  last_login: string | null;
  lastLogin: string | null;
  created_at: string;
  createdAt: string;
}

export async function registerUser(
  name: string, email: string, password: string, role: string
) {
  const { data } = await api.post('/auth/register', { name, email, password, role });
  localStorage.setItem('token', data.token);
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
}

export async function logoutUser() {
  localStorage.removeItem('token');
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.user;
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data } = await api.get('/categories');
  return data;
}

export async function fetchBusinesses(opts: {
  city?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  rating?: number;
}): Promise<{ businesses: BusinessRow[]; total: number }> {
  const params: any = {};
  if (opts.city) params.city = opts.city;
  if (opts.category) params.category = opts.category;
  if (opts.search) params.search = opts.search;
  if (opts.page) params.page = opts.page;
  if (opts.limit) params.limit = opts.limit;
  if (opts.featured) params.featured = true;
  if (opts.rating) params.rating = opts.rating;

  const { data } = await api.get('/businesses', { params });
  return data;
}

export async function fetchBusinessBySlug(slug: string): Promise<BusinessRow | null> {
  const { data } = await api.get(`/businesses/${slug}`);
  return data;
}

export async function fetchFeaturedBusinesses(city?: string): Promise<BusinessRow[]> {
  const { businesses } = await fetchBusinesses({ featured: true, city, limit: 8 });
  return businesses;
}

export async function incrementBusinessViews(businessId: string): Promise<void> {
}

export async function createBusiness(biz: Partial<BusinessRow>): Promise<BusinessRow> {
  const { data } = await api.post('/businesses', biz);
  return data;
}

export async function updateBusiness(id: string, updates: Partial<BusinessRow>): Promise<void> {
  await api.put(`/businesses/${id}`, updates);
}

export async function fetchOwnerBusinesses(): Promise<BusinessRow[]> {
  const { data } = await api.get('/businesses/my');
  return data;
}

export async function fetchReviews(businessId: string): Promise<ReviewRow[]> {
  const { data } = await api.get(`/reviews/business/${businessId}`);
  return data;
}

export async function fetchMyReviews(): Promise<ReviewRow[]> {
  const { data } = await api.get('/reviews/user/my');
  return data;
}

export async function createReview(
  businessId: string, rating: number, title: string, comment: string
): Promise<ReviewRow> {
  const { data } = await api.post(`/reviews/${businessId}`, { rating, title, comment });
  return data;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

export async function fetchSavedBusinesses(): Promise<BusinessRow[]> {
  const { data } = await api.get('/users/saved');
  return data;
}

export async function toggleSaveBusiness(businessId: string): Promise<boolean> {
  const { data } = await api.post(`/users/saved/${businessId}`);
  return data.saved;
}

export async function isBusinessSaved(businessId: string): Promise<boolean> {
  const { data } = await api.get(`/users/saved/${businessId}`);
  return data.saved;
}

export async function fetchProfile(): Promise<ProfileRow | null> {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

export async function updateProfile(updates: Partial<ProfileRow>): Promise<void> {
  await api.put('/users/profile', updates);
}

export async function sendInquiry(
  businessId: string, message: string, phone?: string
): Promise<void> {
  await api.post(`/inquiries/${businessId}`, { message, phone });
}

export async function fetchOwnerInquiries(): Promise<any[]> {
  const { data } = await api.get('/inquiries/my');
  return data;
}

export async function fetchAllBusinesses(): Promise<BusinessRow[]> {
  const { data } = await api.get('/businesses/admin/all');
  return data;
}

export async function fetchAllUsers(): Promise<ProfileRow[]> {
  const { data } = await api.get('/users');
  return data;
}

export async function fetchAllReviews(): Promise<ReviewRow[]> {
  const { data } = await api.get('/reviews/admin/all');
  return data;
}

export async function adminUpdateBusiness(
  id: string, updates: Partial<BusinessRow>
): Promise<void> {
  await api.put(`/businesses/${id}`, updates);
}

export async function adminUpdateUser(
  id: string, updates: Partial<ProfileRow>
): Promise<void> {
  await api.put(`/users/${id}`, updates);
}

export async function adminDeleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}

export async function adminToggleReviewVisibility(
  id: string, isHidden: boolean
): Promise<void> {
  await api.put(`/reviews/${id}/hide`, { isHidden });
}

export async function fetchAdminStats(): Promise<{
  totalBusinesses: number;
  totalUsers: number;
  totalReviews: number;
  pendingBusinesses: number;
}> {
  const { data } = await api.get('/admin/stats');
  return data;
}
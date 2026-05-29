import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBusinessBySlug, fetchBusinesses, fetchReviews, incrementBusinessViews, toggleSaveBusiness, isBusinessSaved } from '../services/api';
import type { BusinessRow, ReviewRow } from '../services/api';
import StarRating from '../components/ui/StarRating';
import PriceRange from '../components/ui/PriceRange';
import RatingBar from '../components/ui/RatingBar';
import ReviewCard from '../components/business/ReviewCard';
import ReviewForm from '../components/business/ReviewForm';
import ContactSidebar from '../components/business/ContactSidebar';
import BusinessMap from '../components/business/BusinessMap';
import Gallery from '../components/business/Gallery';
import BusinessCard from '../components/ui/BusinessCard';
import { useAuth } from '../hooks/useAuth';

function getRatingDistribution(reviews: ReviewRow[]): number[] {
  const dist = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
  reviews.forEach(r => { dist[r.rating - 1]++; });
  return dist;
}

export default function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<BusinessRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [similar, setSimilar] = useState<BusinessRow[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!slug) return;
    try {
      const biz = await fetchBusinessBySlug(slug);
      if (!biz) return;
      setBusiness(biz);

      // track view
      incrementBusinessViews(biz.id);

      // load reviews
      const revs = await fetchReviews(biz.id);
      setReviews(revs);

      // check if saved
      if (user) {
        const isSaved = await isBusinessSaved(biz.id);
        setSaved(isSaved);
      }

      // load similar businesses (same category, different biz)
      if (biz.category_id) {
        const { businesses } = await fetchBusinesses({ category: biz.categories?.slug, limit: 3 });
        setSimilar(businesses.filter(b => b.id !== biz.id).slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load business:', err);
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveToggle() {
    if (!user) { toast.error('Sign in to save businesses'); return; }
    if (!business) return;
    try {
      const isSaved = await toggleSaveBusiness(business.id);
      setSaved(isSaved);
      toast.success(isSaved ? 'Business saved' : 'Business removed from saved');
    } catch { toast.error('Failed to update saved list'); }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-[400px] bg-surface-3 rounded-lg mb-8" />
          <div className="h-8 bg-surface-3 rounded w-64 mb-4" />
          <div className="h-4 bg-surface-3 rounded w-96" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="pt-20 min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-playfair text-2xl text-brand-dark">Business not found</h2>
          <Link to="/businesses" className="font-dm text-sm text-brand-orange mt-2 inline-block">
            Browse all businesses
          </Link>
        </div>
      </div>
    );
  }

  const dist = getRatingDistribution(reviews);
  const total = reviews.length || 1;

  return (
    <div className="pt-16 min-h-screen bg-surface-1">
      {/* cover image — full width, 400px */}
      <div className="relative h-[400px] overflow-hidden">
        {business.cover_image ? (
          <img src={business.cover_image} alt={business.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-3" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />

        {/* floating card over image bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded">
                    {business.categories?.name}
                  </span>
                  <h1 className={`font-playfair text-[32px] font-bold text-brand-dark mt-2 leading-tight ${business.is_verified ? 'verified-name' : ''}`}>
                    {business.name}
                  </h1>
                  <p className="font-dm text-sm text-brand-muted mt-1">{business.tagline}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleSaveToggle}
                    className={`p-2 rounded transition-colors ${saved ? 'bg-brand-orange/10 text-brand-orange' : 'text-brand-muted hover:text-brand-orange'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-brand-orange' : ''}`} />
                  </button>
                  <button className="p-2 text-brand-muted hover:text-brand-orange transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <StarRating rating={business.avg_rating} reviewCount={business.total_reviews} />
                <PriceRange range={business.price_range} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main content — 2-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* left column 65% */}
          <div className="flex-1 lg:max-w-[65%]">
            {/* quick info bar */}
            <div className="flex items-center gap-4 text-sm font-dm text-brand-muted mb-6">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {business.address?.area}, {business.address?.city}
              </span>
            </div>

            {/* description */}
            <section className="mb-10">
              <h2 className="font-playfair text-xl font-semibold text-brand-dark mb-3">About</h2>
              <p className="font-dm text-sm text-txt-secondary leading-relaxed">
                {business.description}
              </p>
            </section>

            {/* hours table */}
            <section className="mb-10">
              <h2 className="font-playfair text-xl font-semibold text-brand-dark mb-3">Opening Hours</h2>
              <div className="bg-surface-2 rounded-lg overflow-hidden">
                {business.hours?.map(h => (
                  <div key={h.day} className="flex items-center justify-between px-4 py-2.5 border-b border-surface-3 last:border-0">
                    <span className="font-dm text-sm text-txt-primary capitalize">{h.day}</span>
                    {h.is_closed ? (
                      <span className="font-mono text-xs text-red-500">Closed</span>
                    ) : (
                      <span className="font-mono text-xs text-brand-muted">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {h.open_time} – {h.close_time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* photo gallery */}
            {business.images && business.images.length > 0 && (
              <section className="mb-10">
                <h2 className="font-playfair text-xl font-semibold text-brand-dark mb-3">Photos</h2>
                <Gallery images={business.images} />
              </section>
            )}

            {/* reviews section */}
            <section className="mb-10">
              <h2 className="font-playfair text-xl font-semibold text-brand-dark mb-4">Reviews</h2>

              {/* rating summary */}
              <div className="flex items-start gap-8 mb-6">
                {/* big number */}
                <div className="text-center">
                  <span className="font-playfair text-5xl font-bold text-brand-dark">
                    {business.avg_rating > 0 ? business.avg_rating.toFixed(1) : '–'}
                  </span>
                  <StarRating rating={business.avg_rating} size="sm" showValue={false} />
                  <p className="font-mono text-xs text-brand-muted mt-1">{business.total_reviews} reviews</p>
                </div>

                {/* rating bars */}
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = dist[star - 1] || 0;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <RatingBar key={star} star={star} percentage={pct} count={count} />
                    );
                  })}
                </div>
              </div>

              {/* review form */}
              {user && <ReviewForm businessId={business.id} onSubmitted={loadData} />}

              {/* review cards */}
              <div className="divide-y divide-surface-3">
                {reviews.map(rev => (
                  <ReviewCard key={rev.id} reviewEntry={rev} />
                ))}
              </div>
            </section>
          </div>

          {/* right column 35% — sticky */}
          <div className="lg:w-[35%] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <ContactSidebar business={business} />

              {/* map */}
              {business.location?.lat && business.location?.lng && (
                <div>
                  <h3 className="font-playfair text-lg font-semibold text-brand-dark mb-3">Location</h3>
                  <BusinessMap
                    lat={business.location.lat}
                    lng={business.location.lng}
                    name={business.name}
                  />
                </div>
              )}

              {/* similar businesses */}
              {similar.length > 0 && (
                <div>
                  <h3 className="font-playfair text-lg font-semibold text-brand-dark mb-3">Similar Nearby</h3>
                  <div className="space-y-3">
                    {similar.map(biz => (
                      <BusinessCard key={biz.id} business={biz} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

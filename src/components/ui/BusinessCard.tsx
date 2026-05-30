import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import StarRating from './StarRating';
import type { BusinessRow } from '../../services/api';

const isOpenNow = (hours: any[]) => {
  if (!hours || hours.length === 0) return false;
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = days[new Date().getDay()];
  const todayHours = hours.find(h => h.day?.toLowerCase() === today);
  if (!todayHours || todayHours.is_closed) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = (todayHours.open_time || '09:00').split(':').map(Number);
  const [closeH, closeM] = (todayHours.close_time || '21:00').split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function getCloseTime(hours: BusinessRow['hours']): string | null {
  if (!hours || hours.length === 0) return null;
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = days[new Date().getDay()];
  const todayHours = hours.find(h => h.day?.toLowerCase() === today);
  if (!todayHours || todayHours.is_closed) return null;
  return todayHours.close_time ?? null;
}

interface BusinessCardProps {
  business: BusinessRow;
  variant?: 'horizontal' | 'compact' | 'featured';
}

export default function BusinessCard({ business, variant = 'horizontal' }: BusinessCardProps) {
  const open = isOpenNow(business.hours);
  const closeTime = getCloseTime(business.hours);
  const displayBusiness = business as any;
  const categoryName = displayBusiness.category?.name ?? business.categories?.name ?? '';
  const imgSrc = business.coverImage || business.cover_image || 
                 (business.images && business.images[0]) || '';
  const rating = displayBusiness.avgRating ?? business.avg_rating ?? 0;
  const totalReviews = displayBusiness.totalReviews ?? business.total_reviews ?? 0;
  const isFeatured = displayBusiness.isFeatured ?? business.is_featured;
  const isVerified = displayBusiness.isVerified ?? business.is_verified;

  if (variant === 'featured') {
    return (
      <Link
        to={`/businesses/${business.slug}`}
        className="block group w-[280px] flex-shrink-0"
      >
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={business.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-2">
              <span className="text-4xl font-playfair text-brand-muted/30">
                {business.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
          {categoryName && (
            <span className="absolute top-3 right-3 bg-brand-orange text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
          )}
          {open && (
            <div className="absolute top-3 left-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-white/90">Open Now</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <h3 className={`font-playfair text-base font-semibold text-txt-primary group-hover:text-brand-orange transition-colors ${isVerified ? 'verified-name' : ''}`}>
            {business.name}
          </h3>
          <p className="text-xs font-dm text-brand-muted mt-0.5 line-clamp-1">
            {business.tagline}
          </p>
          <div className="mt-2">
            <StarRating rating={rating} size="sm" reviewCount={totalReviews} />
          </div>
          {!open && closeTime && (
            <p className="text-[10px] font-mono text-brand-muted mt-1">
              Closes at {closeTime}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/businesses/${business.slug}`}
      className="group block py-5 border-b border-surface-3 hover:-translate-y-0.5 transition-transform duration-200"
    >
      <div className="flex gap-5">
        <div className="hidden sm:block w-32 h-24 flex-shrink-0 overflow-hidden rounded">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={business.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-2">
              <span className="text-4xl font-playfair text-brand-muted/30">
                {business.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`font-playfair text-lg font-semibold text-txt-primary group-hover:text-brand-orange transition-colors ${isVerified ? 'verified-name' : ''}`}>
                {business.name}
              </h3>
              <p className="text-sm font-dm text-brand-muted mt-0.5">{business.tagline}</p>
            </div>
            <span className="text-sm font-mono text-brand-muted flex-shrink-0">
              {business.price_range}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={rating} size="sm" reviewCount={totalReviews} />
            {categoryName && (
              <span className="text-[10px] font-mono bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded">
                {categoryName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs font-dm text-brand-muted">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {business.address?.area}, {business.address?.city}
            </span>
            {open ? (
              <span className="flex items-center gap-1 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Open Now
              </span>
            ) : closeTime ? (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Closes at {closeTime}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

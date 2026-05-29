import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import StarRating from './StarRating';
import type { BusinessRow } from '../../services/api';

function isOpenNow(hours: BusinessRow['hours']): boolean {
  if (!hours || hours.length === 0) return false;
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const today = hours.find(h => h.day === dayName);
  if (!today || today.is_closed) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open_time.split(':').map(Number);
  const [closeH, closeM] = today.close_time.split(':').map(Number);
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;

  return currentMinutes >= openMin && currentMinutes <= closeMin;
}

function getCloseTime(hours: BusinessRow['hours']): string | null {
  if (!hours || hours.length === 0) return null;
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
  const today = hours.find(h => h.day === dayName);
  if (!today || today.is_closed) return null;
  return today.close_time;
}

// horizontal card layout on desktop — editorial feel, not generic vertical stack
interface BusinessCardProps {
  business: BusinessRow;
  variant?: 'horizontal' | 'compact' | 'featured';
}

export default function BusinessCard({ business, variant = 'horizontal' }: BusinessCardProps) {
  const open = isOpenNow(business.hours);
  const closeTime = getCloseTime(business.hours);
  const categoryName = business.categories?.name || '';

  if (variant === 'featured') {
    return (
      <Link
        to={`/businesses/${business.slug}`}
        className="block group w-[280px] flex-shrink-0"
      >
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
          {business.cover_image ? (
            <img
              src={business.cover_image}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-3 flex items-center justify-center">
              <span className="text-4xl font-playfair text-brand-muted/30">{business.name[0]}</span>
            </div>
          )}
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
          {/* category pill */}
          {categoryName && (
            <span className="absolute top-3 right-3 bg-brand-orange text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
          )}
          {/* open now indicator */}
          {open && (
            <div className="absolute top-3 left-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-white/90">Open Now</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <h3 className={`font-playfair text-base font-semibold text-txt-primary group-hover:text-brand-orange transition-colors ${business.is_verified ? 'verified-name' : ''}`}>
            {business.name}
          </h3>
          <p className="text-xs font-dm text-brand-muted mt-0.5 line-clamp-1">
            {business.tagline}
          </p>
          <div className="mt-2">
            <StarRating rating={business.avg_rating} size="sm" reviewCount={business.total_reviews} />
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

  // horizontal variant — desktop editorial layout
  return (
    <Link
      to={`/businesses/${business.slug}`}
      className="group block py-5 border-b border-surface-3 hover:-translate-y-0.5 transition-transform duration-200"
    >
      <div className="flex gap-5">
        {/* image */}
        <div className="hidden sm:block w-32 h-24 flex-shrink-0 overflow-hidden rounded">
          {business.cover_image ? (
            <img
              src={business.cover_image}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-3 flex items-center justify-center">
              <span className="text-2xl font-playfair text-brand-muted/30">{business.name[0]}</span>
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`font-playfair text-lg font-semibold text-txt-primary group-hover:text-brand-orange transition-colors ${business.is_verified ? 'verified-name' : ''}`}>
                {business.name}
              </h3>
              <p className="text-sm font-dm text-brand-muted mt-0.5">{business.tagline}</p>
            </div>
            <span className="text-sm font-mono text-brand-muted flex-shrink-0">
              {business.price_range}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={business.avg_rating} size="sm" reviewCount={business.total_reviews} />
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

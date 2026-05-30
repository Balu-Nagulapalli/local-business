import BusinessCard from '../ui/BusinessCard';
import { SkeletonBusinessCard } from '../ui/SkeletonCard';
import type { BusinessRow } from '../../services/api';

interface BusinessGridProps {
  businesses: BusinessRow[];
  loading: boolean;
}

export default function BusinessGrid({ businesses, loading }: BusinessGridProps) {
  if (loading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBusinessCard key={i} />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-playfair text-xl text-brand-dark">No businesses found</p>
        <p className="font-dm text-sm text-brand-muted mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-3">
      {businesses.map((biz, idx) => (
        <div key={biz._id || biz.id} className={idx % 3 === 2 ? 'sm:flex-row-reverse' : ''}>
          <BusinessCard business={biz} />
        </div>
      ))}
    </div>
  );
}

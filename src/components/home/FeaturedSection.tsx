import { useEffect, useState } from 'react';
import BusinessCard from '../ui/BusinessCard';
import { SkeletonFeaturedCard } from '../ui/SkeletonCard';
import { fetchFeaturedBusinesses } from '../../services/api';
import type { BusinessRow } from '../../services/api';

export default function FeaturedSection() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBusinesses('Hyderabad')
      .then(setBusinesses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* heading with decorative left orange line */}
      <div className="flex items-stretch gap-3 mb-8">
        <div className="w-1 bg-brand-orange rounded" />
        <div>
          <h2 className="font-playfair text-3xl font-bold text-brand-dark">
            Featured in Hyderabad
          </h2>
          <p className="font-dm text-sm text-brand-muted mt-1">
            Hand-picked and verified by our editors
          </p>
        </div>
      </div>

      {/* horizontal scroll list */}
      <div className="flex gap-5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonFeaturedCard key={i} />)
          : businesses.map(biz => (
              <BusinessCard key={biz.id} business={biz} variant="featured" />
            ))
        }
      </div>
    </section>
  );
}

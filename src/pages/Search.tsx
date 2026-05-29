import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BusinessGrid from '../components/business/BusinessGrid';
import { fetchBusinesses } from '../services/api';
import type { BusinessRow } from '../services/api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const category = searchParams.get('category') || '';

  const searchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchBusinesses({
        search: q || undefined,
        city: city || undefined,
        category: category || undefined,
        limit: 20,
      });
      setBusinesses(result.businesses);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [q, city, category]);

  useEffect(() => { searchBusinesses(); }, [searchBusinesses]);

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">
            {q ? `Results for "${q}"` : 'Search Results'}
          </h1>
          {(city || category) && (
            <p className="font-dm text-sm text-brand-muted mt-1">
              {city && `in ${city}`}
              {city && category && ' · '}
              {category && category}
            </p>
          )}
        </div>

        <BusinessGrid businesses={businesses} loading={loading} />
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import BusinessGrid from '../components/business/BusinessGrid';
import FilterSidebar, { type FilterState } from '../components/business/FilterSidebar';
import { fetchBusinesses } from '../services/api';
import type { BusinessRow } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  city: '',
  category: '',
  priceRange: '',
  sortBy: 'rating',
};

export default function Businesses() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchBusinesses({
        city: filters.city || undefined,
        category: filters.category || undefined,
        page,
        limit,
      });

      let sorted = result.businesses;
      if (filters.sortBy === 'reviews') {
        sorted = [...sorted].sort((a, b) => b.total_reviews - a.total_reviews);
      } else if (filters.sortBy === 'newest') {
        sorted = [...sorted].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (filters.sortBy === 'views') {
        sorted = [...sorted].sort((a, b) => b.total_views - a.total_views);
      }

      if (filters.priceRange) {
        sorted = sorted.filter(b => b.price_range === filters.priceRange);
      }

      setBusinesses(sorted);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { loadBusinesses(); }, [loadBusinesses]);

  function handleFilterChange(newFilters: FilterState) {
    setFilters(newFilters);
    setPage(1);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">All Businesses</h1>
          <p className="font-dm text-sm text-brand-muted mt-1">
            {total > 0 ? `${total} businesses found` : 'Search for businesses in your city'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFilter={handleFilterChange} currentFilters={filters} />
          <div className="flex-1">
            <BusinessGrid businesses={businesses} loading={loading} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-brand-muted hover:text-brand-orange transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-mono text-sm text-brand-muted">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-brand-muted hover:text-brand-orange transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

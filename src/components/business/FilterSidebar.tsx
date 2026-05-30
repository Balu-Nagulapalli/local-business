import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/api';
import type { CategoryRow } from '../../services/api';

const CITIES = ['All Cities', 'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Bangalore', 'Chennai', 'Pune'];
const PRICE_OPTIONS = ['Any Price', '₹', '₹₹', '₹₹₹', '₹₹₹₹'];

interface FilterSidebarProps {
  onFilter: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  city: string;
  category: string;
  priceRange: string;
  sortBy: string;
}

export default function FilterSidebar({ onFilter, currentFilters }: FilterSidebarProps) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  function update(partial: Partial<FilterState>) {
    onFilter({ ...currentFilters, ...partial });
  }

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">City</label>
          <select
            value={currentFilters.city}
            onChange={e => update({ city: e.target.value })}
            className="mt-1 w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
          >
            {CITIES.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Category</label>
          <select
            value={currentFilters.category}
            onChange={e => update({ category: e.target.value })}
            className="mt-1 w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id || c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Price Range</label>
          <select
            value={currentFilters.priceRange}
            onChange={e => update({ priceRange: e.target.value })}
            className="mt-1 w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
          >
            {PRICE_OPTIONS.map(p => <option key={p} value={p === 'Any Price' ? '' : p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-brand-muted uppercase tracking-wider">Sort By</label>
          <select
            value={currentFilters.sortBy}
            onChange={e => update({ sortBy: e.target.value })}
            className="mt-1 w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="newest">Newest</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

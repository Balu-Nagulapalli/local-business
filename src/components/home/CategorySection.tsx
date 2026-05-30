import { useEffect, useState } from 'react';
import CategoryTile from '../ui/CategoryTile';
import { fetchCategories } from '../../services/api';
import type { CategoryRow } from '../../services/api';

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-surface-3 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-playfair text-3xl font-bold text-brand-dark mb-8">
        Explore by Category
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
        {categories.map((cat, idx) => (
          <div key={cat._id || cat.id} className="flex-shrink-0 w-[200px] md:w-auto">
            <CategoryTile category={cat} featured={idx === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}

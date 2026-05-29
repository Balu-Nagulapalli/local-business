import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBusinesses, fetchCategories } from '../services/api';
import type { BusinessRow, CategoryRow } from '../services/api';
import BusinessGrid from '../components/business/BusinessGrid';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await fetchCategories();
      const cat = cats.find(c => c.slug === slug) || null;
      setCategory(cat);

      const result = await fetchBusinesses({
        category: slug || undefined,
        limit: 20,
      });
      setBusinesses(result.businesses);
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      {/* category hero banner */}
      {category && (
        <div className="relative h-48 overflow-hidden">
          {category.cover_image ? (
            <img src={category.cover_image} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-3" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <Link to="/businesses" className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm font-dm mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Categories
              </Link>
              <h1 className="font-playfair text-4xl font-bold text-white">{category.name}</h1>
              <p className="font-dm text-sm text-white/70 mt-1 max-w-lg">{category.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!category && !loading && (
          <div className="text-center py-16">
            <h2 className="font-playfair text-2xl text-brand-dark">Category not found</h2>
          </div>
        )}
        <BusinessGrid businesses={businesses} loading={loading} />
      </div>
    </div>
  );
}

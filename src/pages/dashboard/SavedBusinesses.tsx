import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSavedBusinesses } from '../../services/api';
import type { BusinessRow } from '../../services/api';
import BusinessCard from '../../components/ui/BusinessCard';
import { Heart } from 'lucide-react';

export default function SavedBusinesses() {
  const [saved, setSaved] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedBusinesses()
      .then(setSaved)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-brand-orange" />
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">Saved Businesses</h1>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-surface-3 rounded" />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-playfair text-xl text-brand-dark">No saved businesses yet</p>
            <p className="font-dm text-sm text-brand-muted mt-2">
              Browse businesses and tap the bookmark icon to save them here
            </p>
            <Link to="/businesses" className="inline-block mt-4 text-sm font-dm text-brand-orange hover:underline">
              Browse Businesses
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {saved.map(biz => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

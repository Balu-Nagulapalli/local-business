import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Eye } from 'lucide-react';
import { fetchOwnerBusinesses } from '../../services/api';
import type { BusinessRow } from '../../services/api';
import StarRating from '../../components/ui/StarRating';

export default function MyListings() {
  const [listings, setListings] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerBusinesses()
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    pending: 'text-yellow-600 bg-yellow-50',
    rejected: 'text-red-600 bg-red-50',
  };

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">My Listings</h1>
          <Link
            to="/owner/listings/new"
            className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-dm font-medium px-5 py-2.5 rounded text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Business
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-3 rounded" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-playfair text-xl text-brand-dark">No listings yet</p>
            <p className="font-dm text-sm text-brand-muted mt-2">
              Add your first business to get started
            </p>
            <Link
              to="/owner/listings/new"
              className="inline-block mt-4 bg-brand-orange text-white font-dm px-5 py-2 rounded text-sm"
            >
              Add Business
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(biz => (
              <div key={biz.id} className="bg-white border border-surface-3 rounded-lg p-5 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-playfair text-lg font-semibold text-brand-dark truncate">
                      {biz.name}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${statusColor[biz.status] || ''}`}>
                      {biz.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <StarRating rating={biz.avg_rating} size="sm" reviewCount={biz.total_reviews} />
                    <span className="font-mono text-xs text-brand-muted flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {biz.total_views} views
                    </span>
                  </div>
                </div>
                <Link
                  to={`/owner/listings/${biz.id}/edit`}
                  className="flex items-center gap-1 text-sm font-dm text-brand-orange hover:underline ml-4"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

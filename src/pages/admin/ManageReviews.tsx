import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchAllReviews, adminDeleteReview, adminToggleReviewVisibility } from '../../services/api';
import type { ReviewRow } from '../../services/api';
import DataTable from '../../components/admin/DataTable';
import { timeAgo } from '../../utils/timeAgo';

export default function ManageReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  async function toggleVisibility(id: string, isHidden: boolean) {
    try {
      await adminToggleReviewVisibility(id, !isHidden);
      toast.success(!isHidden ? 'Review hidden' : 'Review shown');
      loadReviews();
    } catch { toast.error('Failed to update'); }
  }

  async function deleteReviewAction(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await adminDeleteReview(id);
      toast.success('Review deleted');
      loadReviews();
    } catch { toast.error('Failed to delete'); }
  }

  const columns = [
    { key: 'rating', label: 'Rating', sortable: true, render: (row: any) => (
      <span className="font-mono text-xs">{row.rating}★</span>
    )},
    { key: 'title', label: 'Title', sortable: true, render: (row: any) => (
      <span className="font-dm text-sm">{row.title || '–'}</span>
    )},
    { key: 'business', label: 'Business', render: (row: any) => (
      <span className="font-dm text-sm">{row.businesses?.name || '–'}</span>
    )},
    { key: 'user', label: 'By', render: (row: any) => (
      <span className="font-dm text-sm">{row.profiles?.name || 'Unknown'}</span>
    )},
    { key: 'created_at', label: 'Date', sortable: true, render: (row: any) => (
      <span className="font-mono text-[10px] text-brand-muted">{timeAgo(row.created_at)}</span>
    )},
    { key: 'is_hidden', label: 'Hidden', render: (row: any) => (
      <span className={`font-mono text-xs ${row.is_hidden ? 'text-red-600' : 'text-green-600'}`}>
        {row.is_hidden ? 'yes' : 'no'}
      </span>
    )},
  ];

  return (
    <div className="pt-16 pl-56 min-h-screen bg-surface-1">
      <div className="p-8">
        <h1 className="font-playfair text-3xl font-bold text-brand-dark mb-6">Manage Reviews</h1>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-3 rounded" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={reviews}
            actions={(row) => (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleVisibility(row.id, row.is_hidden)}
                  className={`text-xs font-dm hover:underline ${row.is_hidden ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {row.is_hidden ? 'Show' : 'Hide'}
                </button>
                <button
                  onClick={() => deleteReviewAction(row.id)}
                  className="text-xs font-dm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

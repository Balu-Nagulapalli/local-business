import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabase';
import StarRating from '../../components/ui/StarRating';
import { timeAgo } from '../../utils/timeAgo';

interface MyReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  businesses: { name: string; slug: string } | null;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reviews')
        .select('*, businesses!business_id(name, slug)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setReviews((data ?? []) as MyReview[]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(reviewId: string) {
    if (!confirm('Delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) toast.error('Failed to delete');
    else {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Review deleted');
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-surface-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-brand-orange" />
          <h1 className="font-playfair text-3xl font-bold text-brand-dark">My Reviews</h1>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-3 rounded" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-playfair text-xl text-brand-dark">No reviews yet</p>
            <Link to="/businesses" className="inline-block mt-4 text-sm font-dm text-brand-orange hover:underline">
              Find businesses to review
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {reviews.map(rev => (
              <div key={rev.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      to={`/businesses/${rev.businesses?.slug}`}
                      className="font-playfair text-base font-semibold text-brand-dark hover:text-brand-orange transition-colors"
                    >
                      {rev.businesses?.name || 'Unknown Business'}
                    </Link>
                    <div className="mt-1">
                      <StarRating rating={rev.rating} size="sm" showValue={false} />
                    </div>
                    {rev.title && (
                      <p className="font-dm font-semibold text-sm text-txt-primary mt-1">{rev.title}</p>
                    )}
                    <p className="font-dm text-sm text-txt-secondary mt-1">{rev.comment}</p>
                    <span className="font-mono text-[10px] text-brand-muted">{timeAgo(rev.created_at)}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 text-brand-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

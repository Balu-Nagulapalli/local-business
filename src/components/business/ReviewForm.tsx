import { useState } from 'react';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createReview } from '../../services/api';

interface ReviewFormProps {
  businessId: string;
  onSubmitted: () => void;
}

interface FormVals {
  title: string;
  comment: string;
}

export default function ReviewForm({ businessId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormVals>();

  async function onSubmit(vals: FormVals) {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await createReview(businessId, rating, vals.title, vals.comment);
      toast.success('Review posted!');
      reset();
      setRating(0);
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4 border-t border-surface-3">
      <h4 className="font-playfair text-lg font-semibold text-brand-dark mb-4">
        Write a Review
      </h4>

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'text-brand-orange fill-brand-orange'
                  : 'text-surface-3'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm font-dm text-brand-muted">
            {rating} star{rating > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <input
        {...register('title', { required: true })}
        placeholder="Review headline"
        className="w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50 mb-3"
      />
      <textarea
        {...register('comment', { required: true })}
        placeholder="Share your experience..."
        rows={4}
        className="w-full px-3 py-2 text-sm font-dm bg-surface-2 border border-surface-3 rounded focus:outline-none focus:border-brand-orange/50 mb-3 resize-none"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-dm font-medium px-6 py-2 rounded transition-colors disabled:opacity-50"
      >
        {submitting ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}

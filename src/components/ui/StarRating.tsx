import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 'md', showValue = true, reviewCount }: StarRatingProps) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1.5">
      {showValue && (
        <span className={`${textSizes[size]} font-dm font-bold text-txt-primary`}>
          {rating.toFixed(1)}
        </span>
      )}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star - 0.5 <= rating;
          return (
            <Star
              key={star}
              className={`${sizes[size]} ${
                filled
                  ? 'text-brand-orange fill-brand-orange'
                  : half
                  ? 'text-brand-orange fill-brand-orange/50'
                  : 'text-surface-3'
              }`}
            />
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} font-mono text-brand-muted`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

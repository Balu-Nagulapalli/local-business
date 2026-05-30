import StarRating from '../ui/StarRating';
import { nameToColor, getInitials } from '../../utils/nameToColor';
import { timeAgo } from '../../utils/timeAgo';
import { ThumbsUp } from 'lucide-react';
import type { ReviewRow } from '../../services/api';

interface ReviewCardProps {
  reviewEntry: ReviewRow;
}

export default function ReviewCard({ reviewEntry }: ReviewCardProps) {
  const reviewerName = reviewEntry.user?.name ?? reviewEntry.profiles?.name ?? 'User';
  const bgColor = nameToColor(reviewerName);
  const initials = getInitials(reviewerName);

  return (
    <div className="py-4 border-t border-surface-3">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-dm font-medium text-sm text-txt-primary">
              {reviewerName}
            </span>
            <span className="font-mono text-[10px] text-brand-muted flex-shrink-0">
              {timeAgo(reviewEntry.createdAt ?? reviewEntry.created_at)}
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={reviewEntry.rating} size="sm" showValue={false} />
          </div>
          {reviewEntry.title && (
            <p className="font-dm font-semibold text-sm text-txt-primary mt-2">
              {reviewEntry.title}
            </p>
          )}
          <p className="font-dm text-sm text-txt-secondary mt-1 leading-relaxed">
            {reviewEntry.comment}
          </p>
          <button className="mt-2 flex items-center gap-1 text-xs font-dm text-brand-muted hover:text-brand-orange transition-colors">
            <ThumbsUp className="w-3 h-3" />
            <span>Helpful ({reviewEntry.helpfulCount ?? reviewEntry.helpful_count ?? 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

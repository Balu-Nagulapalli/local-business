interface RatingBarProps {
  star: number;
  percentage: number;
  count: number;
}

export default function RatingBar({ star, percentage, count }: RatingBarProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-dm">
      <span className="w-3 text-right font-mono text-brand-muted">{star}</span>
      <span className="text-brand-muted">★</span>
      <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs text-brand-muted">{percentage}%</span>
    </div>
  );
}

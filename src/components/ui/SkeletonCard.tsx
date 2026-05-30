export function SkeletonBusinessCard() {
  return (
    <div className="py-5 border-b border-surface-3 animate-pulse">
      <div className="flex gap-5">
        <div className="hidden sm:block w-32 h-24 flex-shrink-0 bg-surface-3 rounded" />
        <div className="flex-1">
          <div className="h-5 bg-surface-3 rounded w-48 mb-2" />
          <div className="h-3 bg-surface-3 rounded w-64 mb-3" />
          <div className="flex gap-3">
            <div className="h-4 bg-surface-3 rounded w-20" />
            <div className="h-4 bg-surface-3 rounded w-16" />
          </div>
          <div className="mt-2 h-3 bg-surface-3 rounded w-40" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeaturedCard() {
  return (
    <div className="w-[280px] flex-shrink-0 animate-pulse">
      <div className="aspect-[4/3] bg-surface-3 rounded-lg" />
      <div className="mt-3">
        <div className="h-4 bg-surface-3 rounded w-36 mb-2" />
        <div className="h-3 bg-surface-3 rounded w-48 mb-2" />
        <div className="h-3 bg-surface-3 rounded w-24" />
      </div>
    </div>
  );
}

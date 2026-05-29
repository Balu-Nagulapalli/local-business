export default function Gallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-dm text-sm text-brand-muted">No photos yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
      {images.map((img, idx) => (
        <div key={idx} className="break-inside-avoid overflow-hidden rounded-lg">
          <img
            src={img}
            alt={`Photo ${idx + 1}`}
            className="w-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

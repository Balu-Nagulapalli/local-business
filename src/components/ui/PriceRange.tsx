interface PriceRangeProps {
  range: string; // ₹, ₹₹, ₹₹₹, ₹₹₹₹
}

export default function PriceRange({ range }: PriceRangeProps) {
  const len = range.length;
  return (
    <span className="font-mono text-sm">
      {range.split('').map((char, i) => (
        <span key={i} className={i < len ? 'text-brand-orange' : 'text-surface-3'}>{char}</span>
      ))}
    </span>
  );
}

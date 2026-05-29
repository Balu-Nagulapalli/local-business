interface StatsCardProps {
  label: string;
  value: string | number;
  accent?: string; // hex color for top border
}

export default function StatsCard({ label, value, accent = '#E8470A' }: StatsCardProps) {
  return (
    <div className="bg-white p-5" style={{ borderTop: `4px solid ${accent}` }}>
      <p className="font-dm text-sm text-brand-muted">{label}</p>
      <p className="font-playfair text-3xl font-bold text-brand-dark mt-1">{value}</p>
    </div>
  );
}

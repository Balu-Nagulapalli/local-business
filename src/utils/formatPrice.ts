export function formatPrice(range: string): string {
  return range;
}

export function priceLabel(range: string): string {
  const map: Record<string, string> = {
    '₹': 'Budget-friendly',
    '₹₹': 'Moderate',
    '₹₹₹': 'Premium',
    '₹₹₹₹': 'Luxury',
  };
  return map[range] || '';
}

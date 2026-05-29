// hashes a name to a hue value for avatar backgrounds
// avoids purple/indigo range (260-300) as per design rules
const COLOR_RANGES = [
  [0, 30],    // reds/oranges
  [30, 60],   // oranges/yellows
  [60, 170],  // greens/teals
  [170, 220], // blues
  [330, 360], // pinks/reds
];

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function nameToColor(name: string): string {
  const hash = hashStr(name);
  const rangeIdx = hash % COLOR_RANGES.length;
  const [lo, hi] = COLOR_RANGES[rangeIdx];
  const hue = lo + (hash % (hi - lo));
  return `hsl(${hue}, 65%, 45%)`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

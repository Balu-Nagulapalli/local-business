import { useEffect, useRef } from 'react';

interface BusinessMapProps {
  lat: number;
  lng: number;
  name: string;
}

// lazy-loaded map — react-leaflet needs window which doesn't exist at import time
// so we dynamically create the map after mount
export default function BusinessMap({ lat, lng, name }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // dynamic import to avoid SSR issues
    import('leaflet').then(L => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([lat, lng], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // custom marker icon — orange instead of default blue
      const icon = L.divIcon({
        html: `<div style="background:#E8470A;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<strong style="font-family:DM Sans,sans-serif">${name}</strong>`);

      // invalidateSize after a tick — leaflet hates hidden containers
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px] rounded-lg bg-surface-3"
      style={{ willChange: 'transform' }} // this flickers on Safari, added will-change as workaround
    />
  );
}

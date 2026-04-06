'use client';

import dynamic from 'next/dynamic';
import { Location } from '@/lib/types';

const MapContent = dynamic(() => import('./MapContent'), { ssr: false });

interface MapPanelProps {
  location: Location;
}

export default function MapPanel({ location }: MapPanelProps) {
  return (
    <div className="map-panel">
      <MapContent location={location} />
    </div>
  );
}

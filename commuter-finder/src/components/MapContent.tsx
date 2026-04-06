'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '@/lib/types';
import { POI_COLORS, POI_ICONS } from '@/lib/constants';
import 'leaflet/dist/leaflet.css';

interface MapContentProps {
  location: Location;
}

function createIcon(color: string, emoji: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function MapContent({ location }: MapContentProps) {
  const center: [number, number] = [location.lat, location.lng];

  return (
    <div className="map-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', height: '420px' }}>
        <MapContainer
          center={center}
          zoom={14}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location.pois.map((poi, idx) => (
            <Marker
              key={idx}
              position={[poi.lat, poi.lng]}
              icon={createIcon(POI_COLORS[poi.type] || '#666', POI_ICONS[poi.type] || '📍')}
            >
              <Popup>
                <strong>{poi.name}</strong>
                <br />
                <span style={{ fontSize: '0.85em', color: '#666' }}>{poi.desc}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* POI Legend */}
      <div
        className="poi-legend"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.6rem 0.75rem',
          background: 'var(--surface)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '0.78rem',
        }}
      >
        {Object.entries(POI_ICONS).map(([type, icon]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: POI_COLORS[type],
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
              }}
            >
              {icon}
            </span>
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

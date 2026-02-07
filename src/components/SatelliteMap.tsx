import { useEffect } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import type { SatelliteLayer, Coordinates } from '@/types/satellite';
import 'leaflet/dist/leaflet.css';

interface SatelliteMapProps {
  center: Coordinates;
  zoom: number;
  layers: SatelliteLayer[];
  onMapClick?: (coords: Coordinates) => void;
}

// Component to handle map center updates
function MapController({ center, zoom }: { center: Coordinates; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.latitude, center.longitude], zoom);
  }, [center, zoom, map]);
  
  return null;
}

// Component to handle click events
function MapClickHandler({ onClick }: { onClick?: (coords: Coordinates) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      }
    },
  });
  
  return null;
}

// Separate component for satellite layer to avoid conditional rendering issues
function SatelliteOverlay({ layer }: { layer: SatelliteLayer }) {
  if (!layer.visible) {
    return null;
  }
  
  return (
    <ImageOverlay
      url={layer.imageUrl}
      bounds={layer.bounds}
      opacity={layer.opacity}
    />
  );
}

export function SatelliteMap({ center, zoom, layers, onMapClick }: SatelliteMapProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="map-container h-full w-full relative"
    >
      {/* Scan line effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1000] overflow-hidden opacity-20">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-scan-line" />
      </div>
      
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        className="h-full w-full"
        style={{ background: 'hsl(222 47% 8%)' }}
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        <MapClickHandler onClick={onMapClick} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {layers.map((layer) => (
          <SatelliteOverlay key={layer.id} layer={layer} />
        ))}
      </MapContainer>
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 pointer-events-none rounded-lg border border-primary/20" />
    </motion.div>
  );
}

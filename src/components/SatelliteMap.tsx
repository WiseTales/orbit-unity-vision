import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
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
  const map = useMap();
  
  useEffect(() => {
    if (!onClick) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    };
    
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);
  
  return null;
}

export function SatelliteMap({ center, zoom, layers, onMapClick }: SatelliteMapProps) {
  const mapRef = useRef(null);
  
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
        ref={mapRef}
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        className="h-full w-full"
        style={{ background: 'hsl(222 47% 8%)' }}
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        <MapClickHandler onClick={onMapClick} />
        
        {/* Dark-themed OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Satellite imagery overlays */}
        {layers.map((layer) => (
          layer.visible && (
            <ImageOverlay
              key={layer.id}
              url={layer.imageUrl}
              bounds={layer.bounds}
              opacity={layer.opacity}
              className="transition-opacity duration-300"
            />
          )
        ))}
      </MapContainer>
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 pointer-events-none rounded-lg border border-primary/20" />
    </motion.div>
  );
}

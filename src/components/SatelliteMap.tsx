import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Coordinates, SatelliteLayer } from "@/types/satellite";

interface SatelliteMapProps {
  center: Coordinates;
  zoom: number;
  layers: SatelliteLayer[];
  onMapClick?: (coords: Coordinates) => void;
}

export function SatelliteMap({ center, zoom, layers, onMapClick }: SatelliteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlaysRef = useRef<Map<string, L.ImageOverlay>>(new Map());
  const onMapClickRef = useRef<typeof onMapClick>(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const layerIndex = useMemo(() => {
    return new Map(layers.map((l) => [l.id, l] as const));
  }, [layers]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    map.setView([center.latitude, center.longitude], zoom);

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    };

    map.on("click", handleClick);

    // Keep map responsive when side panels resize
    const ro = new ResizeObserver(() => {
      // in case map is still initializing
      requestAnimationFrame(() => map.invalidateSize());
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.off("click", handleClick);
      map.remove();
      mapRef.current = null;
      overlaysRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update view when center/zoom changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.latitude, center.longitude], zoom, { animate: true });
  }, [center.latitude, center.longitude, zoom]);

  // Sync overlays with current layers (add/update/remove)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove overlays no longer present
    for (const [id, overlay] of overlaysRef.current.entries()) {
      if (!layerIndex.has(id)) {
        overlay.remove();
        overlaysRef.current.delete(id);
      }
    }

    // Add / update overlays
    for (const layer of layers) {
      const bounds = L.latLngBounds(layer.bounds[0], layer.bounds[1]);
      let overlay = overlaysRef.current.get(layer.id);

      if (!overlay) {
        overlay = L.imageOverlay(layer.imageUrl, bounds, {
          opacity: layer.opacity,
          interactive: false,
          crossOrigin: "anonymous",
        });
        overlaysRef.current.set(layer.id, overlay);
      } else {
        overlay.setUrl(layer.imageUrl);
        overlay.setBounds(bounds);
        overlay.setOpacity(layer.opacity);
      }

      const isOnMap = map.hasLayer(overlay);
      if (layer.visible && !isOnMap) overlay.addTo(map);
      if (!layer.visible && isOnMap) overlay.remove();
    }
  }, [layers, layerIndex]);

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

      <div ref={containerRef} className="h-full w-full" />

      {/* Gradient border effect */}
      <div className="absolute inset-0 pointer-events-none rounded-lg border border-primary/20" />
    </motion.div>
  );
}

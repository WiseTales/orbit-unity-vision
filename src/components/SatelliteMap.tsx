import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

import type { Coordinates, SatelliteLayer } from "@/types/satellite";

interface SatelliteMapProps {
  center: Coordinates;
  zoom: number;
  layers: SatelliteLayer[];
  onMapClick?: (coords: Coordinates) => void;
  onCenterChange?: (coords: Coordinates) => void;
  onZoomChange?: (zoom: number) => void;
}

// Real satellite tile layers configuration
const SATELLITE_LAYERS = {
  sentinel: {
    name: "Sentinel (ESA/Copernicus)",
    url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg",
    attribution: '&copy; <a href="https://s2maps.eu">Sentinel cloudless</a> by EOX',
    maxZoom: 14,
  },
  landsat: {
    name: "Landsat (NASA/USGS)",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-01-15/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    attribution: '&copy; <a href="https://earthdata.nasa.gov">NASA Earthdata</a>',
    maxZoom: 9,
  },
  isro: {
    name: "ISRO (Bhuvan)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://bhuvan.nrsc.gov.in">ISRO Bhuvan</a>',
    maxZoom: 19,
  },
  terrain: {
    name: "Terrain",
    url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    attribution: '&copy; <a href="http://stamen.com">Stamen Design</a>',
    maxZoom: 18,
  },
};

export function SatelliteMap({ 
  center, 
  zoom, 
  layers, 
  onMapClick,
  onCenterChange,
  onZoomChange 
}: SatelliteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlaysRef = useRef<Map<string, L.ImageOverlay>>(new Map());
  const baseLayersRef = useRef<Map<string, L.TileLayer>>(new Map());
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const onMapClickRef = useRef<typeof onMapClick>(onMapClick);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });

    mapRef.current = map;

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add scale control
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

    // Dark basemap (default)
    const darkBase = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    });

    // Light basemap
    const lightBase = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    });

    // Create satellite tile layers
    const sentinelLayer = L.tileLayer(SATELLITE_LAYERS.sentinel.url, {
      attribution: SATELLITE_LAYERS.sentinel.attribution,
      maxZoom: SATELLITE_LAYERS.sentinel.maxZoom,
    });

    const landsatLayer = L.tileLayer(SATELLITE_LAYERS.landsat.url, {
      attribution: SATELLITE_LAYERS.landsat.attribution,
      maxZoom: SATELLITE_LAYERS.landsat.maxZoom,
    });

    const isroLayer = L.tileLayer(SATELLITE_LAYERS.isro.url, {
      attribution: SATELLITE_LAYERS.isro.attribution,
      maxZoom: SATELLITE_LAYERS.isro.maxZoom,
    });

    // Store references
    baseLayersRef.current.set('dark', darkBase);
    baseLayersRef.current.set('light', lightBase);
    baseLayersRef.current.set('sentinel', sentinelLayer);
    baseLayersRef.current.set('landsat', landsatLayer);
    baseLayersRef.current.set('isro', isroLayer);

    // Add default layer
    darkBase.addTo(map);

    // Create layer control
    const baseMaps = {
      "Dark Basemap": darkBase,
      "Light Basemap": lightBase,
    };

    const overlayMaps = {
      "Sentinel Layer": sentinelLayer,
      "Landsat Layer": landsatLayer,
      "ISRO Terrain Layer": isroLayer,
    };

    layerControlRef.current = L.control.layers(baseMaps, overlayMaps, {
      position: 'topright',
      collapsed: false,
    }).addTo(map);

    map.setView([center.latitude, center.longitude], zoom);

    // Handle map events
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    };

    const handleMoveEnd = () => {
      const newCenter = map.getCenter();
      onCenterChange?.({
        latitude: newCenter.lat,
        longitude: newCenter.lng,
      });
    };

    const handleZoomEnd = () => {
      onZoomChange?.(map.getZoom());
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    map.on("click", handleClick);
    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleZoomEnd);
    map.on("load", handleLoad);

    // Loading timeout
    setTimeout(() => setIsLoading(false), 2000);

    // Keep map responsive when side panels resize
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => map.invalidateSize());
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.off("click", handleClick);
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleZoomEnd);
      map.off("load", handleLoad);
      map.remove();
      mapRef.current = null;
      overlaysRef.current.clear();
      baseLayersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update view when center/zoom changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.latitude, center.longitude], zoom, { animate: true });
  }, [center.latitude, center.longitude, zoom]);

  // Sync analysis overlays with current layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layerIndex = new Map(layers.map((l) => [l.id, l] as const));

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
  }, [layers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full relative"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading satellite imagery...</p>
          </div>
        </div>
      )}

      {/* Scan line effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-[999] overflow-hidden opacity-10">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-scan-line" />
      </div>

      <div ref={containerRef} className="h-full w-full" />

      {/* Gradient border effect */}
      <div className="absolute inset-0 pointer-events-none z-[998] border border-primary/10 rounded-lg" />
    </motion.div>
  );
}

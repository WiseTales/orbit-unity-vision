import { motion } from 'framer-motion';
import { MapPin, ZoomIn, Database, Satellite, Globe2, Radio } from 'lucide-react';
import type { Coordinates } from '@/types/satellite';

interface MapInfoOverlayProps {
  center: Coordinates;
  zoom: number;
}

const dataSources = [
  { name: 'Sentinel-2', icon: Satellite, color: 'text-sentinel', bg: 'bg-sentinel/10', border: 'border-sentinel/30' },
  { name: 'MODIS Terra', icon: Globe2, color: 'text-landsat', bg: 'bg-landsat/10', border: 'border-landsat/30' },
  { name: 'ESRI Imagery', icon: Radio, color: 'text-isro', bg: 'bg-isro/10', border: 'border-isro/30' },
];

export function MapInfoOverlay({ center, zoom }: MapInfoOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute bottom-4 left-4 z-[1000] w-64"
    >
      <div className="glass-panel rounded-xl p-4 space-y-4">
        {/* Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <MapPin className="h-3 w-3" />
            <span>Current Position</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase">Latitude</div>
              <div className="text-sm font-mono font-medium text-foreground">
                {center.latitude.toFixed(4)}°
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase">Longitude</div>
              <div className="text-sm font-mono font-medium text-foreground">
                {center.longitude.toFixed(4)}°
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Level */}
        <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ZoomIn className="h-3 w-3" />
            <span>Zoom Level</span>
          </div>
          <span className="text-sm font-mono font-medium text-primary">{zoom}</span>
        </div>

        {/* Data Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Database className="h-3 w-3" />
            <span>Available Sources</span>
          </div>
          <div className="space-y-1.5">
            {dataSources.map((source) => (
              <div
                key={source.name}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${source.bg} border ${source.border} transition-all hover:scale-[1.02]`}
              >
                <source.icon className={`h-3.5 w-3.5 ${source.color}`} />
                <span className={`text-xs font-medium ${source.color}`}>{source.name}</span>
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${source.color.replace('text-', 'bg-')} animate-pulse`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

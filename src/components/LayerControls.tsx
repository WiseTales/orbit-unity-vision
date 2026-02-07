import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { SatelliteLayer, SatelliteSource } from '@/types/satellite';

interface LayerControlsProps {
  layers: SatelliteLayer[];
  onToggleVisibility: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

const SATELLITE_STYLES: Record<SatelliteSource, { gradient: string; glow: string; label: string }> = {
  sentinel: { gradient: 'from-sentinel to-sentinel/60', glow: 'glow-sentinel', label: 'Sentinel' },
  landsat: { gradient: 'from-landsat to-landsat/60', glow: 'glow-landsat', label: 'Landsat' },
  isro: { gradient: 'from-isro to-isro/60', glow: 'glow-isro', label: 'ISRO' },
};

export function LayerControls({ layers, onToggleVisibility, onOpacityChange }: LayerControlsProps) {
  if (layers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Layer Controls</h3>
        </div>
        <p className="text-xs text-muted-foreground text-center py-4">
          Run analysis to load satellite layers
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Layer Controls</h3>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Step 2: Toggle visibility and adjust opacity to blend multi-source data
      </p>
      
      <div className="space-y-4">
        {layers.map((layer, index) => {
          const style = SATELLITE_STYLES[layer.source];
          
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                layer.visible 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-border/30 bg-muted/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${style.gradient} ${layer.visible ? style.glow : ''}`} />
                  <Label className="font-medium text-sm text-foreground">{style.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  {layer.visible ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={() => onToggleVisibility(layer.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
              
              {layer.visible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Opacity</span>
                    <span className="font-mono text-foreground">{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[layer.opacity * 100]}
                    onValueChange={([value]) => onOpacityChange(layer.id, value / 100)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Res: {layer.metadata.resolution}</span>
                    <span>Cloud: {layer.metadata.cloudCover}%</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {layers.length > 1 && (
        <p className="text-xs text-primary/80 text-center pt-2 flex items-center justify-center gap-1">
          <Layers className="h-3 w-3" />
          Adjust opacity to blend layers
        </p>
      )}
    </motion.div>
  );
}

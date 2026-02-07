import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { Header } from '@/components/Header';
import { SatelliteMap } from '@/components/SatelliteMap';
import { ControlPanel } from '@/components/ControlPanel';
import { LayerControls } from '@/components/LayerControls';
import { InsightsPanel } from '@/components/InsightsPanel';
import { performAnalysis } from '@/services/satelliteApi';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Coordinates, DateRange, SatelliteSource, SatelliteLayer, SatelliteInsight, FusedInsight } from '@/types/satellite';

export default function Index() {
  const [mapCenter, setMapCenter] = useState<Coordinates>({ latitude: 28.6139, longitude: 77.2090 });
  const [mapZoom] = useState(10);
  const [layers, setLayers] = useState<SatelliteLayer[]>([]);
  const [insights, setInsights] = useState<SatelliteInsight[]>([]);
  const [fusedInsights, setFusedInsights] = useState<FusedInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  
  const handleAnalyze = useCallback(async (
    coords: Coordinates, 
    dateRange: DateRange, 
    satellites: SatelliteSource[]
  ) => {
    setIsLoading(true);
    try {
      const result = await performAnalysis(coords, dateRange, satellites);
      setLayers(result.layers);
      setInsights(result.insights);
      setFusedInsights(result.fusedInsights);
      setMapCenter(coords);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleMapClick = useCallback((coords: Coordinates) => {
    setMapCenter(coords);
  }, []);
  
  const handleCoordinatesChange = useCallback((coords: Coordinates) => {
    setMapCenter(coords);
  }, []);
  
  const handleToggleVisibility = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);
  
  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Panel - Controls */}
        <AnimatePresence mode="wait">
          {leftPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden flex-shrink-0"
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <ControlPanel 
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                    onCoordinatesChange={handleCoordinatesChange}
                  />
                  <LayerControls
                    layers={layers}
                    onToggleVisibility={handleToggleVisibility}
                    onOpacityChange={handleOpacityChange}
                  />
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Left Panel Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-6 rounded-l-none rounded-r-lg bg-card/80 border border-l-0 border-border/50 hover:bg-accent"
          style={{ left: leftPanelOpen ? 340 : 0 }}
        >
          {leftPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        
        {/* Map Area */}
        <main className="flex-1 relative">
          <SatelliteMap
            center={mapCenter}
            zoom={mapZoom}
            layers={layers}
            onMapClick={handleMapClick}
          />
          
          {/* Coordinates Display */}
          <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg px-3 py-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">
                LAT: <span className="text-foreground">{mapCenter.latitude.toFixed(4)}°</span>
              </span>
              <span className="text-muted-foreground">
                LNG: <span className="text-foreground">{mapCenter.longitude.toFixed(4)}°</span>
              </span>
            </div>
          </div>
          
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[1000] bg-background/60 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="glass-panel rounded-xl p-6 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-2 border-4 border-transparent border-t-sentinel rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <p className="text-sm font-medium text-foreground">Fusing Satellite Data</p>
                  <p className="text-xs text-muted-foreground mt-1">Aligning multi-source imagery...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Right Panel Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-6 rounded-r-none rounded-l-lg bg-card/80 border border-r-0 border-border/50 hover:bg-accent"
          style={{ right: rightPanelOpen ? 380 : 0 }}
        >
          {rightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        
        {/* Right Panel - Insights */}
        <AnimatePresence mode="wait">
          {rightPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden flex-shrink-0"
            >
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Unified Insights</h2>
                  </div>
                  <InsightsPanel 
                    insights={insights}
                    fusedInsights={fusedInsights}
                  />
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

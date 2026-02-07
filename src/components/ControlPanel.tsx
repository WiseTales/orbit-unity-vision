import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Satellite, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { SatelliteSource, Coordinates, DateRange } from '@/types/satellite';

interface ControlPanelProps {
  onAnalyze: (coords: Coordinates, dateRange: DateRange, satellites: SatelliteSource[]) => void;
  isLoading: boolean;
  onCoordinatesChange: (coords: Coordinates) => void;
}

const SATELLITE_CONFIG: { id: SatelliteSource; name: string; agency: string; colorClass: string }[] = [
  { id: 'sentinel', name: 'Sentinel', agency: 'ESA / Copernicus', colorClass: 'text-sentinel' },
  { id: 'landsat', name: 'Landsat', agency: 'NASA / USGS', colorClass: 'text-landsat' },
  { id: 'isro', name: 'ISRO', agency: 'ISRO / Bhuvan', colorClass: 'text-isro' },
];

export function ControlPanel({ onAnalyze, isLoading, onCoordinatesChange }: ControlPanelProps) {
  const [latitude, setLatitude] = useState('28.6139');
  const [longitude, setLongitude] = useState('77.2090');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [selectedSatellites, setSelectedSatellites] = useState<SatelliteSource[]>(['sentinel', 'landsat', 'isro']);
  
  const handleSatelliteToggle = (satellite: SatelliteSource) => {
    setSelectedSatellites(prev => 
      prev.includes(satellite) 
        ? prev.filter(s => s !== satellite)
        : [...prev, satellite]
    );
  };
  
  const handleCoordinateChange = (lat: string, lng: string) => {
    setLatitude(lat);
    setLongitude(lng);
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      onCoordinatesChange({ latitude: parsedLat, longitude: parsedLng });
    }
  };
  
  const handleSubmit = () => {
    const coords: Coordinates = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    const dateRange: DateRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    onAnalyze(coords, dateRange, selectedSatellites);
  };
  
  const isValid = selectedSatellites.length > 0 && 
    !isNaN(parseFloat(latitude)) && 
    !isNaN(parseFloat(longitude)) &&
    startDate && endDate;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-xl p-5 space-y-6"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          Analysis Parameters
        </h2>
        <p className="text-xs text-muted-foreground">
          Configure coordinates, time range, and data sources
        </p>
      </div>
      
      {/* Coordinates Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Geographic Coordinates
        </Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Click on the map or enter manually
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="latitude" className="data-label">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => handleCoordinateChange(e.target.value, longitude)}
              placeholder="28.6139"
              className="bg-input border-border font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="longitude" className="data-label">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => handleCoordinateChange(latitude, e.target.value)}
              placeholder="77.2090"
              className="bg-input border-border font-mono text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Date Range Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          Observation Window
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="startDate" className="data-label">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-input border-border text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endDate" className="data-label">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-input border-border text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Satellite Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Satellite className="h-4 w-4 text-primary" />
          Data Sources
        </Label>
        <p className="text-xs text-muted-foreground -mt-1">
          Select satellites for multi-source fusion
        </p>
        <div className="space-y-2">
          {SATELLITE_CONFIG.map((sat, index) => (
            <motion.div
              key={sat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer
                ${selectedSatellites.includes(sat.id) 
                  ? 'border-primary/40 bg-primary/5' 
                  : 'border-border/50 bg-muted/30 hover:border-border'
                }`}
              onClick={() => handleSatelliteToggle(sat.id)}
            >
              <Checkbox
                id={sat.id}
                checked={selectedSatellites.includes(sat.id)}
                onCheckedChange={() => handleSatelliteToggle(sat.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1">
                <Label htmlFor={sat.id} className={`font-medium cursor-pointer ${sat.colorClass}`}>
                  {sat.name}
                </Label>
                <p className="text-xs text-muted-foreground">{sat.agency}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                sat.id === 'sentinel' ? 'bg-sentinel glow-sentinel' :
                sat.id === 'landsat' ? 'bg-landsat glow-landsat' :
                'bg-isro glow-isro'
              }`} />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Analyze Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Fusing Satellite Data...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Analyze & Fuse Data
          </>
        )}
      </Button>
      
      {selectedSatellites.length === 0 && (
        <p className="text-xs text-destructive text-center">
          Select at least one satellite source
        </p>
      )}
      
      {selectedSatellites.length === 3 && (
        <p className="text-xs text-emerald-400 text-center flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" />
          Maximum fusion accuracy enabled
        </p>
      )}
    </motion.div>
  );
}

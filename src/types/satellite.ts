export type SatelliteSource = 'sentinel' | 'landsat' | 'isro';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface SatelliteLayer {
  id: string;
  source: SatelliteSource;
  imageUrl: string;
  bounds: [[number, number], [number, number]];
  opacity: number;
  visible: boolean;
  metadata: SatelliteMetadata;
}

export interface SatelliteMetadata {
  captureDate: string;
  cloudCover: number;
  resolution: string;
  band: string;
  processingLevel: string;
}

export interface SatelliteInsight {
  source: SatelliteSource;
  ndvi?: {
    value: number;
    status: 'good' | 'moderate' | 'poor';
    label: string;
  };
  terrain?: {
    elevation: number;
    slope: string;
    aspect: string;
  };
  change?: {
    trend: 'improving' | 'stable' | 'declining';
    description: string;
    percentChange: number;
  };
  waterBody?: {
    detected: boolean;
    coverage: number;
  };
  urbanization?: {
    level: string;
    change: string;
  };
}

export interface AnalysisResult {
  coordinates: Coordinates;
  dateRange: DateRange;
  layers: SatelliteLayer[];
  insights: SatelliteInsight[];
  fusedInsights: FusedInsight;
  timestamp: string;
}

export interface FusedInsight {
  overallHealth: 'excellent' | 'good' | 'moderate' | 'poor';
  confidence: number;
  summary: string;
  recommendations: string[];
  dataSources: SatelliteSource[];
}

export interface AnalysisRequest {
  coordinates: Coordinates;
  dateRange: DateRange;
  satellites: SatelliteSource[];
}

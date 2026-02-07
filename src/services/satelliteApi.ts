import type { 
  SatelliteSource, 
  Coordinates, 
  DateRange, 
  SatelliteLayer, 
  SatelliteInsight,
  AnalysisResult,
  FusedInsight
} from '@/types/satellite';

// Mock satellite imagery URLs (these would be real API calls in production)
const MOCK_IMAGERY: Record<SatelliteSource, string[]> = {
  sentinel: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', // Earth from space
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80', // Space view
  ],
  landsat: [
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80', // Satellite imagery style
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', // Night earth
  ],
  isro: [
    'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?w=800&q=80', // Terrain view
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80', // Geographic view
  ],
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock NDVI data based on coordinates
const generateNDVI = (lat: number, lng: number): { value: number; status: 'good' | 'moderate' | 'poor'; label: string } => {
  // Simulate variation based on coordinates
  const baseValue = 0.3 + (Math.sin(lat * 0.1) + Math.cos(lng * 0.1)) * 0.2 + Math.random() * 0.2;
  const value = Math.max(0, Math.min(1, baseValue));
  
  if (value >= 0.6) return { value, status: 'good', label: 'Healthy Vegetation' };
  if (value >= 0.3) return { value, status: 'moderate', label: 'Moderate Vegetation' };
  return { value, status: 'poor', label: 'Sparse/No Vegetation' };
};

// Generate mock terrain data
const generateTerrain = (lat: number, lng: number) => ({
  elevation: Math.floor(100 + Math.abs(Math.sin(lat) * Math.cos(lng)) * 2000 + Math.random() * 500),
  slope: ['Flat', 'Gentle', 'Moderate', 'Steep'][Math.floor(Math.random() * 4)],
  aspect: ['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'][Math.floor(Math.random() * 8)],
});

// Generate mock change detection
const generateChange = (): { trend: 'improving' | 'stable' | 'declining'; description: string; percentChange: number } => {
  const trends = ['improving', 'stable', 'declining'] as const;
  const trend = trends[Math.floor(Math.random() * 3)];
  const percentChange = Math.random() * 20 - 10;
  
  const descriptions: Record<typeof trend, string> = {
    improving: 'Vegetation density has increased compared to previous observation period',
    stable: 'Land cover patterns remain consistent with historical data',
    declining: 'Some reduction in vegetation cover detected in the analysis window',
  };
  
  return { trend, description: descriptions[trend], percentChange };
};

// Mock API endpoint for Sentinel data
export async function fetchSentinelData(
  coordinates: Coordinates,
  dateRange: DateRange
): Promise<{ layer: SatelliteLayer; insight: SatelliteInsight }> {
  await delay(800 + Math.random() * 400);
  
  const { latitude, longitude } = coordinates;
  const boundsOffset = 0.1;
  
  return {
    layer: {
      id: `sentinel-${Date.now()}`,
      source: 'sentinel',
      imageUrl: MOCK_IMAGERY.sentinel[Math.floor(Math.random() * MOCK_IMAGERY.sentinel.length)],
      bounds: [
        [latitude - boundsOffset, longitude - boundsOffset],
        [latitude + boundsOffset, longitude + boundsOffset],
      ],
      opacity: 0.7,
      visible: true,
      metadata: {
        captureDate: dateRange.endDate.toISOString().split('T')[0],
        cloudCover: Math.floor(Math.random() * 20),
        resolution: '10m',
        band: 'True Color (B4, B3, B2)',
        processingLevel: 'L2A',
      },
    },
    insight: {
      source: 'sentinel',
      ndvi: generateNDVI(latitude, longitude),
      change: generateChange(),
      waterBody: {
        detected: Math.random() > 0.6,
        coverage: Math.random() * 15,
      },
    },
  };
}

// Mock API endpoint for Landsat data
export async function fetchLandsatData(
  coordinates: Coordinates,
  dateRange: DateRange
): Promise<{ layer: SatelliteLayer; insight: SatelliteInsight }> {
  await delay(1000 + Math.random() * 500);
  
  const { latitude, longitude } = coordinates;
  const boundsOffset = 0.12;
  
  return {
    layer: {
      id: `landsat-${Date.now()}`,
      source: 'landsat',
      imageUrl: MOCK_IMAGERY.landsat[Math.floor(Math.random() * MOCK_IMAGERY.landsat.length)],
      bounds: [
        [latitude - boundsOffset, longitude - boundsOffset],
        [latitude + boundsOffset, longitude + boundsOffset],
      ],
      opacity: 0.7,
      visible: true,
      metadata: {
        captureDate: dateRange.endDate.toISOString().split('T')[0],
        cloudCover: Math.floor(Math.random() * 25),
        resolution: '30m',
        band: 'Natural Color (B4, B3, B2)',
        processingLevel: 'Level-2',
      },
    },
    insight: {
      source: 'landsat',
      ndvi: generateNDVI(latitude + 0.01, longitude + 0.01), // Slight variation
      urbanization: {
        level: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
        change: ['+2.3% since 2020', 'Stable', '+5.1% since 2020'][Math.floor(Math.random() * 3)],
      },
    },
  };
}

// Mock API endpoint for ISRO data
export async function fetchISROData(
  coordinates: Coordinates,
  dateRange: DateRange
): Promise<{ layer: SatelliteLayer; insight: SatelliteInsight }> {
  await delay(900 + Math.random() * 600);
  
  const { latitude, longitude } = coordinates;
  const boundsOffset = 0.08;
  
  return {
    layer: {
      id: `isro-${Date.now()}`,
      source: 'isro',
      imageUrl: MOCK_IMAGERY.isro[Math.floor(Math.random() * MOCK_IMAGERY.isro.length)],
      bounds: [
        [latitude - boundsOffset, longitude - boundsOffset],
        [latitude + boundsOffset, longitude + boundsOffset],
      ],
      opacity: 0.7,
      visible: true,
      metadata: {
        captureDate: dateRange.endDate.toISOString().split('T')[0],
        cloudCover: Math.floor(Math.random() * 15),
        resolution: '5.8m',
        band: 'LISS-IV MX',
        processingLevel: 'Ortho-rectified',
      },
    },
    insight: {
      source: 'isro',
      terrain: generateTerrain(latitude, longitude),
      ndvi: generateNDVI(latitude - 0.01, longitude - 0.01),
    },
  };
}

// Generate fused insights from multiple satellite sources
function generateFusedInsights(
  insights: SatelliteInsight[],
  sources: SatelliteSource[]
): FusedInsight {
  const ndviValues = insights
    .filter(i => i.ndvi)
    .map(i => i.ndvi!.value);
  
  const avgNDVI = ndviValues.length > 0 
    ? ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length 
    : 0.5;
  
  let overallHealth: FusedInsight['overallHealth'];
  if (avgNDVI >= 0.7) overallHealth = 'excellent';
  else if (avgNDVI >= 0.5) overallHealth = 'good';
  else if (avgNDVI >= 0.3) overallHealth = 'moderate';
  else overallHealth = 'poor';
  
  const confidence = Math.min(95, 60 + sources.length * 12 + Math.random() * 10);
  
  const summaries: Record<FusedInsight['overallHealth'], string> = {
    excellent: 'Cross-satellite analysis indicates excellent vegetation health and land cover stability in the selected region.',
    good: 'Multi-source fusion reveals generally healthy environmental conditions with minor variations across observation periods.',
    moderate: 'Integrated analysis shows moderate land health. Some areas may benefit from closer monitoring.',
    poor: 'Fused satellite data indicates potential environmental stress. Recommend detailed ground-truthing.',
  };
  
  const recommendations: string[] = [
    sources.length < 3 ? 'Enable all three satellite sources for higher confidence analysis' : 'All data sources active - maximum fusion accuracy',
    overallHealth === 'poor' || overallHealth === 'moderate' ? 'Consider time-series analysis to identify trend patterns' : 'Current conditions suitable for baseline establishment',
    'Cross-reference with local weather data for complete assessment',
  ];
  
  return {
    overallHealth,
    confidence: Math.round(confidence),
    summary: summaries[overallHealth],
    recommendations,
    dataSources: sources,
  };
}

// Main analysis function that fetches from all selected satellites
export async function performAnalysis(
  coordinates: Coordinates,
  dateRange: DateRange,
  satellites: SatelliteSource[]
): Promise<AnalysisResult> {
  const fetchPromises: Promise<{ layer: SatelliteLayer; insight: SatelliteInsight }>[] = [];
  
  if (satellites.includes('sentinel')) {
    fetchPromises.push(fetchSentinelData(coordinates, dateRange));
  }
  if (satellites.includes('landsat')) {
    fetchPromises.push(fetchLandsatData(coordinates, dateRange));
  }
  if (satellites.includes('isro')) {
    fetchPromises.push(fetchISROData(coordinates, dateRange));
  }
  
  const results = await Promise.all(fetchPromises);
  
  const layers = results.map(r => r.layer);
  const insights = results.map(r => r.insight);
  const fusedInsights = generateFusedInsights(insights, satellites);
  
  return {
    coordinates,
    dateRange,
    layers,
    insights,
    fusedInsights,
    timestamp: new Date().toISOString(),
  };
}

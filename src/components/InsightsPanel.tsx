import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Leaf, 
  Mountain, 
  Droplets, 
  Building2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import type { SatelliteInsight, FusedInsight, SatelliteSource } from '@/types/satellite';

interface InsightsPanelProps {
  insights: SatelliteInsight[];
  fusedInsights: FusedInsight | null;
}

const SOURCE_COLORS: Record<SatelliteSource, string> = {
  sentinel: 'text-sentinel border-sentinel/30 bg-sentinel/10',
  landsat: 'text-landsat border-landsat/30 bg-landsat/10',
  isro: 'text-isro border-isro/30 bg-isro/10',
};

const SOURCE_LABELS: Record<SatelliteSource, string> = {
  sentinel: 'Sentinel',
  landsat: 'Landsat',
  isro: 'ISRO',
};

function SourceBadge({ source }: { source: SatelliteSource }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${SOURCE_COLORS[source]}`}>
      {SOURCE_LABELS[source]}
    </span>
  );
}

function NDVICard({ ndvi, source }: { ndvi: NonNullable<SatelliteInsight['ndvi']>; source: SatelliteSource }) {
  const statusColors = {
    good: 'text-emerald-400',
    moderate: 'text-amber-400',
    poor: 'text-red-400',
  };
  
  return (
    <div className="insight-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Vegetation Health</h4>
            <p className="text-xs text-muted-foreground">NDVI Analysis</p>
          </div>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-foreground">
          {ndvi.value.toFixed(2)}
        </span>
        <span className={`text-sm font-medium ${statusColors[ndvi.status]}`}>
          {ndvi.label}
        </span>
      </div>
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${ndvi.value * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            ndvi.status === 'good' ? 'bg-emerald-400' :
            ndvi.status === 'moderate' ? 'bg-amber-400' : 'bg-red-400'
          }`}
        />
      </div>
    </div>
  );
}

function TerrainCard({ terrain, source }: { terrain: NonNullable<SatelliteInsight['terrain']>; source: SatelliteSource }) {
  return (
    <div className="insight-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Mountain className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Terrain Analysis</h4>
            <p className="text-xs text-muted-foreground">Elevation & Topography</p>
          </div>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div>
          <p className="data-label">Elevation</p>
          <p className="data-value text-base">{terrain.elevation}m</p>
        </div>
        <div>
          <p className="data-label">Slope</p>
          <p className="text-sm font-medium text-foreground">{terrain.slope}</p>
        </div>
        <div>
          <p className="data-label">Aspect</p>
          <p className="text-sm font-medium text-foreground">{terrain.aspect}</p>
        </div>
      </div>
    </div>
  );
}

function ChangeCard({ change, source }: { change: NonNullable<SatelliteInsight['change']>; source: SatelliteSource }) {
  const TrendIcon = change.trend === 'improving' ? TrendingUp : 
                    change.trend === 'declining' ? TrendingDown : Minus;
  const trendColor = change.trend === 'improving' ? 'text-emerald-400' :
                     change.trend === 'declining' ? 'text-red-400' : 'text-amber-400';
  
  return (
    <div className="insight-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            change.trend === 'improving' ? 'bg-emerald-500/10' :
            change.trend === 'declining' ? 'bg-red-500/10' : 'bg-amber-500/10'
          }`}>
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Change Detection</h4>
            <p className="text-xs text-muted-foreground">Temporal Analysis</p>
          </div>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg font-bold capitalize ${trendColor}`}>
          {change.trend}
        </span>
        <span className="text-sm text-muted-foreground">
          ({change.percentChange > 0 ? '+' : ''}{change.percentChange.toFixed(1)}%)
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{change.description}</p>
    </div>
  );
}

function WaterCard({ waterBody, source }: { waterBody: NonNullable<SatelliteInsight['waterBody']>; source: SatelliteSource }) {
  return (
    <div className="insight-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Droplets className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Water Bodies</h4>
            <p className="text-xs text-muted-foreground">Surface Water Detection</p>
          </div>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-lg font-bold ${waterBody.detected ? 'text-cyan-400' : 'text-muted-foreground'}`}>
          {waterBody.detected ? 'Detected' : 'Not Detected'}
        </span>
        {waterBody.detected && (
          <span className="text-sm text-muted-foreground">
            ({waterBody.coverage.toFixed(1)}% coverage)
          </span>
        )}
      </div>
    </div>
  );
}

function UrbanCard({ urbanization, source }: { urbanization: NonNullable<SatelliteInsight['urbanization']>; source: SatelliteSource }) {
  return (
    <div className="insight-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Building2 className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Urbanization</h4>
            <p className="text-xs text-muted-foreground">Built-up Area Analysis</p>
          </div>
        </div>
        <SourceBadge source={source} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="data-label">Level</p>
          <p className="text-sm font-medium text-foreground">{urbanization.level}</p>
        </div>
        <div>
          <p className="data-label">Change</p>
          <p className="text-sm font-medium text-foreground">{urbanization.change}</p>
        </div>
      </div>
    </div>
  );
}

function FusedInsightsCard({ fused }: { fused: FusedInsight }) {
  const healthColors = {
    excellent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    good: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    poor: 'text-red-400 bg-red-500/10 border-red-500/30',
  };
  
  const HealthIcon = fused.overallHealth === 'excellent' || fused.overallHealth === 'good' 
    ? CheckCircle 
    : fused.overallHealth === 'moderate' ? AlertCircle : Info;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-5 border ${healthColors[fused.overallHealth]} mb-4`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Fused Analysis</h3>
            <p className="text-xs text-muted-foreground">
              Multi-satellite intelligence from {fused.dataSources.length} sources
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <HealthIcon className="h-4 w-4" />
            <span className="text-sm font-bold capitalize">{fused.overallHealth}</span>
          </div>
          <span className="text-xs text-muted-foreground">{fused.confidence}% confidence</span>
        </div>
      </div>
      
      <p className="text-sm text-foreground/90 mb-4">{fused.summary}</p>
      
      <div className="space-y-2">
        <p className="data-label">Recommendations</p>
        {fused.recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="text-primary">•</span>
            <span>{rec}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
        {fused.dataSources.map(source => (
          <SourceBadge key={source} source={source} />
        ))}
      </div>
    </motion.div>
  );
}

export function InsightsPanel({ insights, fusedInsights }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel rounded-xl p-6 text-center"
      >
        <Sparkles className="h-8 w-8 text-primary/50 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground mb-1">No Analysis Yet</h3>
        <p className="text-xs text-muted-foreground">
          Configure parameters and run analysis to see unified satellite insights
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {fusedInsights && <FusedInsightsCard fused={fusedInsights} />}
      
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={`${insight.source}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            {insight.ndvi && <NDVICard ndvi={insight.ndvi} source={insight.source} />}
            {insight.terrain && <TerrainCard terrain={insight.terrain} source={insight.source} />}
            {insight.change && <ChangeCard change={insight.change} source={insight.source} />}
            {insight.waterBody && <WaterCard waterBody={insight.waterBody} source={insight.source} />}
            {insight.urbanization && <UrbanCard urbanization={insight.urbanization} source={insight.source} />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Satellite, Radio, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel border-b border-border/50 px-6 py-4"
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Satellite className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              SatFusion
            </h1>
            <p className="text-xs text-muted-foreground">
              Unified Satellite Intelligence Platform
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sentinel animate-pulse" />
              <span>Sentinel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-landsat animate-pulse" />
              <span>Landsat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-isro animate-pulse" />
              <span>ISRO</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Radio className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Live</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Multi-Source Fusion</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

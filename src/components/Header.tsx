import { motion } from 'framer-motion';
import { Satellite, Radio, Globe2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass-panel border-b border-border/30 px-4 md:px-6 py-3"
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-glow">
              <Satellite className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-isro rounded-full animate-pulse shadow-lg shadow-isro/50" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
              SatFusion
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">
              Multi-Source Earth Observation Dashboard
            </p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Data Sources - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-sentinel/10 border border-sentinel/20">
              <div className="w-2 h-2 rounded-full bg-sentinel animate-pulse shadow-lg shadow-sentinel/50" />
              <span className="text-sentinel font-medium">Sentinel-2</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-landsat/10 border border-landsat/20">
              <div className="w-2 h-2 rounded-full bg-landsat animate-pulse shadow-lg shadow-landsat/50" />
              <span className="text-landsat font-medium">MODIS</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-isro/10 border border-isro/20">
              <div className="w-2 h-2 rounded-full bg-isro animate-pulse shadow-lg shadow-isro/50" />
              <span className="text-isro font-medium">ESRI</span>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-primary/10 border border-primary/30 shadow-glow">
            <Radio className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Live</span>
          </div>
          
          {/* Globe icon - mobile only */}
          <div className="flex md:hidden items-center">
            <Globe2 className="h-4 w-4 text-primary" />
          </div>
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-muted/50 hover:bg-muted border border-border/50"
          >
          {isDark ? (
              <Sun className="h-4 w-4 text-landsat" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="absolute bottom-0 right-0 z-[1000] p-4"
    >
      <div className="glass-panel rounded-lg px-4 py-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            Data: 
            <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
              OSM <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="mx-1">•</span>
            <a href="https://carto.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
              CARTO <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="mx-1">•</span>
            <a href="https://s2maps.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
              EOX <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-muted-foreground/70">Orbit Unity Vision | Scalable with real satellite APIs</span>
        </div>
      </div>
    </motion.footer>
  );
}

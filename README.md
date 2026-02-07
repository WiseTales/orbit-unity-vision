# Orbit Unity Vision

**Unified Satellite Data Analysis Platform**

A hackathon project that unifies satellite data from **Sentinel** (ESA/Copernicus), **Landsat** (NASA/USGS), and **ISRO** (Bhuvan) into a single analytical interface with layered visualization, data fusion, and cross-source insights.

## The Problem

Satellite data is fragmented across agencies -- each with different formats, portals, and access methods. Analysts waste time switching between platforms instead of drawing insights.

## Our Solution

Orbit Unity Vision provides a unified dashboard that:

- Overlays multi-source satellite imagery on a single interactive map
- Fuses data from Sentinel, Landsat, and ISRO with adjustable layer opacity
- Generates cross-satellite analytical insights (NDVI, elevation, temporal change)
- Scales to support real satellite APIs when connected

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** for UI components
- **Leaflet.js** for interactive mapping
- **Framer Motion** for smooth animations
- **Recharts** for data visualization

## Getting Started

```sh
# Clone the repository
git clone https://github.com/WiseTales/orbit-unity-vision.git

# Navigate to the project
cd orbit-unity-vision

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Project Structure

```
src/
  components/    # Reusable UI components (map, panels, controls)
  pages/         # Page-level components
  services/      # API service layer (mock data / future real APIs)
  types/         # TypeScript type definitions
  hooks/         # Custom React hooks
```

## Deployment

Deploy to Vercel or any static hosting platform:

```sh
npm run build
```

## License

MIT

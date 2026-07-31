import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BusinessRecord, GhanaRegion } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';
import { Flame, Eye, MapPin, Sparkles, Info, Sliders } from 'lucide-react';

interface D3HeatmapLayerProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
  selectedRegionFilter: GhanaRegion | 'ALL';
}

type HeatmapMetric = 'density' | 'revenue_gap' | 'no_website';
type ColorScheme = 'YlOrRd' | 'Turbo' | 'Inferno' | 'Viridis';

export const D3HeatmapLayer: React.FC<D3HeatmapLayerProps> = ({
  businesses,
  onSelectBusiness,
  selectedRegionFilter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 480,
  });

  const [metric, setMetric] = useState<HeatmapMetric>('density');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('YlOrRd');
  const [bandwidth, setBandwidth] = useState<number>(30);
  const [hoveredBusiness, setHoveredBusiness] = useState<BusinessRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // ResizeObserver for responsive canvas
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setDimensions({
            width: Math.max(320, entry.contentRect.width),
            height: Math.max(380, Math.min(520, entry.contentRect.height || 480)),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter businesses by active region
  const activeBusinesses =
    selectedRegionFilter === 'ALL'
      ? businesses
      : businesses.filter((b) => b.region === selectedRegionFilter);

  // Geographic bounds for Ghana
  // Lat range ~ 4.7 N to 11.2 N, Lng range ~ -3.3 W to 1.2 E
  const MIN_LAT = 4.5;
  const MAX_LAT = 11.3;
  const MIN_LNG = -3.4;
  const MAX_LNG = 1.3;

  // Convert lat/lng to canvas pixel coordinates using D3 Linear Scales
  const getPixelCoords = (lat: number, lng: number, width: number, height: number) => {
    const padding = 45;
    // Lng -> X
    const xScale = d3
      .scaleLinear()
      .domain([MIN_LNG, MAX_LNG])
      .range([padding, width - padding]);

    // Lat -> Y (reversed because canvas 0,0 is top-left)
    const yScale = d3
      .scaleLinear()
      .domain([MIN_LAT, MAX_LAT])
      .range([height - padding, padding]);

    return { x: xScale(lng), y: yScale(lat) };
  };

  // Color interpolator selection
  const getColorInterpolator = (scheme: ColorScheme) => {
    switch (scheme) {
      case 'Turbo':
        return d3.interpolateTurbo;
      case 'Inferno':
        return d3.interpolateInferno;
      case 'Viridis':
        return d3.interpolateViridis;
      case 'YlOrRd':
      default:
        return d3.interpolateYlOrRd;
    }
  };

  // Draw Heatmap onto Canvas using D3 Contour Density Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a'; // Deep slate dark backdrop for vibrant glowing heatmap contrast
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Map business records into points with weights based on active metric
    const points: [number, number, number][] = activeBusinesses.map((b, index) => {
      let lat = b.gpsCoords?.lat;
      let lng = b.gpsCoords?.lng;

      // Fallback if coordinates missing: use region center + slight random offset
      if (!lat || !lng) {
        const regData = GHANA_REGIONS_DATA.find((r) => r.region === b.region) || GHANA_REGIONS_DATA[0];
        const offsetAngle = (index * 137.5 * Math.PI) / 180;
        const offsetDist = 0.08 + (index % 5) * 0.03;
        lat = regData.lat + Math.sin(offsetAngle) * offsetDist;
        lng = regData.lng + Math.cos(offsetAngle) * offsetDist;
      }

      const { x, y } = getPixelCoords(lat, lng, width, height);

      let weight = 1;
      if (metric === 'revenue_gap') {
        weight = b.recommendedServices[0]?.setupFeeGHS || 1200;
      } else if (metric === 'no_website') {
        weight = !b.hasWebsite ? 3 : 0.5;
      }

      return [x, y, weight];
    });

    if (points.length === 0) return;

    // Build D3 Contour Density Generator
    const contourGen = d3
      .contourDensity<[number, number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .weight((d) => d[2])
      .size([width, height])
      .bandwidth(bandwidth)
      .thresholds(22);

    const contours = contourGen(points);
    const maxVal = d3.max(contours, (c) => c.value) || 0.001;
    const interpolator = getColorInterpolator(colorScheme);

    // Render contours onto Canvas
    contours.forEach((c) => {
      const normValue = Math.min(1, Math.max(0, c.value / maxVal));
      const color = interpolator(normValue);

      ctx.save();
      ctx.beginPath();

      // D3 Geo Path for canvas rendering
      const path = d3.geoPath().context(ctx);
      path(c);

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55 + normValue * 0.35; // Deeper opacity for denser areas
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    // Draw Regional Centroids & Label Badges
    GHANA_REGIONS_DATA.forEach((reg) => {
      if (selectedRegionFilter !== 'ALL' && selectedRegionFilter !== reg.region) return;

      const { x, y } = getPixelCoords(reg.lat, reg.lng, width, height);
      const bizCount = businesses.filter((b) => b.region === reg.region).length;

      // Pulse ring for regional center
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#6366f1';
      ctx.fill();

      // Text label
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`${reg.region} (${bizCount})`, x + 10, y + 3);
      ctx.restore();
    });
  }, [dimensions, activeBusinesses, metric, colorScheme, bandwidth, selectedRegionFilter]);

  return (
    <div className="space-y-4">
      {/* Heatmap Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        {/* Metric Picker */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Metric:</span>
          </span>
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setMetric('density')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                metric === 'density' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Business Density
            </button>
            <button
              onClick={() => setMetric('revenue_gap')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                metric === 'revenue_gap' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue Opportunity (GHS)
            </button>
            <button
              onClick={() => setMetric('no_website')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                metric === 'no_website' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Digitization Need
            </button>
          </div>
        </div>

        {/* Color Palette & Bandwidth Sliders */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Palette */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Palette:</span>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="YlOrRd">Yellow-Orange-Red</option>
              <option value="Turbo">Rainbow Turbo</option>
              <option value="Inferno">Dark Inferno</option>
              <option value="Viridis">Viridis High-Contrast</option>
            </select>
          </div>

          {/* Bandwidth / Radius */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Radius:</span>
            <input
              type="range"
              min="15"
              max="50"
              value={bandwidth}
              onChange={(e) => setBandwidth(Number(e.target.value))}
              className="w-20 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-[10px] text-indigo-300 w-4">{bandwidth}</span>
          </div>
        </div>
      </div>

      {/* D3 Heatmap Stage */}
      <div
        ref={containerRef}
        className="relative w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[460px] flex items-center justify-center"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Interactive SVG Overlay for Business Pins on top of D3 Heatmap */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {activeBusinesses.map((biz, idx) => {
            let lat = biz.gpsCoords?.lat;
            let lng = biz.gpsCoords?.lng;

            if (!lat || !lng) {
              const regData = GHANA_REGIONS_DATA.find((r) => r.region === biz.region) || GHANA_REGIONS_DATA[0];
              const offsetAngle = (idx * 137.5 * Math.PI) / 180;
              const offsetDist = 0.08 + (idx % 5) * 0.03;
              lat = regData.lat + Math.sin(offsetAngle) * offsetDist;
              lng = regData.lng + Math.cos(offsetAngle) * offsetDist;
            }

            const { x, y } = getPixelCoords(lat, lng, dimensions.width, dimensions.height);
            const isHovered = hoveredBusiness?.id === biz.id;
            const isNoWeb = !biz.hasWebsite;

            return (
              <g
                key={biz.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectBusiness(biz)}
                onMouseEnter={(e) => {
                  setHoveredBusiness(biz);
                  setTooltipPos({ x, y });
                }}
                onMouseLeave={() => {
                  setHoveredBusiness(null);
                  setTooltipPos(null);
                }}
              >
                {/* Glow ring */}
                <circle
                  r={isHovered ? 12 : 7}
                  fill={isNoWeb ? '#ef4444' : '#10b981'}
                  fillOpacity={isHovered ? 0.4 : 0.2}
                  className="animate-ping"
                />

                {/* Marker point */}
                <circle
                  r={isHovered ? 7 : 4}
                  fill={isNoWeb ? '#f87171' : '#34d399'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredBusiness && tooltipPos && (
          <div
            className="absolute z-30 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-2xl p-3 shadow-2xl text-xs space-y-1 pointer-events-none max-w-xs animate-fadeIn"
            style={{
              left: Math.min(dimensions.width - 240, Math.max(10, tooltipPos.x + 12)),
              top: Math.max(10, tooltipPos.y - 80),
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-sm text-amber-300">{hoveredBusiness.name}</span>
              <span className="bg-slate-800 text-slate-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                Score {hoveredBusiness.healthScore.overallScore}
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              {hoveredBusiness.city}, {hoveredBusiness.region} • {hoveredBusiness.category}
            </div>
            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-bold font-mono">
                Setup: GHS {hoveredBusiness.recommendedServices[0]?.setupFeeGHS || 1200}
              </span>
              <span className="text-indigo-300 font-bold flex items-center gap-1">
                <span>View Prospect</span>
                <Eye className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* D3 Heatmap Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 text-white text-[10px] space-y-1.5 shadow-lg">
          <div className="font-extrabold text-slate-300 uppercase tracking-wider text-[9px]">
            D3 Density Gradient ({metric.replace('_', ' ')})
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Low</span>
            <div
              className="w-28 h-2.5 rounded-full border border-slate-700"
              style={{
                background: `linear-gradient(to right, ${getColorInterpolator(colorScheme)(0)}, ${getColorInterpolator(
                  colorScheme
                )(0.5)}, ${getColorInterpolator(colorScheme)(1)})`,
              }}
            ></div>
            <span className="text-slate-400 font-medium">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

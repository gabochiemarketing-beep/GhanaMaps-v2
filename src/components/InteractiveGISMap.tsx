import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Building2,
  AlertTriangle,
  Zap,
  Filter,
  Eye,
  CheckCircle2,
  X,
  Phone,
  Globe,
  Plus,
  Compass,
  Mountain,
  Satellite,
  Map,
} from 'lucide-react';
import { BusinessRecord, GhanaRegion } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';
import { D3HeatmapLayer } from './D3HeatmapLayer';

interface InteractiveGISMapProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
  selectedRegionFilter: GhanaRegion | 'ALL';
  onSelectRegionFilter: (region: GhanaRegion | 'ALL') => void;
}

export type MapViewType = 'standard' | 'terrain' | 'satellite';

export const InteractiveGISMap: React.FC<InteractiveGISMapProps> = ({
  businesses,
  onSelectBusiness,
  selectedRegionFilter,
  onSelectRegionFilter,
}) => {
  const [mapMode, setMapMode] = useState<'pins' | 'heatmap' | 'density'>('pins');
  const [mapView, setMapView] = useState<MapViewType>('standard');
  const [hoveredRegion, setHoveredRegion] = useState<GhanaRegion | null>(null);
  const [activePin, setActivePin] = useState<BusinessRecord | null>(null);
  const [hoveredPin, setHoveredPin] = useState<BusinessRecord | null>(null);

  // Filter businesses by active region
  const filteredMapBusinesses =
    selectedRegionFilter === 'ALL'
      ? businesses
      : businesses.filter((b) => b.region === selectedRegionFilter);

  // Geographic coordinate percentage mapper for Ghana map canvas
  const getCoordsPercent = (lat?: number, lng?: number, region?: GhanaRegion, idx: number = 0) => {
    let finalLat = lat;
    let finalLng = lng;

    if (!finalLat || !finalLng) {
      const regData = GHANA_REGIONS_DATA.find((r) => r.region === region) || GHANA_REGIONS_DATA[0];
      const angle = (idx * 137.5 * Math.PI) / 180;
      const dist = 0.14 + (idx % 4) * 0.05;
      finalLat = regData.lat + Math.sin(angle) * dist;
      finalLng = regData.lng + Math.cos(angle) * dist;
    }

    const MIN_LAT = 4.5;
    const MAX_LAT = 11.3;
    const MIN_LNG = -3.4;
    const MAX_LNG = 1.3;

    const xPct = Math.max(8, Math.min(92, ((finalLng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100));
    const yPct = Math.max(8, Math.min(92, (1 - (finalLat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100));

    return { xPct, yPct };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Map Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900">Ghana GIS Intelligence Map</h2>
            <p className="text-xs text-slate-500">
              Interactive geographic opportunity plotting for all 16 Ghanaian regions
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Layer Selector (Standard / Terrain / Satellite) */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setMapView('standard')}
              title="Standard Vector Map View"
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                mapView === 'standard'
                  ? 'bg-slate-800 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => setMapView('terrain')}
              title="Topographic Terrain & Elevation View"
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                mapView === 'terrain'
                  ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Terrain</span>
            </button>
            <button
              onClick={() => setMapView('satellite')}
              title="High-Resolution Satellite Imagery View"
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                mapView === 'satellite'
                  ? 'bg-indigo-700 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Map Layer Mode */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setMapMode('pins')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'pins'
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📍 Pin Markers
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'heatmap'
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔥 Opportunity Heatmap
            </button>
            <button
              onClick={() => setMapMode('density')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapMode === 'density'
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Digital Maturity
            </button>
          </div>

          {/* Region Quick Selector */}
          <select
            value={selectedRegionFilter}
            onChange={(e) => onSelectRegionFilter(e.target.value as GhanaRegion | 'ALL')}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="ALL">All 16 Regions</option>
            {GHANA_REGIONS_DATA.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region} ({r.capital})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive GIS Layout: Canvas SVG Map & Sidebar List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Stage Canvas */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Background Coordinates Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-50/90 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
              <span className="text-slate-500 font-medium">Target Region: </span>
              <span className="font-bold text-indigo-700">{selectedRegionFilter}</span>
              <span className="text-slate-400 ml-2 font-medium">
                ({filteredMapBusinesses.length} Active Businesses Plotted)
              </span>
            </div>

            <div className="bg-slate-50/90 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] text-slate-600 flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Operative
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Digital Gap
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> No Website
            </div>
          </div>

          {/* Interactive Custom Map, Pin Markers Stage or D3 Heatmap Engine */}
          <div className="relative z-10 my-4">
            {mapMode === 'heatmap' ? (
              <D3HeatmapLayer
                businesses={businesses}
                onSelectBusiness={onSelectBusiness}
                selectedRegionFilter={selectedRegionFilter}
              />
            ) : mapMode === 'pins' ? (
              <div
                className={`relative w-full h-[460px] rounded-3xl border p-4 overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  mapView === 'terrain'
                    ? 'bg-gradient-to-br from-slate-950 via-emerald-950/90 to-amber-950/70 border-emerald-800/60'
                    : mapView === 'satellite'
                    ? 'bg-slate-950 border-sky-900/60 shadow-sky-950/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Background Grid & GIS Topographic Pattern according to mapView */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
                    mapView === 'terrain'
                      ? 'bg-[linear-gradient(to_right,#064e3b40_1px,transparent_1px),linear-gradient(to_bottom,#064e3b40_1px,transparent_1px),radial-gradient(#10b98125_2px,transparent_2px)] bg-[size:28px_28px]'
                      : mapView === 'satellite'
                      ? 'bg-[radial-gradient(#38bdf830_1px,transparent_1px),linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] bg-[size:20px_20px]'
                      : 'bg-[linear-gradient(to_right,#1e293b40_1px,transparent_1px),linear-gradient(to_bottom,#1e293b40_1px,transparent_1px)] bg-[size:32px_32px]'
                  }`}
                ></div>

                {/* Floating Map View Layer Indicator Badge */}
                <div className="absolute top-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md">
                  {mapView === 'terrain' && (
                    <>
                      <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Topographic Terrain View</span>
                    </>
                  )}
                  {mapView === 'satellite' && (
                    <>
                      <Satellite className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-sky-300">Satellite Imagery View</span>
                    </>
                  )}
                  {mapView === 'standard' && (
                    <>
                      <Map className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-300">Standard Vector View</span>
                    </>
                  )}
                </div>

                {/* Regional Base Outlines / Centroid Badges */}
                {GHANA_REGIONS_DATA.map((reg, idx) => {
                  if (selectedRegionFilter !== 'ALL' && selectedRegionFilter !== reg.region) return null;
                  const { xPct, yPct } = getCoordsPercent(reg.lat, reg.lng, reg.region, idx);
                  const count = businesses.filter((b) => b.region === reg.region).length;

                  return (
                    <div
                      key={reg.region}
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none opacity-40 hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">
                        {reg.region}
                      </span>
                      <span className="text-[9px] text-indigo-400 font-bold">({count})</span>
                    </div>
                  );
                })}

                {/* Plotted Business Pin Markers */}
                <div className="relative w-full h-full">
                  {filteredMapBusinesses.map((biz, idx) => {
                    const { xPct, yPct } = getCoordsPercent(
                      biz.gpsCoords?.lat,
                      biz.gpsCoords?.lng,
                      biz.region,
                      idx
                    );

                    const isHovered = hoveredPin?.id === biz.id;
                    const isSelected = activePin?.id === biz.id;
                    const isNoWeb = !biz.hasWebsite;

                    return (
                      <div
                        key={biz.id}
                        style={{ left: `${xPct}%`, top: `${yPct}%` }}
                        onClick={() => {
                          setActivePin(biz);
                          onSelectBusiness(biz);
                        }}
                        onMouseEnter={() => setHoveredPin(biz)}
                        onMouseLeave={() => setHoveredPin(null)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 ${
                          isHovered ? 'scale-125 z-40' : isSelected ? 'scale-110 z-30' : 'hover:scale-110'
                        }`}
                      >
                        {/* Custom Map Pin Icon */}
                        <div
                          className={`relative p-2 rounded-2xl border flex items-center justify-center shadow-lg transition-all ${
                            isNoWeb
                              ? 'bg-rose-500/90 text-white border-rose-400 shadow-rose-500/30'
                              : 'bg-emerald-500/90 text-white border-emerald-400 shadow-emerald-500/30'
                          } ${isHovered || isSelected ? 'ring-4 ring-indigo-400/50' : ''}`}
                        >
                          <MapPin className="w-4 h-4 fill-white/20 drop-shadow-sm" />

                          {/* Radar pulse for non-digitized high value prospects */}
                          {isNoWeb && (
                            <span className="absolute inset-0 rounded-2xl bg-rose-500 animate-ping opacity-30 pointer-events-none"></span>
                          )}
                        </div>

                        {/* Hover Tooltip Overlay showing Name & Primary Category */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-2xl p-2.5 shadow-2xl text-xs space-y-1 pointer-events-none animate-fadeIn z-50">
                            {/* Arrow Indicator */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>

                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-extrabold text-amber-300 text-xs truncate leading-tight">
                                {biz.name}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-1.5 py-0.5 rounded-md font-bold truncate">
                                🏷️ {biz.category}
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                              <span>📍 {biz.city}, {biz.region}</span>
                              <span className="text-emerald-400 font-bold font-mono">
                                GHS {biz.recommendedServices[0]?.setupFeeGHS || 1200}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[440px] bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center">
                {/* Ghana Boundary Region Cards Representation */}
                <div className="w-full h-full relative grid grid-cols-4 grid-rows-5 gap-2 p-2">
                  {GHANA_REGIONS_DATA.map((reg) => {
                    const isSelected =
                      selectedRegionFilter === 'ALL' || selectedRegionFilter === reg.region;
                    const bizInReg = businesses.filter((b) => b.region === reg.region);

                    return (
                      <div
                        key={reg.region}
                        onClick={() => onSelectRegionFilter(reg.region)}
                        onMouseEnter={() => setHoveredRegion(reg.region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={`relative rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                          isSelected
                            ? 'bg-white border-indigo-300 shadow-sm hover:border-indigo-500 hover:shadow-md'
                            : 'bg-slate-100/60 border-slate-200/80 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-[11px] text-slate-800 truncate">
                            {reg.region}
                          </span>
                          {bizInReg.length > 0 && (
                            <span className="bg-indigo-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                              {bizInReg.length}
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 font-medium">{reg.capital}</div>

                        {/* Digital Maturity Layer */}
                        {mapMode === 'density' && (
                          <div className="text-[9px] font-mono text-emerald-700 font-bold mt-1">
                            Maturity {reg.digitalMaturityScore}%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Region Hover Info Banner */}
          <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-600 font-medium">
                {hoveredRegion
                  ? `Hovering: ${hoveredRegion} - Capital: ${
                      GHANA_REGIONS_DATA.find((r) => r.region === hoveredRegion)?.capital
                    }`
                  : 'Click any region on the GIS grid to filter business pins'}
              </span>
            </div>

            {selectedRegionFilter !== 'ALL' && (
              <button
                onClick={() => onSelectRegionFilter('ALL')}
                className="text-indigo-600 hover:underline text-xs font-bold"
              >
                Reset to All Regions
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Regional Businesses List & Instant Pin Scorecard */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Regional Business Listings</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">{filteredMapBusinesses.length} found</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredMapBusinesses.map((biz) => {
                const isSelectedPin = activePin?.id === biz.id;
                return (
                  <div
                    key={biz.id}
                    onClick={() => {
                      setActivePin(biz);
                      onSelectBusiness(biz);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelectedPin
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 hover:text-indigo-600 transition-colors">
                          {biz.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                          <span>{biz.city}</span>
                          <span>•</span>
                          <span>{biz.category}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          biz.healthScore.overallScore >= 60
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : biz.healthScore.overallScore >= 35
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        Score {biz.healthScore.overallScore}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                      <span className="text-emerald-700 font-bold">
                        GHS {biz.recommendedServices[0]?.setupFeeGHS.toLocaleString()}
                      </span>
                      <span className="text-indigo-600 hover:underline flex items-center gap-1 font-bold">
                        <span>Deep Audit</span>
                        <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

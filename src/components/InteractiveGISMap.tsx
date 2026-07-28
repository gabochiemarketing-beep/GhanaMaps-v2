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
} from 'lucide-react';
import { BusinessRecord, GhanaRegion } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

interface InteractiveGISMapProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
  selectedRegionFilter: GhanaRegion | 'ALL';
  onSelectRegionFilter: (region: GhanaRegion | 'ALL') => void;
}

export const InteractiveGISMap: React.FC<InteractiveGISMapProps> = ({
  businesses,
  onSelectBusiness,
  selectedRegionFilter,
  onSelectRegionFilter,
}) => {
  const [mapMode, setMapMode] = useState<'pins' | 'heatmap' | 'density'>('pins');
  const [hoveredRegion, setHoveredRegion] = useState<GhanaRegion | null>(null);
  const [activePin, setActivePin] = useState<BusinessRecord | null>(null);

  // Filter businesses by active region
  const filteredMapBusinesses =
    selectedRegionFilter === 'ALL'
      ? businesses
      : businesses.filter((b) => b.region === selectedRegionFilter);

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

          {/* Interactive Custom SVG Vector Map of Ghana */}
          <div className="relative z-10 my-4 flex items-center justify-center">
            <div className="relative w-full max-w-lg h-[440px] bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center">
              {/* Ghana Boundary Region Cards Representation */}
              <div className="w-full h-full relative grid grid-cols-4 grid-rows-5 gap-2 p-2">
                {GHANA_REGIONS_DATA.map((reg, index) => {
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
                      } ${mapMode === 'heatmap' ? 'border-amber-300' : ''}`}
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

                      {/* Heatmap / Density Bar */}
                      {mapMode === 'heatmap' && (
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (bizInReg.length / 5) * 100)}%` }}
                          ></div>
                        </div>
                      )}

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

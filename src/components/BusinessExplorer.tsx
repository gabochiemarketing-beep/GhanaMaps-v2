import React, { useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  Globe,
  Phone,
  AlertTriangle,
  Zap,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Eye,
  Bot,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BusinessRecord, GhanaRegion, BusinessCategory } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

interface BusinessExplorerProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
  selectedRegion: GhanaRegion | 'ALL';
  setSelectedRegion: (r: GhanaRegion | 'ALL') => void;
  selectedCategory: BusinessCategory | 'ALL';
  setSelectedCategory: (c: BusinessCategory | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRunAgentForBusiness: (biz: BusinessRecord) => void;
}

export const BusinessExplorer: React.FC<BusinessExplorerProps> = ({
  businesses,
  onSelectBusiness,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onRunAgentForBusiness,
}) => {
  const [noWebsiteOnly, setNoWebsiteOnly] = useState(false);
  const [urgencyOnly, setUrgencyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'urgency' | 'health_asc' | 'health_desc' | 'revenue_desc'>(
    'urgency'
  );

  // Categories List
  const CATEGORIES: BusinessCategory[] = [
    'Real Estate & Properties',
    'Hospitals & Clinics',
    'Mechanics & Auto Garages',
    'Architects & Design',
    'Hotels & Hospitality',
    'Transport & Logistics',
    'Schools & Universities',
    'Churches & Religious Orgs',
    'Lawyers & Legal Services',
    'Supermarkets & Wholesalers',
    'Beauty Salons & Spas',
    'Pharmacies & Medical',
    'Furniture & Woodwork',
    'Financial & Insurance',
    'Manufacturing & Factories',
  ];

  // Filtering Logic
  let filtered = [...businesses];

  if (selectedRegion !== 'ALL') {
    filtered = filtered.filter((b) => b.region === selectedRegion);
  }

  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter((b) => b.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }

  if (noWebsiteOnly) {
    filtered = filtered.filter((b) => !b.hasWebsite || !b.website);
  }

  if (urgencyOnly) {
    filtered = filtered.filter((b) => (b.recommendedServices[0]?.urgencyScore || 0) >= 88);
  }

  // Sorting Logic
  if (sortBy === 'urgency') {
    filtered.sort(
      (a, b) =>
        (b.recommendedServices[0]?.urgencyScore || 0) -
        (a.recommendedServices[0]?.urgencyScore || 0)
    );
  } else if (sortBy === 'health_asc') {
    filtered.sort((a, b) => a.healthScore.overallScore - b.healthScore.overallScore);
  } else if (sortBy === 'health_desc') {
    filtered.sort((a, b) => b.healthScore.overallScore - a.healthScore.overallScore);
  } else if (sortBy === 'revenue_desc') {
    filtered.sort(
      (a, b) =>
        (b.recommendedServices[0]?.setupFeeGHS || 0) - (a.recommendedServices[0]?.setupFeeGHS || 0)
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Ghanaian Business Explorer</h2>
              <p className="text-xs text-slate-500">
                Search, filter, & deep audit commercial targets in Ghana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-indigo-600 font-mono text-sm">{filtered.length}</span>{' '}
            Businesses Match Filters
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Region Filter */}
          <div>
            <label className="block text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">
              Filter Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as GhanaRegion | 'ALL')}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="ALL">📍 All 16 Regions</option>
              {GHANA_REGIONS_DATA.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region} ({r.capital})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">
              Filter Industry
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as BusinessCategory | 'ALL')}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="ALL">🏢 All Industries</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="urgency">⚡ Highest Urgency First</option>
              <option value="revenue_desc">💰 Highest Setup Fee (GHS)</option>
              <option value="health_asc">⚠️ Lowest Digital Health Score</option>
              <option value="health_desc">🌟 Highest Health Score</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-3 self-end pb-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={noWebsiteOnly}
                onChange={(e) => setNoWebsiteOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>No Website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={urgencyOnly}
                onChange={(e) => setUrgencyOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-emerald-700 font-bold">Hot Deals</span>
            </label>
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((biz) => {
          const topOffer = biz.recommendedServices[0];
          const primaryGap = biz.detectedGaps[0];

          return (
            <div
              key={biz.id}
              className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                      {biz.region}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mt-1.5">
                      {biz.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>
                        {biz.city}, {biz.district}
                      </span>
                    </p>
                  </div>

                  {/* Health Badge */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        biz.healthScore.overallScore >= 60
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : biz.healthScore.overallScore >= 35
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {biz.healthScore.overallScore}/100
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium mt-0.5">Health Score</span>
                  </div>
                </div>

                {/* Rating & Web Status Pills */}
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    ★ {biz.rating} <span className="text-slate-400 font-normal">({biz.reviewCount} reviews)</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  {biz.hasWebsite && biz.website ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                      <Globe className="w-3 h-3" /> Website Active
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3 h-3" /> No Website
                    </span>
                  )}
                </div>

                {/* Primary Gap Alert Box */}
                {primaryGap && (
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{primaryGap.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {primaryGap.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Pitch & Financial Value Block */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Top Service Offer:</span>
                  <span className="font-bold text-indigo-600">{topOffer?.serviceName}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Setup Contract</div>
                    <div className="font-bold text-sm text-emerald-600">
                      GHS {topOffer?.setupFeeGHS.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Retainer</div>
                    <div className="font-bold text-xs text-indigo-600">
                      GHS {topOffer?.monthlyRetainerGHS}/mo
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onSelectBusiness(biz)}
                    className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-2 rounded-xl text-xs transition-all shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Deep AI Audit</span>
                  </button>

                  <button
                    onClick={() => onRunAgentForBusiness(biz)}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold py-2 rounded-xl text-xs transition-all shadow-2xs"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Run AI Agent</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

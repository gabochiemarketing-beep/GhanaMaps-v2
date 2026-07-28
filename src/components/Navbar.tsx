import React from 'react';
import {
  MapPin,
  Search,
  Zap,
  BarChart3,
  Layers,
  Bot,
  Sparkles,
  Building2,
  FileText,
  PlusCircle,
  Globe,
  Users,
} from 'lucide-react';
import { GhanaRegion, BusinessCategory } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegion: GhanaRegion | 'ALL';
  setSelectedRegion: (region: GhanaRegion | 'ALL') => void;
  selectedCategory: BusinessCategory | 'ALL';
  setSelectedCategory: (cat: BusinessCategory | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenDiscoverModal: () => void;
  onOpenExportModal: () => void;
  totalBusinesses: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenDiscoverModal,
  onOpenExportModal,
  totalBusinesses,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Banner / System Status */}
      <div className="bg-emerald-50/80 px-4 py-1.5 border-b border-emerald-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            mkt.gabochie.com
          </div>
          <span className="text-emerald-300">|</span>
          <span className="text-emerald-700 font-medium hidden sm:inline">
            Gabochie Marketing GIS & Maps BI SaaS Platform 🇬🇭
          </span>
        </div>
        <div className="flex items-center gap-4 text-emerald-700 font-medium">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-800">{totalBusinesses}</span> Businesses Tracked
          </div>
          <span className="text-emerald-300">|</span>
          <div className="flex items-center gap-1 text-emerald-800 font-semibold">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            18 AI Agents Active
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-200/60 relative group">
            <MapPin className="w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                Gabochie <span className="text-emerald-600 font-black">MKT</span>
              </h1>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-700" />
                mkt.gabochie.com
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              GIS Maps Intelligence & Membership SaaS Engine
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ghanaian businesses, cities (Accra, Kumasi...), categories..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs"
            />
          </div>

          {/* Region Selector Filter */}
          <div className="relative min-w-[140px] hidden sm:block">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as GhanaRegion | 'ALL')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer font-medium"
            >
              <option value="ALL">📍 All 16 Regions</option>
              {GHANA_REGIONS_DATA.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region}
                </option>
              ))}
            </select>
          </div>

          {/* Action CTAs */}
          <button
            onClick={onOpenDiscoverModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-sm shadow-emerald-200/60 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Discover Opportunities</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-t border-slate-200 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 text-xs">
          <button
            onClick={() => setActiveTab('public_landing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'public_landing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Landing Page</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('gis_map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'gis_map'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Interactive GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'explorer'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Business Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('founder_mode')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'founder_mode'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-emerald-800 bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span>AI Founder Mode</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
              HOT
            </span>
          </button>

          <button
            onClick={() => setActiveTab('microsaas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'microsaas'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Micro SaaS Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'agents'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>18 AI Agents Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Market Gaps Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'leads'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Prospect Leads Inbox</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export PDF/CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

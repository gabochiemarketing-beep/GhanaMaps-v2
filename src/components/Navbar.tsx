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
      <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GHANAMAPS BI v1.0
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            Enterprise Agentic Google Maps Intelligence Platform for Ghana 🇬🇭
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-slate-800">{totalBusinesses}</span> Businesses Tracked
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
            <Bot className="w-3.5 h-3.5" />
            18 AI Agents Active
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                GhanaMaps <span className="text-indigo-600 font-bold">BI</span>
              </h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                GHANA 16 REGIONS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous Opportunity Discovery & Micro SaaS Intelligence
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
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-sm whitespace-nowrap"
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
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Landing Page</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('gis_map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'gis_map'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Interactive GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'explorer'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Business Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('founder_mode')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'founder_mode'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>AI Founder Mode</span>
            <span className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
              HOT
            </span>
          </button>

          <button
            onClick={() => setActiveTab('microsaas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'microsaas'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Micro SaaS Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'agents'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>18 AI Agents Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Market Gaps Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'leads'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Prospect Leads Inbox</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export PDF/CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

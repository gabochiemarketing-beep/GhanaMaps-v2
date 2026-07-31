import React, { useState, useEffect, useRef } from 'react';
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
  Sun,
  Moon,
  RefreshCw,
  Clock,
  X,
  History,
  Trash2,
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
  onOpenWPSetupModal: () => void;
  totalBusinesses: number;
  isSyncing?: boolean;
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
  onOpenWPSetupModal,
  totalBusinesses,
  isSyncing = false,
}) => {
  const isPublicMode = activeTab === 'public_landing';

  // Theme Toggle State with localStorage persistence & HTML data-theme attribute
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Recent Searches state with localStorage persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gabochie_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 5);
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
    return ['Accra', 'Kumasi', 'Pharmacy', 'Tech Startup', 'Cape Coast'];
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('gabochie_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent searches:', e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, queryToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((q) => q !== queryToRemove);
      try {
        localStorage.setItem('gabochie_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update recent searches:', e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('gabochie_recent_searches');
  };

  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
    saveSearchQuery(query);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveSearchQuery(searchQuery);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Banner / Mode Indicator */}
      <div className={`px-4 py-1.5 border-b text-xs flex flex-wrap items-center justify-between gap-2 transition-colors ${
        isPublicMode 
          ? 'bg-emerald-50/90 border-emerald-200/80' 
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {isPublicMode ? (
              <span className="text-emerald-900 font-extrabold">mkt.gabochie.com • PUBLIC MEMBERSHIP SAAS</span>
            ) : (
              <span className="text-emerald-400 font-extrabold">🔒 BI ADMIN CONSOLE • mkt.gabochie.com</span>
            )}
          </div>
          {isSyncing && (
            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin text-indigo-300" />
              <span>Syncing...</span>
            </span>
          )}
          <span className="opacity-30">|</span>
          <span className={`font-medium hidden sm:inline ${isPublicMode ? 'text-emerald-800' : 'text-slate-300'}`}>
            Ghana Maps GIS Intelligence & Membership Platform
          </span>
        </div>

        <div className="flex items-center gap-3 font-medium text-[11px]">
          <button
            onClick={onOpenWPSetupModal}
            className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
              isPublicMode
                ? 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-800 text-emerald-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>🔌 LocalWP / WP Integration Guide</span>
          </button>

          {isPublicMode ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-lg transition-all shadow-xs"
            >
              🔒 Staff Login / BI Console
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('public_landing')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-extrabold px-3 py-1 rounded-lg transition-all"
            >
              🌐 View Public Website
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('public_landing')}>
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
              {isSyncing && (
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                  <span>Syncing...</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              GIS Maps Intelligence & Membership SaaS Engine
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl w-full flex items-center gap-2">
          <div ref={searchContainerRef} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Ghanaian businesses, cities (Accra, Kumasi...), categories..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Recent Searches Dropdown Menu */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <History className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Searches</span>
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllRecentSearches}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  <div className="space-y-1">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        onClick={() => handleSelectRecentSearch(item)}
                        className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          <span>{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, item)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          title="Remove from history"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-slate-400 text-xs italic">
                    No recent searches yet. Type and press Enter.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Region Selector Filter */}
          <div className="relative min-w-[140px] hidden sm:block">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as GhanaRegion | 'ALL')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer font-medium"
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
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenDiscoverModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-sm shadow-emerald-200/60 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Discover Opportunities</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar: Differentiated for Public vs Admin */}
      <div className="bg-white border-t border-slate-200 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 text-xs">
          {/* Public Landing Button */}
          <button
            onClick={() => setActiveTab('public_landing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'public_landing'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Membership Site</span>
          </button>

          {/* BI Admin Navigation Tabs */}
          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

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

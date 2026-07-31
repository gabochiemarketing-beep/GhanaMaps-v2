/**
 * Enterprise Agentic Google Maps Intelligence Platform for Ghana
 * Main Application Shell & State Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { PublicLandingPage } from './components/PublicLandingPage';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { InteractiveGISMap } from './components/InteractiveGISMap';
import { BusinessExplorer } from './components/BusinessExplorer';
import { AIFounderMode } from './components/AIFounderMode';
import { MicroSaaSStudio } from './components/MicroSaaSStudio';
import { AgentsOrchestratorView } from './components/AgentsOrchestratorView';
import { MarketGapsAnalytics } from './components/MarketGapsAnalytics';
import { LeadsManagerView } from './components/LeadsManagerView';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { ExportReportsModal } from './components/ExportReportsModal';
import { DiscoverModal } from './components/DiscoverModal';
import { WordPressSetupModal } from './components/WordPressSetupModal';
import { Footer } from './components/Footer';
import { INITIAL_GHANA_BUSINESSES } from './data/mockBusinessesGhana';
import { BusinessRecord, GhanaRegion, BusinessCategory } from './types';

export default function App() {
  const [params] = useState(() => new URLSearchParams(window.location.search));
  
  // Parse and normalize tab aliases from URL query or window hash
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabParam = params.get('tab');
    const hashParam = window.location.hash ? window.location.hash.replace('#', '') : null;
    const rawTab = tabParam || hashParam || 'public_landing';

    const aliasMap: Record<string, string> = {
      map_explorer: 'gis_map',
      gis_map: 'gis_map',
      directory: 'explorer',
      explorer: 'explorer',
      lead_hunter: 'founder_mode',
      founder_mode: 'founder_mode',
      membership: 'microsaas',
      microsaas: 'microsaas',
      analytics: 'analytics',
      leads: 'leads',
      agents: 'agents',
      dashboard: 'dashboard',
      public_landing: 'public_landing',
    };

    return aliasMap[rawTab] || rawTab || 'public_landing';
  });

  const isEmbedded = params.get('embed') === 'true';
  const shouldHideFooter = params.get('hide_footer') === 'true' || (isEmbedded && params.get('hide_footer') !== 'false');
  const shouldHideNav = params.get('hide_nav') === 'true';

  const [businesses, setBusinesses] = useState<BusinessRecord[]>(INITIAL_GHANA_BUSINESSES);
  const [selectedRegion, setSelectedRegion] = useState<GhanaRegion | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState<boolean>(false);
  const [isWPSetupModalOpen, setIsWPSetupModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fetch businesses from backend API
  const fetchBusinesses = async () => {
    setIsSyncing(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedRegion !== 'ALL') queryParams.append('region', selectedRegion);
      if (selectedCategory !== 'ALL') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('query', searchQuery);

      const res = await fetch(`/api/businesses?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBusinesses(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch businesses from server:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedRegion, selectedCategory]);

  const handleRunAgentForBusiness = (biz: BusinessRecord) => {
    setSelectedBusiness(biz);
    setActiveTab('agents');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        {!shouldHideNav && (
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenDiscoverModal={() => setIsDiscoverModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenWPSetupModal={() => setIsWPSetupModalOpen(true)}
            totalBusinesses={businesses.length}
            isSyncing={isSyncing}
          />
        )}

        {/* Main Container Viewport */}
        <main className={`max-w-7xl mx-auto px-4 ${shouldHideNav ? 'pt-2' : 'pt-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'public_landing' && (
                <PublicLandingPage
                  sampleBusinesses={businesses}
                  onOpenAdminDashboard={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'dashboard' && (
                <ExecutiveDashboard
                  businesses={businesses}
                  onNavigateTab={setActiveTab}
                  onSelectBusiness={(biz) => setSelectedBusiness(biz)}
                />
              )}

              {activeTab === 'gis_map' && (
                <InteractiveGISMap
                  businesses={businesses}
                  onSelectBusiness={(biz) => setSelectedBusiness(biz)}
                  selectedRegionFilter={selectedRegion}
                  onSelectRegionFilter={setSelectedRegion}
                />
              )}

              {activeTab === 'explorer' && (
                <BusinessExplorer
                  businesses={businesses}
                  onSelectBusiness={(biz) => setSelectedBusiness(biz)}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onRunAgentForBusiness={handleRunAgentForBusiness}
                />
              )}

              {activeTab === 'founder_mode' && (
                <AIFounderMode
                  businesses={businesses}
                  onSelectBusiness={(biz) => setSelectedBusiness(biz)}
                  onRunAgent={handleRunAgentForBusiness}
                />
              )}

              {activeTab === 'microsaas' && <MicroSaaSStudio />}

              {activeTab === 'agents' && <AgentsOrchestratorView businesses={businesses} />}

              {activeTab === 'analytics' && <MarketGapsAnalytics />}

              {activeTab === 'leads' && <LeadsManagerView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Footer */}
      {!shouldHideFooter && <Footer onNavigateTab={setActiveTab} />}

      {/* Modals */}
      <BusinessDetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onRunAgent={handleRunAgentForBusiness}
      />

      <ExportReportsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        businesses={businesses}
        onImportBusinesses={(importedRecords) => {
          setBusinesses((prev) => [...importedRecords, ...prev]);
        }}
      />

      <DiscoverModal
        isOpen={isDiscoverModalOpen}
        onClose={() => setIsDiscoverModalOpen(false)}
        onBusinessDiscovered={fetchBusinesses}
      />

      <WordPressSetupModal
        isOpen={isWPSetupModalOpen}
        onClose={() => setIsWPSetupModalOpen(false)}
      />
    </div>
  );
}

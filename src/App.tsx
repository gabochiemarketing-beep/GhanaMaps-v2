/**
 * Enterprise Agentic Google Maps Intelligence Platform for Ghana
 * Main Application Shell & State Orchestrator
 */

import React, { useState, useEffect } from 'react';
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
import { INITIAL_GHANA_BUSINESSES } from './data/mockBusinessesGhana';
import { BusinessRecord, GhanaRegion, BusinessCategory } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('public_landing');
  const [businesses, setBusinesses] = useState<BusinessRecord[]>(INITIAL_GHANA_BUSINESSES);
  const [selectedRegion, setSelectedRegion] = useState<GhanaRegion | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState<boolean>(false);

  // Fetch businesses from backend API
  const fetchBusinesses = async () => {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
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
        totalBusinesses={businesses.length}
      />

      {/* Main Container Viewport */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
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
      </main>

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
      />

      <DiscoverModal
        isOpen={isDiscoverModalOpen}
        onClose={() => setIsDiscoverModalOpen(false)}
        onBusinessDiscovered={fetchBusinesses}
      />
    </div>
  );
}

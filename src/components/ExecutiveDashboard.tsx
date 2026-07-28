import React from 'react';
import {
  TrendingUp,
  Building2,
  AlertTriangle,
  Zap,
  Globe2,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Send,
} from 'lucide-react';
import { BusinessRecord } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

interface ExecutiveDashboardProps {
  businesses: BusinessRecord[];
  onNavigateTab: (tab: string) => void;
  onSelectBusiness: (biz: BusinessRecord) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  businesses,
  onNavigateTab,
  onSelectBusiness,
}) => {
  // Metric Calculations
  const totalTracked = businesses.length;
  const noWebsiteCount = businesses.filter((b) => !b.hasWebsite || !b.website).length;
  const noWebsitePercentage = Math.round((noWebsiteCount / Math.max(1, totalTracked)) * 100);

  const totalServicePipelineGHS = businesses.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.setupFeeGHS || 10000),
    0
  );
  const totalServicePipelineUSD = Math.round(totalServicePipelineGHS / 15.2); // GHS to USD approx rate

  const totalMonthlyRetainerGHS = businesses.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.monthlyRetainerGHS || 1500),
    0
  );

  const avgHealthScore = Math.round(
    businesses.reduce((acc, b) => acc + b.healthScore.overallScore, 0) / Math.max(1, totalTracked)
  );

  const highUrgencyDeals = businesses.filter(
    (b) => (b.recommendedServices[0]?.urgencyScore || 0) >= 88
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Mission Banner */}
      <div className="relative overflow-hidden bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>GHANA BUSINESS OPPORTUNITY DISCOVERY ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ghana Maps Intelligence & Autonomous Opportunity Radar
            </h2>
            <p className="text-sm text-indigo-100/90 leading-relaxed font-normal">
              Continuously auditing commercial businesses across all 16 regions of Ghana. Automatically identifying software gaps, high-converting digital service offers, and lucrative Micro SaaS opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('founder_mode')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-md text-sm transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Launch AI Founder Mode</span>
            </button>
            <button
              onClick={() => onNavigateTab('gis_map')}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-indigo-900 font-bold px-4 py-3 rounded-xl border border-indigo-200 text-sm transition-all shadow-sm"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Open GIS Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tracked Businesses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Tracked Businesses
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalTracked}</span>
            <span className="text-xs text-emerald-600 font-bold">16 Regions Covered</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Across Accra, Kumasi, Takoradi, Tamale, Sunyani & all 16 hubs.
          </p>
        </div>

        {/* Metric 2: Underserved Gap Ratio */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Automation Gap Ratio
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{noWebsitePercentage}%</span>
            <span className="text-xs text-slate-500 font-medium">{noWebsiteCount} Missing Website</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Businesses relying purely on phone calls without online lead capture.
          </p>
        </div>

        {/* Metric 3: Digital Service Pipeline Value */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Service Setup Pipeline
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              GHS {(totalServicePipelineGHS / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-500 font-medium">~${totalServicePipelineUSD.toLocaleString()} USD</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Immediate setup service contracts available to close in Ghana.
          </p>
        </div>

        {/* Metric 4: Monthly Recurring Retainer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Monthly Retainer Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-700">
              GHS {(totalMonthlyRetainerGHS / 1000).toFixed(1)}k /mo
            </span>
            <span className="text-xs text-emerald-600 font-bold">High LTV</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Maintenance, hosting, & AI chatbot retainer potential.
          </p>
        </div>
      </div>

      {/* Middle Grid: Top Deals Ready To Close & Regional Density */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Top High-ROI Deals */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Top High-ROI Opportunities (Immediate Close)
                </h3>
                <p className="text-xs text-slate-500">
                  Businesses in Ghana with severe digital gaps & high willingness to pay
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('founder_mode')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {highUrgencyDeals.slice(0, 4).map((biz) => {
              const topOffer = biz.recommendedServices[0];
              const topGap = biz.detectedGaps[0];
              return (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="group bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {biz.name}
                      </span>
                      <span className="bg-white text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        {biz.region}
                      </span>
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Score {biz.healthScore.overallScore}/100
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {biz.city}
                      </span>
                      <span>•</span>
                      <span className="text-slate-700 font-medium">{biz.category}</span>
                    </div>

                    {topGap && (
                      <div className="text-xs text-amber-800 flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 rounded-md px-2.5 py-1 w-fit font-medium">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{topGap.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Pitch Tag */}
                  <div className="text-right sm:self-center shrink-0 space-y-1">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Recommended Pitch</div>
                    <div className="font-bold text-sm text-emerald-600">
                      GHS {topOffer?.setupFeeGHS.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-indigo-600 font-semibold">
                      + GHS {topOffer?.monthlyRetainerGHS}/mo retainer
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 Col wide): Regional Maturity Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">Regional Maturity</h3>
            </div>
            <button
              onClick={() => onNavigateTab('gis_map')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Open Map
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Average digital sophistication score across Ghana's key economic zones:
          </p>

          <div className="space-y-3">
            {GHANA_REGIONS_DATA.slice(0, 5).map((reg) => (
              <div key={reg.region} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{reg.region} ({reg.capital})</span>
                  <span className="font-bold text-indigo-600">{reg.digitalMaturityScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${reg.digitalMaturityScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full text-center text-xs font-bold text-indigo-600 hover:underline"
            >
              View Full 16 Regions Breakdown →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Micro SaaS Discovery Highlights */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Micro SaaS Opportunities for Ghana</h3>
              <p className="text-xs text-slate-500">
                Highly profitable software products customized for Ghanaian industries
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('microsaas')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore SaaS Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">ClinicPulse Ghana</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                TAM: $3.5M USD
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Healthcare EHR & Patient Appointment Booking with MoMo lab fee billing.
            </p>
            <div className="text-[11px] text-indigo-600 font-semibold font-mono">
              Target: Private Clinics in Kumasi & Accra ($120/mo)
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">PropDesk Ghana</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                TAM: $1.8M USD
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Property & Land Broker Management with tenancy agreement generator.
            </p>
            <div className="text-[11px] text-indigo-600 font-semibold font-mono">
              Target: East Legon & Kumasi Estate Agents ($79/mo)
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">EduGhana ERP</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                TAM: $5.1M USD
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Private Basic School Fee Collection via MoMo & SMS report cards.
            </p>
            <div className="text-[11px] text-indigo-600 font-semibold font-mono">
              Target: 8,000+ Private Schools in Ghana ($89/mo)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

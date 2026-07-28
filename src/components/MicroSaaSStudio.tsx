import React from 'react';
import {
  Layers,
  Sparkles,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Code,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { MicroSaaSOpportunity } from '../types';

export const MicroSaaSStudio: React.FC = () => {
  const SAAS_PRODUCTS: MicroSaaSOpportunity[] = [
    {
      id: 'saas-01',
      productName: 'ClinicPulse Ghana',
      category: 'Healthcare EHR & Patient Portal',
      problemStatement:
        'Private clinics in Kumasi, Takoradi, and Accra spend millions in lost revenue due to paper medical folders, uncollected lab fees, and patient no-shows.',
      targetIndustryGhana: 'Private Hospitals, Dental Clinics & Diagnostic Labs',
      keyFeatures: [
        'Electronic Health Records (EHR)',
        'Ghana National Health Insurance (NHIS) Claim Prep',
        'MTN & Telecel MoMo Lab Fee Payment Gateway',
        'Automated Patient SMS Reminders',
      ],
      suggestedPricingUSDMonth: 120,
      suggestedPricingGHSMonth: 1800,
      estimatedGhanaTAMUSD: 3500000,
      competitionLevel: 'Low',
      buildTimeWeeks: 6,
      recurringLTVUSD: 4200,
      founderVerdict:
        'Unbelievable recurring revenue potential across private health clinics in Ghana. Clinics willingly pay monthly retainers for EHR + SMS reminders.',
    },
    {
      id: 'saas-02',
      productName: 'PropDesk Ghana',
      category: 'Property Management & Tenant Portal',
      problemStatement:
        'Ghanaian estate agencies struggle with rent tracking, tenancy agreement generation under Ghana Law, and land inspection scheduling.',
      targetIndustryGhana: 'Real Estate Brokers & Property Developers',
      keyFeatures: [
        'Automated MoMo & Bank Rent Collection',
        'Tenancy Agreement Generator (Ghana Law)',
        'Tenant WhatsApp Maintenance Desk',
        'Diaspora Investor Dashboard',
      ],
      suggestedPricingUSDMonth: 79,
      suggestedPricingGHSMonth: 1200,
      estimatedGhanaTAMUSD: 1800000,
      competitionLevel: 'Low',
      buildTimeWeeks: 4,
      recurringLTVUSD: 2800,
      founderVerdict:
        'High value proposition in East Legon, Airport Residential, Kumasi & Takoradi where brokers manage properties for diaspora investors.',
    },
    {
      id: 'saas-03',
      productName: 'GaragePro Ghana',
      category: 'Auto Workshop & Spare Parts Inventory',
      problemStatement:
        'Auto repair shops in Suame Magazine Kumasi and Abossey Okai Accra manage multi-thousand GHS repairs using paper exercise books.',
      targetIndustryGhana: 'Auto Mechanics, Body Shops & Heavy Garages',
      keyFeatures: [
        'Digital Mechanic Job Cards',
        'Spare Parts Inventory & Price Estimator',
        'Customer WhatsApp Progress Tracker',
        'MoMo Invoicing & Receipt Generator',
      ],
      suggestedPricingUSDMonth: 49,
      suggestedPricingGHSMonth: 750,
      estimatedGhanaTAMUSD: 2100000,
      competitionLevel: 'Low',
      buildTimeWeeks: 4,
      recurringLTVUSD: 2200,
      founderVerdict:
        'Huge untapped market in Kumasi Suame Magazine and Accra where thousands of workshops operate completely on paper.',
    },
    {
      id: 'saas-04',
      productName: 'EduGhana ERP',
      category: 'School Portal & Fee Collection',
      problemStatement:
        'Over 8,000 private basic schools in Ghana face administrative congestion every academic term collecting fees and issuing paper report cards.',
      targetIndustryGhana: 'Private Basic Schools, High Schools & Colleges',
      keyFeatures: [
        'Instant MoMo School Fee Payment Gateway',
        'Digital Terminal Student Report Generator',
        'Parent SMS Broadcast System',
        'Attendance & Admissions Tracker',
      ],
      suggestedPricingUSDMonth: 89,
      suggestedPricingGHSMonth: 1300,
      estimatedGhanaTAMUSD: 5100000,
      competitionLevel: 'Medium',
      buildTimeWeeks: 6,
      recurringLTVUSD: 3800,
      founderVerdict:
        'Massive recurring revenue market. Private schools pay per-term or monthly retainers for automated MoMo fee processing.',
    },
    {
      id: 'saas-05',
      productName: 'StayGhana PMS',
      category: 'Resort & Boutique Hotel Management',
      problemStatement:
        'Resorts in Aburi, Akosombo, Cape Coast, and Busua lose 18%+ in booking fees to foreign OTAs because direct web bookings lack MoMo checkout.',
      targetIndustryGhana: 'Boutique Hotels, Eco-Resorts & Guest Houses',
      keyFeatures: [
        'Direct Booking Web Widget with MoMo',
        'WhatsApp Guest Concierge & Room Service',
        'GRA Tax Invoicing Compliant',
        'Housekeeping & Mini-Bar Inventory Tracker',
      ],
      suggestedPricingUSDMonth: 149,
      suggestedPricingGHSMonth: 2200,
      estimatedGhanaTAMUSD: 4200000,
      competitionLevel: 'Low',
      buildTimeWeeks: 8,
      recurringLTVUSD: 5400,
      founderVerdict:
        'Lucrative SaaS product across Ghana tourism hot spots like Aburi, Akosombo, Cape Coast, and Elmina.',
    },
    {
      id: 'saas-06',
      productName: 'HaulGhana',
      category: 'Intercity Freight & Logistics Portal',
      problemStatement:
        'Agricultural haulage operators in Tamale, Techiman, and Wa manage waybills on paper, leaving shippers blind regarding truck locations.',
      targetIndustryGhana: 'Transport, Cargo & Agricultural Haulage',
      keyFeatures: [
        'Digital Waybill & Delivery Confirmation',
        'Truck Fuel & Driver Expense Logger',
        'SMS Cargo Status Updates for Shippers',
        'MoMo Freight Payment Link',
      ],
      suggestedPricingUSDMonth: 99,
      suggestedPricingGHSMonth: 1500,
      estimatedGhanaTAMUSD: 2900000,
      competitionLevel: 'Low',
      buildTimeWeeks: 6,
      recurringLTVUSD: 3600,
      founderVerdict:
        'Essential software connecting northern food production hubs with southern ports in Tema and Takoradi.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* SaaS Studio Banner */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>MICRO SAAS DISCOVERY ENGINE FOR GHANA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            High-Margin Software Products To Build Next
          </h2>
          <p className="text-sm text-indigo-100/90 font-normal">
            Validated B2B Micro SaaS opportunities designed specifically for local Ghanaian business workflows, Mobile Money billing, and WhatsApp operations.
          </p>
        </div>
      </div>

      {/* Grid of Micro SaaS Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAAS_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{prod.productName}</h3>
                  <div className="text-xs text-slate-500 font-medium">{prod.targetIndustryGhana}</div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  TAM ${(prod.estimatedGhanaTAMUSD / 1000000).toFixed(1)}M
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">{prod.problemStatement}</p>

              {/* Features List */}
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-bold text-slate-900">Key Built-in Capabilities:</div>
                {prod.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial & Verdict Footer */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Pricing</div>
                  <div className="font-bold text-emerald-600 font-mono">
                    GHS {prod.suggestedPricingGHSMonth}/mo
                  </div>
                  <div className="text-[9px] text-slate-400">~${prod.suggestedPricingUSDMonth} USD</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Est. Build Time</div>
                  <div className="font-bold text-slate-800">{prod.buildTimeWeeks} Weeks</div>
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-xl text-xs space-y-1">
                <div className="font-bold text-indigo-900">Founder Verdict:</div>
                <p className="text-slate-700 text-[11px] leading-snug">{prod.founderVerdict}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

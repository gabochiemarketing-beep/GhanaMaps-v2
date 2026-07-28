import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Flame,
  CheckCircle2,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Send,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { BusinessRecord } from '../types';

interface AIFounderModeProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
  onRunAgent: (biz: BusinessRecord) => void;
}

export const AIFounderMode: React.FC<AIFounderModeProps> = ({
  businesses,
  onSelectBusiness,
  onRunAgent,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter top deals
  const top10Deals = [...businesses]
    .sort(
      (a, b) =>
        (b.recommendedServices[0]?.urgencyScore || 0) -
        (a.recommendedServices[0]?.urgencyScore || 0)
    )
    .slice(0, 10);

  const totalImmediateSetupRevenueGHS = top10Deals.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.setupFeeGHS || 10000),
    0
  );

  const totalMonthlyRetainerGHS = top10Deals.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.monthlyRetainerGHS || 1500),
    0
  );

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* AI Founder Command Header */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>AI FOUNDER COMMAND CENTER (GHANA)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Top 10 High-ROI Opportunities To Approach Today
            </h2>
            <p className="text-sm text-indigo-100/90 font-normal">
              Filtered for fastest closing probability, maximum setup fees, & recurring monthly retainers across Accra, Kumasi, Takoradi & Tamale.
            </p>
          </div>

          {/* Revenue Potential Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-right space-y-1 shrink-0">
            <div className="text-xs text-indigo-200 font-medium">Top 10 Immediate Revenue</div>
            <div className="text-2xl font-black text-emerald-400">
              GHS {totalImmediateSetupRevenueGHS.toLocaleString()}
            </div>
            <div className="text-xs text-indigo-200 font-mono">
              + GHS {totalMonthlyRetainerGHS.toLocaleString()}/mo retainer
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 High-ROI Deals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Today's Priority Pipeline</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">10 Verified Deals Ready For Outreach</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {top10Deals.map((biz, idx) => {
            const offer = biz.recommendedServices[0];
            const gap = biz.detectedGaps[0];
            const whatsappText = biz.salesCollateral.coldWhatsApp;

            return (
              <div
                key={biz.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  {/* Business Title & Region */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <h4
                        onClick={() => onSelectBusiness(biz)}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {biz.name}
                      </h4>
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200">
                        {biz.region} ({biz.city})
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{biz.category} • {biz.description}</p>
                  </div>

                  {/* Financial Tag */}
                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Setup Fee</div>
                      <div className="font-extrabold text-sm text-emerald-600">
                        GHS {offer?.setupFeeGHS.toLocaleString()}
                      </div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Retainer</div>
                      <div className="font-bold text-xs text-indigo-600">
                        GHS {offer?.monthlyRetainerGHS}/mo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer & Quick Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pitch Angle */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-indigo-700">Recommended Pitch Offer:</span>
                    <p className="text-slate-800 font-medium">{offer?.serviceName}</p>
                    <p className="text-slate-500 text-[11px] italic">"{offer?.pitchAngle}"</p>
                  </div>

                  {/* WhatsApp Quick Copy */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Quick WhatsApp Pitch
                      </span>
                      <button
                        onClick={() => handleCopyText(whatsappText, biz.id)}
                        className="flex items-center gap-1 text-[11px] text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-bold shadow-2xs"
                      >
                        {copiedId === biz.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{copiedId === biz.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-700 text-[11px] truncate font-mono">{whatsappText}</p>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>High Probability Conversion Deal</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectBusiness(biz)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-200"
                    >
                      View Full Sales Kit
                    </button>
                    <button
                      onClick={() => onRunAgent(biz)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm"
                    >
                      Run AI Agent Analysis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Copy,
  Check,
  Send,
  Layers,
  FileText,
  Bot,
  MessageSquare,
  Sparkles,
  DollarSign,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { BusinessRecord } from '../types';

interface BusinessDetailModalProps {
  business: BusinessRecord | null;
  onClose: () => void;
  onRunAgent: (biz: BusinessRecord) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onRunAgent,
}) => {
  if (!business) return null;

  const [activeTab, setActiveTab] = useState<'audit' | 'gaps' | 'services' | 'saas' | 'sales_kit'>(
    'audit'
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const topOffer = business.recommendedServices[0];
  const saasIdea = business.microSaaSProduct;
  const sales = business.salesCollateral;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-0.5 rounded-md">
                {business.region} ({business.city})
              </span>
              <span className="text-slate-500 text-xs font-medium">{business.category}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">{business.name}</h2>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{business.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto text-xs py-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 AI Health Audit ({business.healthScore.overallScore}/100)
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'gaps'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚠️ Digital Gaps ({business.detectedGaps.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💼 Service Offers ({business.recommendedServices.length})
          </button>

          <button
            onClick={() => setActiveTab('saas')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'saas'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💡 Micro SaaS Idea
          </button>

          <button
            onClick={() => setActiveTab('sales_kit')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'sales_kit'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚀 Cold Outreach Sales Kit
          </button>
        </div>

        {/* Modal Body Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: AI HEALTH AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Health Score Summary Gauge Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold border ${
                      business.healthScore.overallScore >= 60
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : business.healthScore.overallScore >= 35
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    <span className="text-2xl">{business.healthScore.overallScore}</span>
                    <span className="text-[10px] text-slate-400 font-medium">out of 100</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Digital Health & Maturity Score
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md font-medium">
                      Calculated from website speed, SEO ranking, lead capture mechanisms, Google Maps positioning, and automation maturity in Ghana.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRunAgent(business)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>Run Live AI Agent Audit</span>
                </button>
              </div>

              {/* Sub-Metric Score Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Website Quality', score: business.healthScore.websiteQuality },
                  { label: 'SEO Ranking', score: business.healthScore.seoScore },
                  { label: 'Speed & Mobile', score: business.healthScore.speed },
                  { label: 'Lead Capture', score: business.healthScore.leadCapture },
                  { label: 'Maps Position', score: business.healthScore.mapsRanking },
                  { label: 'Automation Level', score: business.healthScore.automationLevel },
                  { label: 'Trust & Reviews', score: business.healthScore.trustSignals },
                  { label: 'Digital Maturity', score: business.healthScore.digitalMaturity },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[11px] text-slate-500 font-bold">{item.label}</div>
                    <div className="font-extrabold text-sm text-indigo-600">{item.score}/100</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL GAPS */}
          {activeTab === 'gaps' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Detected Operational & Revenue Gaps in Ghana
              </h3>

              <div className="space-y-3">
                {business.detectedGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                        {gap.title}
                      </span>
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {gap.severity} SEVERITY
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{gap.description}</p>

                    <div className="pt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-200">
                      <span>Estimated Revenue Leakage:</span>
                      <span className="font-mono font-bold text-red-600">
                        ~${gap.impactedRevenueUSDMonth.toLocaleString()} USD / month
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECOMMENDED SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Recommended Digital Services & Pitch Angle</h3>

              <div className="space-y-4">
                {business.recommendedServices.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-indigo-700">
                        {offer.serviceName}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Urgency Score {offer.urgencyScore}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200 font-medium">
                      "{offer.pitchAngle}"
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimated Setup Fee</div>
                        <div className="font-extrabold text-emerald-600 text-sm">
                          GHS {offer.setupFeeGHS.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monthly Retainer</div>
                        <div className="font-bold text-indigo-600 text-sm">
                          GHS {offer.monthlyRetainerGHS}/mo
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Build Time</div>
                        <div className="font-bold text-slate-800 text-sm">{offer.buildTimeDays} Days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MICRO SAAS IDEA */}
          {activeTab === 'saas' && saasIdea && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                      MICRO SAAS CONCEPT FOR GHANA
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900">{saasIdea.productName}</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold px-3 py-1 rounded-full">
                    TAM: ${(saasIdea.estimatedGhanaTAMUSD / 1000000).toFixed(1)}M USD
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium">{saasIdea.problemStatement}</p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900">Key Platform Features:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {saasIdea.keyFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-xs space-y-1">
                  <span className="font-bold text-indigo-900">Founder Verdict:</span>
                  <p className="text-slate-700 leading-snug">{saasIdea.founderVerdict}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SALES OUTREACH KIT */}
          {activeTab === 'sales_kit' && sales && (
            <div className="space-y-5">
              {/* Cold WhatsApp Message */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Cold WhatsApp Script
                  </span>
                  <button
                    onClick={() => handleCopy(sales.coldWhatsApp, 'whatsapp')}
                    className="flex items-center gap-1 text-xs text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-bold shadow-2xs"
                  >
                    {copiedField === 'whatsapp' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copiedField === 'whatsapp' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200 font-mono">
                  {sales.coldWhatsApp}
                </p>
              </div>

              {/* Cold Email Copy */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> Cold Email Pitch
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Subject: ${sales.coldEmail.subject}\n\n${sales.coldEmail.body}`,
                        'email'
                      )
                    }
                    className="flex items-center gap-1 text-xs text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-bold shadow-2xs"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copiedField === 'email' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
                  <div className="font-bold text-slate-900">Subject: {sales.coldEmail.subject}</div>
                  <div className="whitespace-pre-line text-slate-700">{sales.coldEmail.body}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

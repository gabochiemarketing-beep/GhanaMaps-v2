import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Bot,
  Globe,
  TrendingUp,
  CreditCard,
  DollarSign,
  Star,
  Users,
  FileText,
  ChevronRight,
  Check,
  HelpCircle
} from 'lucide-react';
import { BusinessRecord, GhanaRegion } from '../types';

interface PublicLandingPageProps {
  sampleBusinesses: BusinessRecord[];
  onOpenAdminDashboard: () => void;
  onLeadCaptured?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  sampleBusinesses,
  onOpenAdminDashboard,
  onLeadCaptured,
}) => {
  // Lead Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    region: 'Greater Accra' as GhanaRegion,
    interest: 'Founder Pro Package (GHS 1,299/mo)',
    businessName: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp) {
      setErrorMessage('Please fill in your name, email address, and WhatsApp contact number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        if (onLeadCaptured) onLeadCaptured();
      } else {
        setErrorMessage(json.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const sampleTeasers = sampleBusinesses.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>GHANA'S #1 MAPS BI & AI SALES ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Discover Underserved Businesses Across Ghana & Close{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                GHS 10,000+ Deals
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Google Maps intelligence for all 16 Ghanaian regions. Identify digital gaps, automate WhatsApp pitch scripts, and launch high-margin agency services or Micro SaaS products.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">16</div>
                <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Regions Benchmarked</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-indigo-400">18</div>
                <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Autonomous AI Agents</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">GHS 15k</div>
                <div className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Avg Deal Potential</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                <span>Get Instant Demo & Leads</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAdminDashboard}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Launch BI Admin Studio</span>
              </button>
            </div>
          </div>

          {/* Right Column: Lead Generation Card */}
          <div id="lead-form" className="lg:col-span-5">
            <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Request Platform Access</h3>
                  <p className="text-xs text-slate-500 font-medium">Get a custom lead list & intelligence report</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Instant Access
                </span>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Request Submitted!</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Our team will reach out to your WhatsApp (<span className="font-mono font-bold text-slate-800">{formData.whatsapp}</span>) with your sample dataset.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/233244000000?text=${encodeURIComponent(
                      `Hello GhanaMaps BI! I just submitted my request for ${formData.interest} in ${formData.region}. My email is ${formData.email}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs w-full transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat With Us On WhatsApp Now</span>
                  </a>

                  <button
                    onClick={onOpenAdminDashboard}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl text-xs border border-indigo-200 transition-all"
                  >
                    Open Live BI Platform Console
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="kwame@company.com.gh"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        WhatsApp Contact (+233) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="024 123 4567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Target Ghana Region
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value as GhanaRegion })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti (Kumasi)</option>
                        <option value="Western">Western (Takoradi)</option>
                        <option value="Northern">Northern (Tamale)</option>
                        <option value="Central">Central (Cape Coast)</option>
                        <option value="Eastern">Eastern (Koforidua)</option>
                        <option value="Volta">Volta (Ho)</option>
                        <option value="Bono">Bono (Sunyani)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Package Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Starter Agency Package (GHS 499/mo)">Starter Agency (GHS 499/mo)</option>
                        <option value="Founder Pro Package (GHS 1,299/mo)">Founder Pro (GHS 1,299/mo)</option>
                        <option value="Enterprise BI & Data (GHS 2,999/mo)">Enterprise BI (GHS 2,999/mo)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Agency or Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Suame Media Ventures"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 mt-2"
                  >
                    {submitting ? (
                      <span>Processing Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Get Instant Intelligence & Demo Access</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center pt-1 font-medium">
                    🔒 No credit card required. Instant sample dataset for Ghana.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE OPPORTUNITY RADAR TEASER */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Real Opportunity Preview</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Live Commercial Targets In Ghana
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Sample high-intent leads generated by our regional scanner in Accra, Kumasi, Takoradi & Tamale.
            </p>
          </div>

          <button
            onClick={onOpenAdminDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200 transition-all self-start md:self-auto"
          >
            <span>View All 16 Regions In BI Console</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleTeasers.map((biz) => {
            const offer = biz.recommendedServices[0];
            return (
              <div
                key={biz.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                      {biz.region}
                    </span>
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                      Score {biz.healthScore.overallScore}/100
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900">{biz.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{biz.city}, {biz.category}</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-amber-800 flex items-center gap-1">
                      <span>⚠️ Key Gap:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {biz.detectedGaps[0]?.title || 'Missing digital booking & automated lead capture.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Setup Fee</div>
                      <div className="font-extrabold text-sm text-emerald-600">
                        GHS {offer?.setupFeeGHS.toLocaleString() || '10,000'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Retainer</div>
                      <div className="font-bold text-xs text-indigo-600">
                        GHS {offer?.monthlyRetainerGHS || '1,500'}/mo
                      </div>
                    </div>
                  </div>

                  <a
                    href="#lead-form"
                    className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-2 rounded-xl text-xs transition-all"
                  >
                    <span>Unlock Sales Kit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING PACKAGES */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            Choose Your Growth Tier
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Flexible pricing in Ghanaian Cedi (GHS) with Mobile Money & Card payment options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Starter Agency */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter Tier</span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Starter Agency</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal for solo consultants and emerging agencies.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">GHS 499</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
                <span className="text-[11px] text-slate-400 font-normal"> (~$35/mo)</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Ghana Region Access (e.g. Greater Accra)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 100 Deep Business Audits / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated WhatsApp Cold Sales Scripts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CSV Lead Export</span>
                </li>
              </ul>
            </div>

            <a
              href="#lead-form"
              onClick={() => {
                setFormData((prev) => ({ ...prev, interest: 'Starter Agency Package (GHS 499/mo)' }));
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs border border-slate-200 transition-all"
            >
              <span>Get Starter Plan</span>
            </a>
          </div>

          {/* Tier 2: Founder Pro (Featured) */}
          <div className="bg-indigo-900 text-white border-2 border-indigo-600 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Most Popular In Ghana
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Growth Tier</span>
                <h3 className="font-extrabold text-xl text-white mt-1">Founder Pro</h3>
                <p className="text-xs text-indigo-100/90 mt-1">For agency owners & Micro SaaS builders.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">GHS 1,299</span>
                <span className="text-xs text-indigo-200 font-medium">/ month</span>
                <span className="text-[11px] text-indigo-300 font-normal"> (~$90/mo)</span>
              </div>

              <ul className="space-y-2.5 text-xs text-indigo-100 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 16 Ghanaian Regions Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Business Opportunity Audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>18 Specialized Autonomous AI Agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Micro SaaS Discovery Studio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Executive PDF Report Generator</span>
                </li>
              </ul>
            </div>

            <a
              href="#lead-form"
              onClick={() => {
                setFormData((prev) => ({ ...prev, interest: 'Founder Pro Package (GHS 1,299/mo)' }));
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs shadow-lg transition-all"
            >
              <span>Get Founder Pro Plan</span>
            </a>
          </div>

          {/* Tier 3: Enterprise BI */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprise Tier</span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Enterprise BI</h3>
                <p className="text-xs text-slate-500 mt-1">Custom data, API access, & white-label reports.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">GHS 2,999</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
                <span className="text-[11px] text-slate-400 font-normal"> (~$210/mo)</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Everything in Founder Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>REST API Access & Webhooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Regional Scraping On Demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mobile Money Billing Setup Support</span>
                </li>
              </ul>
            </div>

            <a
              href="#lead-form"
              onClick={() => {
                setFormData((prev) => ({ ...prev, interest: 'Enterprise BI & Data (GHS 2,999/mo)' }));
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all"
            >
              <span>Get Enterprise Plan</span>
            </a>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Accepted Local Payment Methods
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 font-semibold">
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
              📱 MTN Mobile Money
            </span>
            <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full border border-red-200">
              📱 Telecel / Vodafone Cash
            </span>
            <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
              📱 AirtelTigo Money
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
              💳 Paystack / Visa / MasterCard
            </span>
          </div>
        </div>
      </section>

      {/* WHY GHANA REGIONAL BI? (VALUE PROPOSITION) */}
      <section className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built Specifically For The Ghanaian Market
          </h2>
          <p className="text-sm text-slate-300 font-normal">
            Generic international software misses local context like MoMo payments, WhatsApp cold communications, and regional hubs like Suame Magazine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl w-fit">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">WhatsApp First Outreach</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              In Ghana, cold WhatsApp messages convert 5x better than email. Our AI generates pre-formatted WhatsApp scripts for every business lead.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">High-Margin Setup Fees</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Ghanaian clinics, schools, real estate brokers, and logistics firms are eager to pay GHS 5,000 to GHS 15,000 for basic digital setup & booking systems.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Micro SaaS Opportunities</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Discover niche B2B software ideas (e.g. Suame Workshop ERP, ClinicPulse) with localized Mobile Money subscription billing.
            </p>
          </div>
        </div>
      </section>

      {/* FAQS & HOSTING EXPLANATION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">
              How do I deploy this on my existing WordPress or Namecheap hosting?
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              This application compiles into a single-page app (`npm run build`). On Namecheap cPanel or WordPress, you can upload the build bundle to a subdirectory (e.g. `yourwebsite.com/app/`) or embed it seamlessly in WordPress using an `&lt;iframe&gt;` or custom HTML page template.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">
              Is this ready to generate leads right now?
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Yes! The lead capture mechanism, AI Agents (powered by Gemini 3.6 Flash), WhatsApp script generator, PDF/CSV report exports, and 16-region GIS map are 100% operational and plug-and-play.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">
              How do payment collections work in Ghana?
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              You can accept payments via MTN Mobile Money, Telecel Cash, or Paystack card payments. The lead form captures client details so you can send them direct MoMo payment links or automated invoices.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">
              Can I access the Admin Dashboard directly?
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Yes! Use the navigation bar at the top or click "Launch BI Admin Studio" to switch between the Public Landing Page and the full Business Intelligence Console.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

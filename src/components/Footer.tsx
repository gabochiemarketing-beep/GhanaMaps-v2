import React from 'react';
import { MapPin, Globe, Mail, Phone, ShieldCheck, Zap, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-emerald-900/60 mt-20 font-sans">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-800/50 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>mkt.gabochie.com • Ghana Membership SaaS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to automate business discovery across Ghana?
            </h3>
            <p className="text-xs text-slate-300">
              Join agency founders using Gabochie MKT GIS Platform to close GHS 10,000+ monthly deals.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-900/50 flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span>Access BI Admin Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
                Gabochie <span className="text-emerald-400">MKT</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">mkt.gabochie.com</div>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed font-normal pr-4">
            Ghana’s premiere Agentic Google Maps Intelligence Platform & Membership SaaS engine. Benchmark business opportunities across all 16 regions of Ghana and automate client outreach.
          </p>

          <div className="flex items-center gap-4 text-slate-400 font-medium pt-2">
            <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>mkt.gabochie.com</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>support@gabochie.com</span>
            </div>
          </div>
        </div>

        {/* Col 2: SaaS Platform Navigation */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
            Platform Modules
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => onNavigateTab('public_landing')}
                className="hover:text-emerald-300 transition-colors"
              >
                Public Membership Page
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('gis_map')}
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>Interactive GIS Map</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('explorer')}
                className="hover:text-emerald-300 transition-colors"
              >
                Business Opportunity Explorer
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('founder_mode')}
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>AI Founder Mode</span>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 rounded">HOT</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('microsaas')}
                className="hover:text-emerald-300 transition-colors"
              >
                Micro SaaS Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: BI & Admin Tools */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
            Admin & AI Engine
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="hover:text-emerald-300 transition-colors"
              >
                Executive BI Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('agents')}
                className="hover:text-emerald-300 transition-colors"
              >
                18 AI Agents Studio
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="hover:text-emerald-300 transition-colors"
              >
                Market Gaps Analytics
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('leads')}
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>Leads Manager (Auto-Move)</span>
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Regional Coverage */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
            Ghana 16 Regions
          </h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400">
            <span>• Greater Accra</span>
            <span>• Ashanti</span>
            <span>• Western</span>
            <span>• Northern</span>
            <span>• Central</span>
            <span>• Eastern</span>
            <span>• Volta</span>
            <span>• Bono</span>
            <span>• Upper East</span>
            <span>• Upper West</span>
            <span>• Oti</span>
            <span>• Ahafo</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">mkt.gabochie.com</strong> — Gabochie Marketing GIS Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              MoMo & LocalWP Ready
            </span>
            <span>Privacy Policy</span>
            <span>Terms of Membership</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

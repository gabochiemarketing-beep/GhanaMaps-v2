import React from 'react';
import {
  Sparkles,
  BarChart3,
  Globe2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Building2,
  Layers,
} from 'lucide-react';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

export const MarketGapsAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>GHANA REGIONAL DIGITAL MATURITY & MARKET GAPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            16 Regions Industry Gap & Automation Radar
          </h2>
          <p className="text-sm text-indigo-100/90 font-normal">
            Comprehensive benchmarking of commercial sectors, automation deficits, and high-yield service demand across Ghana's administrative regions.
          </p>
        </div>
      </div>

      {/* Regional Maturity Full Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            <span>Regional Digital Maturity Index</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">All 16 Ghana Regions Benchmarked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Capital</th>
                <th className="py-3 px-4">Key Industries</th>
                <th className="py-3 px-4">Digital Maturity</th>
                <th className="py-3 px-4">Top Digital Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GHANA_REGIONS_DATA.map((reg) => (
                <tr key={reg.region} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{reg.region}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{reg.capital}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-normal">
                    {reg.keyIndustries.slice(0, 3).join(', ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${reg.digitalMaturityScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-indigo-600">
                        {reg.digitalMaturityScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">
                    {reg.digitalMaturityScore < 35
                      ? 'Basic Website & MoMo Billing'
                      : reg.digitalMaturityScore < 50
                      ? 'WhatsApp Bot & Lead CRM'
                      : 'Enterprise EHR / ERP Systems'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

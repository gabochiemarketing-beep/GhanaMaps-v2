import React, { useState } from 'react';
import { X, Search, Sparkles, Building2, PlusCircle, RotateCw } from 'lucide-react';
import { GhanaRegion, BusinessCategory } from '../types';
import { GHANA_REGIONS_DATA } from '../data/ghanaRegionsAndCities';

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessDiscovered: () => void;
}

export const DiscoverModal: React.FC<DiscoverModalProps> = ({
  isOpen,
  onClose,
  onBusinessDiscovered,
}) => {
  if (!isOpen) return null;

  const [region, setRegion] = useState<GhanaRegion>('Greater Accra');
  const [city, setCity] = useState<string>('Accra');
  const [category, setCategory] = useState<BusinessCategory>('Real Estate & Properties');
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunDiscovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/discover-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          city,
          category,
          keywords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onBusinessDiscovered();
        onClose();
      }
    } catch (err) {
      console.error('Error running discovery search:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">AI Maps Opportunity Discovery</h3>
              <p className="text-xs text-slate-500 font-medium">Discover new commercial targets in Ghana</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRunDiscovery} className="space-y-4 text-xs">
          {/* Target Region */}
          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Target Ghana Region:</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as GhanaRegion)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            >
              {GHANA_REGIONS_DATA.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region} ({r.capital})
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">City or Town:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Accra, Kumasi, Takoradi, Tamale..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Industry Category */}
          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Target Industry:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            >
              <option value="Real Estate & Properties">Real Estate & Properties</option>
              <option value="Hospitals & Clinics">Hospitals & Clinics</option>
              <option value="Mechanics & Auto Garages">Mechanics & Auto Garages</option>
              <option value="Architects & Design">Architects & Design</option>
              <option value="Hotels & Hospitality">Hotels & Hospitality</option>
              <option value="Transport & Logistics">Transport & Logistics</option>
              <option value="Schools & Universities">Schools & Universities</option>
              <option value="Churches & Religious Orgs">Churches & Religious Orgs</option>
            </select>
          </div>

          {/* Extra Search Keywords */}
          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider">Specific Keywords (Optional):</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Suame Magazine mechanics, East Legon brokers..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Running Gemini AI Maps Search Agent...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Start AI Discovery Cycle</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

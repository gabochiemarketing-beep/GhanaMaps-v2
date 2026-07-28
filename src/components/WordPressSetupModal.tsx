import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Code, Layers, ShieldCheck, Download, Server } from 'lucide-react';

interface WordPressSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordPressSetupModal: React.FC<WordPressSetupModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'iframe' | 'plugin' | 'localwp'>('localwp');

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const iframeSnippet = `<iframe 
  src="http://localhost:3000" 
  width="100%" 
  height="900px" 
  style="border:none; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);"
  allow="geolocation; camera; microphone"
></iframe>`;

  const phpShortcodeSnippet = `<?php
/*
Plugin Name: Gabochie MKT GIS & Membership SaaS
Plugin URI: https://mkt.gabochie.com
Description: Integrates Gabochie MKT Maps BI & Lead Engine into LocalWP (http://localhost:10022).
Version: 1.0.0
Author: Gabochie Marketing
*/

// Shortcode for Frontend WordPress Pages at http://localhost:10022/
function gabochie_mkt_gis_shortcode($atts) {
    return '<iframe src="http://localhost:3000" width="100%" height="850px" style="border:none; border-radius:12px;"></iframe>';
}
add_shortcode('gabochie_gis', 'gabochie_mkt_gis_shortcode');

// Adds "Gabochie GIS BI" Menu Item inside LocalWP Admin Dashboard
function gabochie_mkt_add_admin_menu() {
    add_menu_page(
        'Gabochie GIS BI',
        'Gabochie GIS BI',
        'manage_options',
        'gabochie-gis-bi',
        'gabochie_mkt_admin_page_render',
        'dashicons-location-alt',
        3
    );
}
add_action('admin_menu', 'gabochie_mkt_add_admin_menu');

function gabochie_mkt_admin_page_render() {
    echo '<div style="margin:20px 20px 0 0;"><iframe src="http://localhost:3000" width="100%" height="900px" style="border:none; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1);"></iframe></div>';
}
`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-fadeIn my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black px-3 py-1 rounded-full">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span>LocalWP & WordPress Integration Guide</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            How to Separate Frontend & WP Admin for mkt.gabochie.com
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Deploy on LocalWP on your desktop first, sync with GitHub, and integrate into WordPress.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('localwp')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 ${
              activeTab === 'localwp'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. LocalWP Desktop Setup
          </button>
          <button
            onClick={() => setActiveTab('plugin')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 ${
              activeTab === 'plugin'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. WP Plugin Route (Separation)
          </button>
          <button
            onClick={() => setActiveTab('iframe')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 ${
              activeTab === 'iframe'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Frontend Shortcode & iFrame
          </button>
        </div>

        {/* Tab 1: LocalWP Setup */}
        {activeTab === 'localwp' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-emerald-700" />
                LocalWP & Twenty Twenty-Five Activation Steps
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-emerald-850 font-medium">
                <li>
                  <strong>Activate Plugin in WP Admin:</strong> Go to <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">http://localhost:10022/wp-admin/plugins.php</code> and click <strong>Activate</strong> next to <em>"Gabochie MKT GIS & Membership SaaS"</em>. (Without activating, WordPress shows <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">[gabochie_gis]</code> as plain text).
                </li>
                <li>
                  <strong>Twenty Twenty-Five Theme Block Editor:</strong> Go to <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">http://localhost:10022/wp-admin/site-editor.php</code> or edit your home page. Add a <strong>Shortcode Block</strong> or <strong>Custom HTML Block</strong> and paste <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">[gabochie_gis]</code>.
                </li>
                <li>
                  <strong>App Server Active:</strong> Keep <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">npm run dev</code> running inside <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">wp-content/plugins/gabochie-gis-bi/</code> so <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800">http://localhost:3000</code> is live.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: WP Plugin Route */}
        {activeTab === 'plugin' && (
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-slate-600 font-medium">
              Create a quick 1-file custom plugin in your LocalWP site (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">wp-content/plugins/gabochie-gis-bi.php</code>). This adds a clean menu item in your <strong>WordPress Admin Sidebar</strong> so only logged-in WP admins see the BI Dashboard!
            </p>

            <div className="relative bg-slate-900 text-emerald-300 font-mono p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
              <button
                onClick={() => handleCopy(phpShortcodeSnippet, 1)}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 border border-slate-700"
              >
                {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre>{phpShortcodeSnippet}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Shortcode & iFrame */}
        {activeTab === 'iframe' && (
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-slate-600 font-medium">
              Embed the Public Landing Page or Membership Signup on any WordPress page or elementor block using this snippet:
            </p>

            <div className="relative bg-slate-900 text-teal-300 font-mono p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
              <button
                onClick={() => handleCopy(iframeSnippet, 2)}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 border border-slate-700"
              >
                {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 2 ? 'Copied!' : 'Copy iFrame Code'}</span>
              </button>
              <pre>{iframeSnippet}</pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ready for mkt.gabochie.com Membership SaaS</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};

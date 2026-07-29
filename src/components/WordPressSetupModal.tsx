import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Code, Layers, ShieldCheck, Download, Server } from 'lucide-react';

interface WordPressSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordPressSetupModal: React.FC<WordPressSetupModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'iframe' | 'plugin' | 'localwp' | 'theme' | 'shortcodes'>('shortcodes');

  if (!isOpen) return null;

  const customThemeStyleCss = `/*
Theme Name: Gabochie GIS Theme
Theme URI: https://mkt.gabochie.com
Author: Gabochie Marketing
Description: 100% Full-Viewport Theme for Ghana Maps BI Platform.
Version: 1.0.0
*/`;

  const customThemeIndexPhp = `<?php
/**
 * Theme Name: Gabochie GIS Theme
 * Description: 100% Full-Viewport Theme for Ghana Maps BI Platform.
 * Version: 1.0.0
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0f172a; }
        .gis-frame { width: 100vw; height: 100vh; border: none; display: block; }
    </style>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <iframe src="http://localhost:3000" class="gis-frame" allow="geolocation; camera; microphone"></iframe>
    <?php wp_footer(); ?>
</body>
</html>`;

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

// Shortcode [gabochie_gis] for Frontend WordPress Pages at http://localhost:10022/
function gabochie_mkt_gis_shortcode($atts) {
    return '<style>
        .gabochie-gis-wrapper { width:100%; max-width:100vw; position:relative; margin-left:50%; transform:translateX(-50%); padding:0; }
        .gabochie-gis-iframe { width:100%; height:90vh; min-height:750px; border:none; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.08); display:block; }
    </style>
    <div class="gabochie-gis-wrapper">
        <iframe src="http://localhost:3000" class="gabochie-gis-iframe" allow="geolocation; camera; microphone"></iframe>
    </div>';
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
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('shortcodes')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 whitespace-nowrap ${
              activeTab === 'shortcodes'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Shortcode Guide
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ⭐ Custom Theme (Full Page)
          </button>
          <button
            onClick={() => setActiveTab('localwp')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 whitespace-nowrap ${
              activeTab === 'localwp'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            LocalWP Setup
          </button>
          <button
            onClick={() => setActiveTab('plugin')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-3 whitespace-nowrap ${
              activeTab === 'plugin'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            WP Admin Sidebar Plugin
          </button>
        </div>

        {/* Tab -1: Shortcode Cheat Sheet */}
        {activeTab === 'shortcodes' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-emerald-700" />
                How to Use Shortcodes in WordPress
              </h4>
              <p className="text-emerald-850 font-medium">
                1. Edit any WordPress Page (or Site Editor) &rarr; 2. Add a <strong>Shortcode Block</strong> &rarr; 3. Paste any shortcode below!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Public Homepage Portal</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="public_landing"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">Embeds public map search & hero portal for visitors.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="public_landing"]', 10)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 10 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 10 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">BI Analytics & Lead Dashboard</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="dashboard"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">Displays internal BI metrics, charts, and lead counts.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="dashboard"]', 11)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 11 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 11 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Interactive GIS Map</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="map_explorer"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">Full interactive Ghana map with region filters.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="map_explorer"]', 12)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 12 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 12 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">B2B Business Directory</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="directory"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">Searchable listings of Ghana businesses & leads.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="directory"]', 13)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 13 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 13 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">AI Lead Hunter Console</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="lead_hunter"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">AI search agent for finding leads across regions.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="lead_hunter"]', 14)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 14 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 14 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Membership SaaS & Pricing</div>
                  <div className="font-mono text-emerald-300 text-xs font-bold mt-1">[gabochie_gis view="membership"]</div>
                  <p className="text-[11px] text-slate-400 mt-1">Tier pricing, payments & subscriber registration.</p>
                </div>
                <button
                  onClick={() => handleCopy('[gabochie_gis view="membership"]', 15)}
                  className="self-end bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 15 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 15 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl text-slate-700">
              <strong className="text-slate-900 font-bold">Custom Height Example:</strong>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-emerald-800 font-mono ml-2">
                [gabochie_gis view="dashboard" height="950px"]
              </code>
            </div>
          </div>
        )}

        {/* Tab 0: Custom Theme */}
        {activeTab === 'theme' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-emerald-700" />
                Custom Theme Setup (Fixes Missing Stylesheet Error)
              </h4>
              <p className="text-emerald-850 font-medium">
                WordPress requires <strong>two files</strong> in <code className="bg-white px-1 py-0.5 rounded border border-emerald-300 font-mono">wp-content/themes/gabochie-theme/</code>: <code className="bg-white px-1 py-0.5 rounded border border-emerald-300 font-mono">style.css</code> and <code className="bg-white px-1 py-0.5 rounded border border-emerald-300 font-mono">index.php</code>.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-800">
                1. Open Folder: <code className="bg-slate-100 px-1.5 py-0.5 rounded border text-slate-800 font-mono">C:\Users\user\Local Sites\gabochiemkt\app\public\wp-content\themes\gabochie-theme\</code>
              </p>
            </div>

            {/* File 1: style.css */}
            <div className="space-y-1">
              <p className="font-bold text-slate-800">
                2. Create file <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">style.css</code> (Fixes "Stylesheet is missing"):
              </p>
              <div className="relative bg-slate-900 text-emerald-300 font-mono p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
                <button
                  onClick={() => handleCopy(customThemeStyleCss, 4)}
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 4 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 4 ? 'Copied!' : 'Copy style.css'}</span>
                </button>
                <pre>{customThemeStyleCss}</pre>
              </div>
            </div>

            {/* File 2: index.php */}
            <div className="space-y-1">
              <p className="font-bold text-slate-800">
                3. Create file <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">index.php</code> (Full Viewport Layout):
              </p>
              <div className="relative bg-slate-900 text-emerald-300 font-mono p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
                <button
                  onClick={() => handleCopy(customThemeIndexPhp, 3)}
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 border border-slate-700"
                >
                  {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 3 ? 'Copied!' : 'Copy index.php'}</span>
                </button>
                <pre>{customThemeIndexPhp}</pre>
              </div>
            </div>

            <p className="font-medium text-slate-600">
              4. Go to <code className="bg-slate-100 px-1.5 py-0.5 rounded border text-slate-800 font-mono">http://localhost:10022/wp-admin/themes.php</code> and click <strong>Activate</strong> on <strong>Gabochie GIS Theme</strong>!
            </p>
          </div>
        )}

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

import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  FileCode,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileUp,
  Table,
  Check,
  Plus,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  CloudUpload,
  Share2,
} from 'lucide-react';
import { BusinessRecord, GhanaRegion, BusinessCategory } from '../types';

interface ExportReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessRecord[];
  onImportBusinesses?: (imported: BusinessRecord[]) => void;
  initialTab?: 'export' | 'import';
}

export const ExportReportsModal: React.FC<ExportReportsModalProps> = ({
  isOpen,
  onClose,
  businesses,
  onImportBusinesses,
  initialTab = 'export',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialTab);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json' | 'excel' | 'sheets'>('pdf');
  const [downloaded, setDownloaded] = useState(false);

  // Google Sheets Auth & Sync State
  const [isGoogleAuth, setIsGoogleAuth] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [googleEmail, setGoogleEmail] = useState<string>('gabochiemarketing@gmail.com');
  const [targetSheetTitle, setTargetSheetTitle] = useState<string>(
    `Ghana_Business_Leads_${new Date().toISOString().slice(0, 10)}`
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [sheetsSyncResult, setSheetsSyncResult] = useState<{
    sheetName: string;
    rowsSynced: number;
    url: string;
    timestamp: string;
  } | null>(null);

  // Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<Partial<BusinessRecord>[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google OAuth Auth simulation
  const handleAuthenticateGoogle = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsGoogleAuth(true);
    }, 1200);
  };

  // Google Sheets Push simulation
  const handlePushToGoogleSheets = () => {
    if (!isGoogleAuth) return;
    setIsSyncingSheets(true);
    setSheetsSyncResult(null);

    setTimeout(() => {
      setIsSyncingSheets(false);
      setSheetsSyncResult({
        sheetName: targetSheetTitle,
        rowsSynced: businesses.length,
        url: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 1800);
  };

  // Export Logic
  const handleExport = () => {
    setDownloaded(true);

    if (exportFormat === 'csv') {
      const headers = [
        'ID',
        'Name',
        'Category',
        'Region',
        'City',
        'Phone',
        'Email',
        'Website',
        'HealthScore',
        'PrimaryGap',
        'RecommendedService',
        'SetupFeeGHS',
      ];
      const rows = businesses.map((b) => [
        b.id,
        `"${b.name}"`,
        `"${b.category}"`,
        `"${b.region}"`,
        `"${b.city}"`,
        `"${b.phone}"`,
        `"${b.email}"`,
        `"${b.website}"`,
        b.healthScore?.overallScore || 75,
        `"${b.detectedGaps[0]?.title || ''}"`,
        `"${b.recommendedServices[0]?.serviceName || ''}"`,
        b.recommendedServices[0]?.setupFeeGHS || 0,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ghana_maps_bi_intelligence_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'json') {
      const jsonStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(businesses, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonStr);
      link.setAttribute('download', `ghana_maps_bi_intelligence_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'pdf') {
      window.print();
    }

    setTimeout(() => setDownloaded(false), 3000);
  };

  // Download Sample CSV Template
  const handleDownloadSampleTemplate = () => {
    const sampleHeaders = [
      'Name',
      'Category',
      'Region',
      'City',
      'Phone',
      'Email',
      'Website',
      'Address',
      'Description',
      'SetupFeeGHS',
    ];

    const sampleRows = [
      [
        'Accra Premium Dental Clinic',
        'Hospitals & Clinics',
        'Greater Accra',
        'Airport Residential, Accra',
        '+233244123456',
        'contact@accradental.com',
        'https://accradental.com',
        'Liberia Road, Accra',
        'Leading dental healthcare provider in Greater Accra',
        '1499',
      ],
      [
        'Kumasi Heritage Hotel',
        'Hotels & Hospitality',
        'Ashanti',
        'Adum, Kumasi',
        '+233501987654',
        'info@kumasiheritage.com',
        '',
        'Adum Main St, Kumasi',
        'Boutique hospitality and event facility without official website',
        '1850',
      ],
      [
        'Takoradi Oilfield Logistics',
        'Transport & Logistics',
        'Western',
        'Harbour Area, Takoradi',
        '+233312098765',
        'operations@takoradilogistics.gh',
        'https://takoradilogistics.gh',
        'Commercial Port Gate 2, Takoradi',
        'Heavy industrial logistics and freight forwarding solutions',
        '2400',
      ],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [sampleHeaders.join(','), ...sampleRows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ghana_business_leads_import_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV Helper
  const parseCSVString = (text: string): Partial<BusinessRecord>[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    // Helper to split CSV line considering quotes
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      return result;
    };

    const rawHeaders = parseLine(lines[0]).map((h) => h.toLowerCase().trim());

    // Map column indexes
    const getIndex = (keys: string[]) =>
      rawHeaders.findIndex((h) => keys.some((k) => h.includes(k)));

    const nameIdx = getIndex(['name', 'business', 'company', 'title']);
    const categoryIdx = getIndex(['category', 'industry', 'type']);
    const regionIdx = getIndex(['region', 'state', 'province', 'location']);
    const cityIdx = getIndex(['city', 'town', 'district']);
    const phoneIdx = getIndex(['phone', 'whatsapp', 'mobile', 'contact', 'tel']);
    const emailIdx = getIndex(['email', 'mail']);
    const websiteIdx = getIndex(['website', 'url', 'site', 'web']);
    const addressIdx = getIndex(['address', 'street', 'location']);
    const descIdx = getIndex(['description', 'about', 'notes']);

    const results: Partial<BusinessRecord>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length === 0 || !cols.some((c) => c.length > 0)) continue;

      const name = nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : `Lead Business ${i}`;
      const category = (categoryIdx >= 0 && cols[categoryIdx]
        ? cols[categoryIdx]
        : 'Restaurants & Food') as BusinessCategory;
      const region = (regionIdx >= 0 && cols[regionIdx]
        ? cols[regionIdx]
        : 'Greater Accra') as GhanaRegion;
      const city = cityIdx >= 0 && cols[cityIdx] ? cols[cityIdx] : 'Accra';
      const phone = phoneIdx >= 0 && cols[phoneIdx] ? cols[phoneIdx] : '+233240000000';
      const email = emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx] : 'info@ghana-lead.com';
      const website = websiteIdx >= 0 && cols[websiteIdx] ? cols[websiteIdx] : '';
      const address = addressIdx >= 0 && cols[addressIdx] ? cols[addressIdx] : `${city}, Ghana`;
      const description = descIdx >= 0 && cols[descIdx] ? cols[descIdx] : 'Imported prospect lead';

      results.push({
        id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        name,
        category,
        region,
        city,
        phone,
        email,
        website,
        address,
        description,
        status: 'OPERATIONAL',
        hasWebsite: Boolean(website && website !== 'N/A' && website !== '-'),
      });
    }

    return results;
  };

  // Process selected file
  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportStatus('❌ Error: Only CSV files (.csv) are supported.');
      return;
    }

    setCsvFile(file);
    setIsProcessing(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsed = parseCSVString(content);
        setParsedLeads(parsed);
        setIsProcessing(false);
        if (parsed.length === 0) {
          setImportStatus('⚠️ Warning: No valid business lead rows found in CSV.');
        } else {
          setImportStatus(`✅ Successfully parsed ${parsed.length} business lead(s) from CSV!`);
        }
      } catch (err: any) {
        setIsProcessing(false);
        setImportStatus(`❌ Parsing failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Confirm Import
  const handleExecuteImport = () => {
    if (parsedLeads.length === 0) return;

    const fullRecords: BusinessRecord[] = parsedLeads.map((p, idx) => {
      const hasWeb = p.hasWebsite ?? false;
      const overallScore = hasWeb ? Math.floor(65 + Math.random() * 25) : Math.floor(25 + Math.random() * 30);

      return {
        id: p.id || `csv-import-${Date.now()}-${idx}`,
        name: p.name || 'Imported Prospect',
        category: (p.category as BusinessCategory) || 'Restaurants & Food',
        phone: p.phone || '+233241234567',
        email: p.email || 'lead@example.com',
        website: p.website || '',
        socialMedia: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
        },
        address: p.address || `${p.city || 'Accra'}, Ghana`,
        gpsCoords: {
          lat: 5.6037 + (Math.random() - 0.5) * 0.1,
          lng: -0.187 + (Math.random() - 0.5) * 0.1,
        },
        region: (p.region as GhanaRegion) || 'Greater Accra',
        district: p.city || 'Accra Metro',
        city: p.city || 'Accra',
        openingHours: 'Mon-Sat 8:00 AM - 6:00 PM',
        rating: 4.2,
        reviewCount: 18,
        priceLevel: '$$',
        description: p.description || 'Imported via CSV Bulk Lead Ingestion.',
        photoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
        googlePlaceId: `place-csv-${Date.now()}-${idx}`,
        status: 'OPERATIONAL',
        yearsOnGoogle: 3,
        hasWebsite: hasWeb,
        hasSsl: hasWeb,
        hasWhatsApp: true,
        hasBookingSystem: false,
        healthScore: {
          websiteQuality: hasWeb ? 70 : 0,
          seoScore: hasWeb ? 55 : 0,
          branding: 60,
          speed: hasWeb ? 65 : 0,
          mobileFriendly: hasWeb ? 80 : 0,
          contentQuality: 50,
          leadCapture: 20,
          conversion: 30,
          trustSignals: 50,
          googleReviews: 70,
          socialPresence: 40,
          mapsRanking: 75,
          automationLevel: 10,
          digitalMaturity: hasWeb ? 45 : 15,
          overallScore,
        },
        detectedGaps: !hasWeb
          ? [
              {
                id: `gap-${idx}-1`,
                type: 'NO_WEBSITE',
                title: 'No Official Website or Web Booking Catalog',
                severity: 'CRITICAL',
                description: 'Business relies exclusively on foot traffic & offline referrals.',
                impactedRevenueUSDMonth: 1200,
              },
            ]
          : [
              {
                id: `gap-${idx}-2`,
                type: 'NO_CHATBOT',
                title: 'Missing AI WhatsApp Sales & Booking Automation',
                severity: 'HIGH',
                description: 'Customer inquiries outside business hours are lost without instant AI response.',
                impactedRevenueUSDMonth: 650,
              },
            ],
        recommendedServices: [
          {
            id: `service-${idx}-1`,
            serviceName: !hasWeb ? 'Custom Mobile-Responsive Web Suite' : 'AI WhatsApp Lead Booking Chatbot',
            category: !hasWeb ? 'Website & SEO' : 'AI & Automation',
            pitchAngle: 'Turn lost search inquiries into paying clients instantly.',
            difficulty: 'Easy',
            demandInGhana: 'Very High',
            estimatedMonthlyRevenueUSD: 850,
            setupFeeGHS: !hasWeb ? 1499 : 1299,
            monthlyRetainerGHS: 250,
            buildTimeDays: 4,
            urgencyScore: 92,
            profitabilityScore: 88,
            overallOpportunityScore: 90,
          },
        ],
        microSaaSProduct: {
          id: `saas-${idx}`,
          productName: 'AccraBiz WhatsApp Booking Bot',
          category: 'AI Chatbot',
          problemStatement: 'High phone drop-off during peak rush hours.',
          targetIndustryGhana: p.category || 'Local Businesses',
          keyFeatures: ['Instant WhatsApp Menu', 'M-Pharma/MoMo Checkout', 'Calendar Sync'],
          suggestedPricingUSDMonth: 49,
          suggestedPricingGHSMonth: 450,
          estimatedGhanaTAMUSD: 150000,
          competitionLevel: 'Low',
          buildTimeWeeks: 2,
          recurringLTVUSD: 1200,
          founderVerdict: 'High-margin local Micro SaaS opportunity with immediate cashflow.',
        },
        salesCollateral: {
          coldEmail: {
            subject: `Growth Partnership for ${p.name}`,
            body: `Hi ${p.name} team, we noticed your business is expanding in ${p.city}. Here is a quick audit...`,
          },
          coldWhatsApp: `Hello ${p.name}! We generated a custom digital audit report for your business in ${p.city}.`,
          phoneScript: `Good morning! May I speak with the managing director at ${p.name}?`,
          meetingScript: `Thank you for taking the time to meet with us...`,
          proposalOutline: {
            title: `Digital Optimization Package for ${p.name}`,
            executiveSummary: `Full turnkey setup of website, SEO, and WhatsApp lead capture.`,
            deliverables: ['Custom domain & hosting', 'WhatsApp Business API', 'Google Maps SEO'],
            investmentGHS: 1499,
            timelineWeeks: 1,
          },
          discoveryQuestions: ['How many new clients contact you weekly via WhatsApp?'],
        },
        lastAuditedAt: new Date().toISOString(),
      };
    });

    if (onImportBusinesses) {
      onImportBusinesses(fullRecords);
    }

    setImportStatus(`🎉 Successfully imported ${fullRecords.length} leads into local platform state!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
              {activeTab === 'export' ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {activeTab === 'export' ? 'Export Intelligence Report' : 'Bulk Import Leads (CSV)'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeTab === 'export'
                  ? 'Download formatted business discovery data'
                  : 'Ingest prospect leads directly into local state engine'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-extrabold gap-1">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Data ({businesses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Bulk CSV Import</span>
          </button>
        </div>

        {/* EXPORT TAB CONTENT */}
        {activeTab === 'export' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportFormat === 'pdf'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Printer className="w-5 h-5 text-indigo-600" />
                <span>PDF Executive Report</span>
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>CSV Dataset</span>
              </button>

              <button
                onClick={() => setExportFormat('json')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  exportFormat === 'json'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <FileCode className="w-5 h-5 text-blue-600" />
                <span>JSON Object Bundle</span>
              </button>

              <button
                onClick={() => setExportFormat('sheets')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
                  exportFormat === 'sheets'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <CloudUpload className="w-5 h-5 text-emerald-600" />
                  {isGoogleAuth && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span>Google Sheets Sync</span>
              </button>
            </div>

            {/* GOOGLE SHEETS DEDICATED SYNC PANEL */}
            {exportFormat === 'sheets' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">Google Workspace Direct Integration</h4>
                      <p className="text-[11px] text-slate-400">Push filtered leads to live Google Sheets</p>
                    </div>
                  </div>

                  {isGoogleAuth && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Authenticated</span>
                    </span>
                  )}
                </div>

                {!isGoogleAuth ? (
                  <div className="space-y-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-200">OAuth 2.0 Authorization Required</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Authenticate your Google Account to grant write access to Google Drive & Sheets API.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        Google Account Email
                      </label>
                      <input
                        type="email"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="user@gmail.com"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isAuthenticating}
                      onClick={handleAuthenticateGoogle}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      {isAuthenticating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Authorizing via Google OAuth 2.0...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Authorize Google Workspace Access</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Connected Account:</span>
                      <span className="font-mono text-emerald-400 font-bold">{googleEmail}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        Target Google Sheet Title
                      </label>
                      <input
                        type="text"
                        value={targetSheetTitle}
                        onChange={(e) => setTargetSheetTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isSyncingSheets || businesses.length === 0}
                      onClick={handlePushToGoogleSheets}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 rounded-2xl text-xs shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isSyncingSheets ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Pushing {businesses.length} Lead Records to Google Sheets...</span>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4" />
                          <span>Push {businesses.length} Filtered Leads to Google Sheets</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* API Call Sync Result Success Banner */}
                {sheetsSyncResult && (
                  <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-3.5 space-y-2 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Google Sheets API Payload Transferred!</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sheetsSyncResult.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-0.5">
                      <div>
                        Sheet Name: <span className="font-bold text-white">{sheetsSyncResult.sheetName}</span>
                      </div>
                      <div>
                        Rows Appended: <span className="font-bold text-emerald-300">{sheetsSyncResult.rowsSynced} Business Records</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={sheetsSyncResult.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-[11px] transition-all cursor-pointer shadow-sm"
                      >
                        <span>Open Sheet in Google Drive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                {downloaded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Report Downloaded Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Report ({businesses.length} Records)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* BULK CSV IMPORT TAB CONTENT */}
        {activeTab === 'import' && (
          <div className="space-y-4 text-xs">
            {/* Download Sample Template Row */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-emerald-950">Need a CSV template?</div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Download sample file formatted with standard Ghana Maps columns.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSampleTemplate}
                className="bg-white hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-300 text-[11px] shrink-0 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample CSV</span>
              </button>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                  : csvFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>

              <div>
                <p className="font-extrabold text-slate-800">
                  {csvFile ? csvFile.name : 'Click or drag & drop CSV file here'}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Supports .csv with headers: Name, Category, Region, City, Phone, Email, Website
                </p>
              </div>
            </div>

            {/* Status Alert Banner */}
            {importStatus && (
              <div
                className={`p-3 rounded-2xl font-bold flex items-center gap-2 text-xs border ${
                  importStatus.includes('❌')
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : importStatus.includes('⚠️')
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <span>{importStatus}</span>
              </div>
            )}

            {/* Parsed Preview List */}
            {parsedLeads.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Parsed Lead Records ({parsedLeads.length})</span>
                  </span>
                  <span className="text-emerald-700 font-mono">Ready to inject</span>
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white">
                  {parsedLeads.slice(0, 15).map((lead, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div>
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {lead.category} • {lead.region} ({lead.city})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-[10px] text-emerald-700 font-bold">{lead.phone}</div>
                        <div className="text-[9px] text-slate-400 truncate max-w-[140px]">{lead.email}</div>
                      </div>
                    </div>
                  ))}
                  {parsedLeads.length > 15 && (
                    <div className="p-2 text-center text-[10px] text-slate-400 font-bold bg-slate-50">
                      + {parsedLeads.length - 15} more lead records...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={parsedLeads.length === 0 || isProcessing}
                onClick={handleExecuteImport}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Parsing CSV File...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Import {parsedLeads.length} Leads into Platform State</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


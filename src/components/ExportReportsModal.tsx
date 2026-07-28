import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  FileCode,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { BusinessRecord } from '../types';

interface ExportReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessRecord[];
}

export const ExportReportsModal: React.FC<ExportReportsModalProps> = ({
  isOpen,
  onClose,
  businesses,
}) => {
  if (!isOpen) return null;

  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json' | 'excel'>('pdf');
  const [downloaded, setDownloaded] = useState(false);

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
        b.healthScore.overallScore,
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
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(businesses, null, 2));
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Export Intelligence Report</h3>
              <p className="text-xs text-slate-500 font-medium">Download formatted business discovery data</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => setExportFormat('pdf')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
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
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
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
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              exportFormat === 'json'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileCode className="w-5 h-5 text-blue-600" />
            <span>JSON Object Bundle</span>
          </button>

          <button
            onClick={() => setExportFormat('excel')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              exportFormat === 'excel'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            <span>Excel Spreadsheet</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all"
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
      </div>
    </div>
  );
};

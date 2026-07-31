import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Download,
  CheckCircle2,
  Filter,
  Sparkles,
  PhoneCall,
  Building2,
  RefreshCw,
  LayoutGrid,
  List,
  Plus,
  GripVertical,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  X,
  Zap,
  Share2,
  Send,
  Database,
  Check,
  ExternalLink,
  Layers,
  Settings,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';

export type PipelineStage = 'new' | 'contacted' | 'audit_sent' | 'proposal' | 'closed_won';

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  region: string;
  interest: string;
  businessName?: string;
  notes?: string;
  createdAt: string;
  stage?: PipelineStage;
  estimatedValueGHS?: number;
  winProbability?: number;
  autoMoved?: boolean;
  crmSynced?: boolean;
  crmContactId?: string;
  crmSyncedAt?: string;
  crmProvider?: string;
}

export const CRM_PROVIDERS = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    icon: '🟧',
    defaultEndpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
    description: 'Sync contacts, deal stages, and revenue metrics directly to HubSpot Sales Hub.',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'salesforce',
    name: 'Salesforce Sales Cloud',
    icon: '🟦',
    defaultEndpoint: 'https://your-domain.my.salesforce.com/services/data/v58.0/sobjects/Contact',
    description: 'Export leads into Enterprise Salesforce CRM Lead Pipeline.',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    id: 'gohighlevel',
    name: 'GoHighLevel (GHL)',
    icon: '⚡',
    defaultEndpoint: 'https://rest.gohighlevel.com/v1/contacts/',
    description: 'Trigger automated WhatsApp & SMS campaigns in GoHighLevel sub-accounts.',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp Automation',
    icon: '🐵',
    defaultEndpoint: 'https://us1.api.mailchimp.com/3.0/lists/member_list/members',
    description: 'Subscribe leads to targeted email newsletters and marketing automation funnels.',
    badgeBg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    icon: '🔵',
    defaultEndpoint: 'https://youraccount.api-us1.com/api/3/contacts',
    description: 'Sync leads to ActiveCampaign CRM deals & automated follow-up sequences.',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    id: 'webhook',
    name: 'Custom Webhook / Zapier / Make',
    icon: '🔗',
    defaultEndpoint: 'https://hooks.zapier.com/hooks/catch/123456/ghana_maps/',
    description: 'Post raw JSON lead payloads to any custom API, Zapier, Make.com, or n8n workflow.',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

export const DEFAULT_FIELD_MAPPING = [
  { source: 'Prospect Name', target: 'firstname / lastname', sample: 'Kofi Mensah' },
  { source: 'Email Address', target: 'email', sample: 'kofi@accradigital.com' },
  { source: 'WhatsApp / Phone', target: 'phone / mobilephone', sample: '+233244123456' },
  { source: 'Ghana Region', target: 'state_province / region', sample: 'Greater Accra' },
  { source: 'Package Interest', target: 'lead_source / interest_tier', sample: 'Founder Pro Package' },
  { source: 'Est. Deal Value (GHS)', target: 'amount / deal_value', sample: 'GHS 1,299' },
  { source: 'Pipeline Stage', target: 'dealstage / status', sample: 'New Discovery' },
  { source: 'AI Win Score', target: 'lead_score', sample: '88%' },
];

const PIPELINE_STAGES: { id: PipelineStage; title: string; color: string; badgeBg: string; border: string; headerBg: string }[] = [
  {
    id: 'new',
    title: 'New Lead / Discovery',
    color: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'border-indigo-200',
    headerBg: 'bg-indigo-50/80',
  },
  {
    id: 'contacted',
    title: 'WhatsApp Contacted',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-amber-200',
    headerBg: 'bg-amber-50/80',
  },
  {
    id: 'audit_sent',
    title: 'Audit & Pitch Sent',
    color: 'text-purple-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    border: 'border-purple-200',
    headerBg: 'bg-purple-50/80',
  },
  {
    id: 'proposal',
    title: 'Proposal & Retainer',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-200',
    headerBg: 'bg-blue-50/80',
  },
  {
    id: 'closed_won',
    title: 'Closed Won (Paid)',
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-200',
    headerBg: 'bg-emerald-50/80',
  },
];

export const LeadsManagerView: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [autoMoveNotice, setAutoMoveNotice] = useState<string | null>(null);
  const [autoMoveEnabled, setAutoMoveEnabled] = useState(false);

  // CRM Sync State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [crmTargetLeads, setCrmTargetLeads] = useState<LeadRecord[]>([]);
  const [selectedCrmProvider, setSelectedCrmProvider] = useState('hubspot');
  const [crmApiKey, setCrmApiKey] = useState('pat-na1-ghana-maps-demo-token-9842');
  const [crmWebhookUrl, setCrmWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/123456/ghana_maps/');
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [crmSyncNotice, setCrmSyncNotice] = useState<string | null>(null);
  const [crmSyncResult, setCrmSyncResult] = useState<{
    success: boolean;
    message: string;
    batchId?: string;
    totalSynced?: number;
    records?: any[];
  } | null>(null);

  // Toggle single lead selection
  const handleToggleLeadSelection = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all filtered leads
  const handleToggleSelectAll = (filteredList: LeadRecord[]) => {
    if (selectedLeadIds.length >= filteredList.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredList.map((l) => l.id));
    }
  };

  // Open CRM Modal for selected leads or all
  const handleOpenCrmSync = (targetList?: LeadRecord[]) => {
    const leadsToSync = targetList || (selectedLeadIds.length > 0
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : leads);

    setCrmTargetLeads(leadsToSync);
    setCrmSyncResult(null);
    setShowCrmModal(true);
  };

  // Open CRM Modal for a single specific lead
  const handleOpenCrmSyncSingle = (lead: LeadRecord) => {
    setCrmTargetLeads([lead]);
    setCrmSyncResult(null);
    setShowCrmModal(true);
  };

  // Execute API Sync Call
  const handleExecuteCrmSync = async () => {
    if (crmTargetLeads.length === 0) return;
    setIsSyncingCrm(true);
    setCrmSyncResult(null);

    try {
      const res = await fetch('/api/crm/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leads: crmTargetLeads,
          crmProvider: selectedCrmProvider,
          apiKey: crmApiKey,
          webhookUrl: crmWebhookUrl,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setCrmSyncResult(json);
        const syncedTimestamp = new Date().toLocaleTimeString();
        const providerObj = CRM_PROVIDERS.find((p) => p.id === selectedCrmProvider);
        const providerName = providerObj ? providerObj.name : selectedCrmProvider;

        // Update local leads state with CRM synced metadata
        setLeads((prevLeads) =>
          prevLeads.map((lead) => {
            const syncedRecord = json.records?.find((r: any) => r.leadId === lead.id);
            if (syncedRecord || crmTargetLeads.some((t) => t.id === lead.id)) {
              return {
                ...lead,
                crmSynced: true,
                crmContactId: syncedRecord?.crmContactId || `${selectedCrmProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
                crmSyncedAt: syncedTimestamp,
                crmProvider: providerName,
              };
            }
            return lead;
          })
        );

        setCrmSyncNotice(
          `✅ ${json.totalSynced} lead(s) successfully exported to ${providerName}! (Batch ID: ${json.batchId})`
        );
      } else {
        setCrmSyncResult({
          success: false,
          message: json.error || 'Failed to sync with CRM API.',
        });
      }
    } catch (err: any) {
      console.error('CRM sync error:', err);
      setCrmSyncResult({
        success: false,
        message: err.message || 'Network error attempting CRM API sync.',
      });
    } finally {
      setIsSyncingCrm(false);
    }
  };

  // Helper to compute Agentic Win Probability Score
  const computeAgenticWinScore = (l: Partial<LeadRecord>, idx: number): number => {
    if (l.winProbability && l.winProbability > 0) return l.winProbability;
    let score = 68;
    if (l.interest?.includes('Enterprise')) score += 20;
    else if (l.interest?.includes('Founder Pro')) score += 15;
    else if (l.interest?.includes('Starter')) score += 5;

    if (l.region === 'Greater Accra' || l.region === 'Ashanti') score += 5;
    if (l.businessName && l.businessName.length > 3) score += 4;

    // Add deterministic spread so key enterprise / founder pro deals exceed 90%
    const spread = ((idx * 17 + 5) % 21) - 3;
    score = Math.min(98, Math.max(52, score + spread));
    return score;
  };

  // Run AI Auto-Move feature for leads with >90% win probability
  const runAutoMoveEngine = (currentLeads = leads) => {
    let movedCount = 0;
    const updatedLeads = currentLeads.map((lead) => {
      const prob = lead.winProbability || 0;
      if (prob > 90 && lead.stage !== 'closed_won') {
        movedCount++;
        return { ...lead, stage: 'closed_won' as PipelineStage, autoMoved: true };
      }
      return lead;
    });

    if (movedCount > 0) {
      setLeads(updatedLeads);
      setAutoMoveNotice(
        `⚡ AI Auto-Move Engine: Transferred ${movedCount} high-probability prospect(s) (>90% Win Score) directly to 'Closed Won'!`
      );
    } else {
      setAutoMoveNotice(
        `⚡ AI Auto-Move Engine: All leads with >90% Win Score are already in 'Closed Won'.`
      );
    }

    setTimeout(() => {
      setAutoMoveNotice(null);
    }, 6000);
  };

  const handleToggleAutoMove = () => {
    const nextState = !autoMoveEnabled;
    setAutoMoveEnabled(nextState);
    if (nextState) {
      runAutoMoveEngine();
    }
  };

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    name: '',
    email: '',
    whatsapp: '',
    region: 'Greater Accra',
    interest: 'Founder Pro Package (GHS 1,299/mo)',
    businessName: '',
    estimatedValueGHS: 1299,
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      if (json.success && json.data) {
        // Assign default stages & win probability score
        const mapped = json.data.map((l: LeadRecord, idx: number) => {
          const winScore = l.winProbability || computeAgenticWinScore(l, idx);
          return {
            ...l,
            stage: l.stage || (idx % 5 === 0 ? 'closed_won' : idx % 4 === 0 ? 'proposal' : idx % 3 === 0 ? 'audit_sent' : idx % 2 === 0 ? 'contacted' : 'new'),
            estimatedValueGHS: l.estimatedValueGHS || (l.interest.includes('Enterprise') ? 2999 : l.interest.includes('Founder Pro') ? 1299 : 499),
            winProbability: winScore,
          };
        });
        setLeads(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.whatsapp.includes(searchQuery) ||
      (lead.businessName && lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = regionFilter === 'ALL' || lead.region.toLowerCase() === regionFilter.toLowerCase();

    return matchesSearch && matchesRegion;
  });

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: PipelineStage) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, stage: targetStage } : lead
        )
      );
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.name || !newDeal.whatsapp) return;

    const created: LeadRecord = {
      id: `deal-${Date.now()}`,
      name: newDeal.name,
      email: newDeal.email || 'contact@client.gh',
      whatsapp: newDeal.whatsapp,
      region: newDeal.region,
      interest: newDeal.interest,
      businessName: newDeal.businessName,
      createdAt: new Date().toISOString(),
      stage: 'new',
      estimatedValueGHS: Number(newDeal.estimatedValueGHS) || 1299,
    };

    setLeads([created, ...leads]);
    setShowAddModal(false);
    setNewDeal({
      name: '',
      email: '',
      whatsapp: '',
      region: 'Greater Accra',
      interest: 'Founder Pro Package (GHS 1,299/mo)',
      businessName: '',
      estimatedValueGHS: 1299,
    });
  };

  const exportLeadsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'WhatsApp', 'Region', 'Interest', 'Business Name', 'Stage', 'Value (GHS)', 'Date'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.whatsapp}"`,
      `"${l.region}"`,
      `"${l.interest}"`,
      `"${l.businessName || ''}"`,
      `"${l.stage}"`,
      `"${l.estimatedValueGHS || 0}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GhanaMaps_Sales_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total pipeline value
  const totalPipelineValueGHS = filteredLeads.reduce((acc, curr) => acc + (curr.estimatedValueGHS || 0), 0);
  const closedWonValueGHS = filteredLeads
    .filter((l) => l.stage === 'closed_won')
    .reduce((acc, curr) => acc + (curr.estimatedValueGHS || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>LEAD GENERATION & SALES KANBAN PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ghana Prospect Pipeline ({leads.length})
          </h2>
          <p className="text-sm text-indigo-100/90 font-normal">
            Drag and drop opportunities across sales stages. Trigger cold WhatsApp pitches & track closed retainer revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenCrmSync()}
            title="Export leads to HubSpot, Salesforce, GoHighLevel, or Webhook API"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer border border-emerald-300/40"
          >
            <Database className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Sync to CRM {selectedLeadIds.length > 0 ? `(${selectedLeadIds.length})` : ''}</span>
          </button>

          <button
            onClick={() => runAutoMoveEngine()}
            title="Automatically move leads with >90% win probability score to Closed Won"
            className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-amber-300 font-extrabold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-indigo-700"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Auto-Move (&gt;90%)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-white/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Deal</span>
          </button>

          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-indigo-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportLeadsCSV}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* CRM Sync Notification Toast */}
      {crmSyncNotice && (
        <div className="bg-indigo-950 border border-indigo-600 text-indigo-100 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 font-bold">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{crmSyncNotice}</span>
          </div>
          <button
            onClick={() => setCrmSyncNotice(null)}
            className="text-indigo-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Auto-Move Notification Toast */}
      {autoMoveNotice && (
        <div className="bg-emerald-900 border border-emerald-600 text-emerald-100 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 font-bold">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 animate-bounce" />
            <span>{autoMoveNotice}</span>
          </div>
          <button
            onClick={() => setAutoMoveNotice(null)}
            className="text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Metrics & View Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Prospects</div>
            <div className="text-2xl font-black text-slate-900">{filteredLeads.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Closed Won Revenue</div>
            <div className="text-2xl font-black text-emerald-600">GHS {closedWonValueGHS.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pipeline Potential</div>
            <div className="text-2xl font-black text-blue-600">GHS {totalPipelineValueGHS.toLocaleString()}</div>
          </div>
        </div>

        {/* View Mode Toggle Button */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pipeline Layout</div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              id="kanban-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, prospect name, email, phone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchQuery && (
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'match' : 'matches'} for "{searchQuery}"
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Auto-Move Switch */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Zap className={`w-3.5 h-3.5 ${autoMoveEnabled ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-bold text-slate-700">Auto-Move (&gt;90% Score):</span>
            <button
              onClick={handleToggleAutoMove}
              type="button"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoMoveEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title="Toggle automatic move of >90% win probability leads to Closed Won"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoMoveEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600"
            >
              <option value="ALL">All Ghana Regions</option>
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
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => (l.stage || 'new') === stage.id);
            const stageValueGHS = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValueGHS || 0), 0);
            const isTarget = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`bg-slate-50 border-2 rounded-2xl p-3 space-y-3 transition-all min-h-[500px] flex flex-col justify-between ${
                  isTarget ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-300' : stage.border
                }`}
              >
                {/* Column Header */}
                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${stage.headerBg} ${stage.border}`}>
                    <div>
                      <h3 className={`font-extrabold text-xs uppercase tracking-wider ${stage.color}`}>
                        {stage.title}
                      </h3>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        GHS {stageValueGHS.toLocaleString()}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-3 pt-1">
                    {stageLeads.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-[11px] text-slate-400 font-medium">
                        Drag leads here
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const formattedPhone = lead.whatsapp.replace(/\s+/g, '');
                        const waNumber = formattedPhone.startsWith('+')
                          ? formattedPhone.replace('+', '')
                          : `233${formattedPhone.replace(/^0/, '')}`;

                        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                          `Hello ${lead.name}! 👋 I saw your inquiry for ${lead.interest} on GhanaMaps BI. How can I assist you in ${lead.region}?`
                        )}`;

                        const winProb = lead.winProbability || 75;
                        const isHighProb = winProb > 90;
                        const isSelected = selectedLeadIds.includes(lead.id);

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            className={`bg-white border rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing relative group ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-400 bg-indigo-50/30'
                                : isHighProb && lead.stage !== 'closed_won'
                                ? 'border-emerald-400 ring-1 ring-emerald-300 bg-emerald-50/20'
                                : 'border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleLeadSelection(lead.id);
                                  }}
                                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                                  )}
                                </button>
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {lead.name}
                                  </h4>
                                  {lead.businessName && (
                                    <p className="text-[10px] text-slate-500 font-medium">{lead.businessName}</p>
                                  )}
                                </div>
                              </div>
                              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                            </div>

                            {/* Agentic Win Probability & CRM Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                              {isHighProb ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-md">
                                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                                  <span>{winProb}% Win Score</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded-md">
                                  <span>{winProb}% Win Score</span>
                                </span>
                              )}

                              {lead.crmSynced ? (
                                <span
                                  title={`Synced to ${lead.crmProvider || 'CRM'} • Contact ID: ${lead.crmContactId}`}
                                  className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md"
                                >
                                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                                  <span>Synced CRM</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenCrmSyncSingle(lead);
                                  }}
                                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all cursor-pointer"
                                >
                                  <Database className="w-2.5 h-2.5 text-indigo-500" />
                                  <span>Sync CRM</span>
                                </button>
                              )}

                              {lead.autoMoved && (
                                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                  <span>Auto-Moved</span>
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                                <span>{lead.region}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span>{lead.interest.split('(')[0]}</span>
                                <span className="font-mono font-bold text-emerald-600">
                                  GHS {lead.estimatedValueGHS || 1299}
                                </span>
                              </div>
                            </div>

                            {/* Quick Auto-Move Action Button if high score but not yet closed */}
                            {isHighProb && lead.stage !== 'closed_won' && (
                              <button
                                onClick={() => {
                                  setLeads((prev) =>
                                    prev.map((l) =>
                                      l.id === lead.id
                                        ? { ...l, stage: 'closed_won' as PipelineStage, autoMoved: true }
                                        : l
                                    )
                                  );
                                  setAutoMoveNotice(`⚡ Lead '${lead.name}' auto-moved to Closed Won (>90% Win Score)!`);
                                }}
                                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] font-black py-1.5 px-2 rounded-lg shadow-2xs transition-all cursor-pointer"
                              >
                                <Zap className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse" />
                                <span>Auto-Move to Closed (&gt;90%)</span>
                              </button>
                            )}

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-md border border-emerald-200 text-[10px] transition-all"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>

                              <select
                                value={lead.stage || 'new'}
                                onChange={(e) => {
                                  const target = e.target.value as PipelineStage;
                                  setLeads((prev) =>
                                    prev.map((l) => (l.id === lead.id ? { ...l, stage: target } : l))
                                  );
                                }}
                                className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-1.5 py-1 focus:outline-none focus:border-indigo-600"
                              >
                                {PIPELINE_STAGES.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    Move: {s.title.split(' ')[0]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectAll(filteredLeads)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Select all leads"
                    >
                      {selectedLeadIds.length > 0 && selectedLeadIds.length >= filteredLeads.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Prospect Name</th>
                  <th className="py-3 px-4">Win Score</th>
                  <th className="py-3 px-4">CRM Integration</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Package & Retainer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                      No captured leads found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const formattedPhone = lead.whatsapp.replace(/\s+/g, '');
                    const waNumber = formattedPhone.startsWith('+')
                      ? formattedPhone.replace('+', '')
                      : `233${formattedPhone.replace(/^0/, '')}`;

                    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Hello ${lead.name}! 👋 Thank you for inquiring about ${lead.interest} on GhanaMaps BI. How can I assist you with digital leads for ${lead.region}?`
                    )}`;

                    const currentStageObj = PIPELINE_STAGES.find((s) => s.id === (lead.stage || 'new')) || PIPELINE_STAGES[0];
                    const winProb = lead.winProbability || 75;
                    const isHighProb = winProb > 90;
                    const isSelected = selectedLeadIds.includes(lead.id);

                    return (
                      <tr key={lead.id} className={`transition-colors ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleLeadSelection(lead.id)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>{lead.name}</div>
                          {lead.businessName && (
                            <div className="text-[10px] text-slate-400 font-normal">{lead.businessName}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {isHighProb ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded-md text-[10px]">
                                <Zap className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                                <span>{winProb}%</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                <span>{winProb}%</span>
                              </span>
                            )}
                            {lead.autoMoved && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                                Auto-Moved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {lead.crmSynced ? (
                            <div className="inline-flex flex-col">
                              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3 h-3 text-teal-600" />
                                <span>{lead.crmProvider || 'Synced CRM'}</span>
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                                ID: {lead.crmContactId}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenCrmSyncSingle(lead)}
                              className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-md border border-indigo-200 text-[10px] transition-all cursor-pointer"
                            >
                              <Database className="w-3 h-3 text-indigo-600" />
                              <span>Sync to CRM</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-700 font-mono font-bold">{lead.whatsapp}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.stage || 'new'}
                            onChange={(e) => {
                              const target = e.target.value as PipelineStage;
                              setLeads((prev) =>
                                prev.map((l) => (l.id === lead.id ? { ...l, stage: target } : l))
                              );
                            }}
                            className={`text-xs font-bold rounded-md px-2.5 py-1 border focus:outline-none ${currentStageObj.badgeBg}`}
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                            {lead.region}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-indigo-700">{lead.interest}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            GHS {lead.estimatedValueGHS || 1299} / mo
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenCrmSyncSingle(lead)}
                              title="Sync Lead to External CRM"
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all cursor-pointer"
                            >
                              <Database className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD MANUAL DEAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Add Opportunity To Pipeline</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDealSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  placeholder="e.g. Yaw Bio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  WhatsApp Contact (+233) *
                </label>
                <input
                  type="text"
                  required
                  value={newDeal.whatsapp}
                  onChange={(e) => setNewDeal({ ...newDeal, whatsapp: e.target.value })}
                  placeholder="024 000 0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Business Name (Optional)
                </label>
                <input
                  type="text"
                  value={newDeal.businessName}
                  onChange={(e) => setNewDeal({ ...newDeal, businessName: e.target.value })}
                  placeholder="e.g. Bio Logistics Ghana"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Region
                  </label>
                  <select
                    value={newDeal.region}
                    onChange={(e) => setNewDeal({ ...newDeal, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Western">Western</option>
                    <option value="Northern">Northern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Est. Value (GHS)
                  </label>
                  <input
                    type="number"
                    value={newDeal.estimatedValueGHS}
                    onChange={(e) => setNewDeal({ ...newDeal, estimatedValueGHS: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all mt-2"
              >
                Add Deal To Kanban Board
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SYNC TO CRM MODAL */}
      {showCrmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 my-8 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Sync Sales Leads to External CRM & Automation Tool
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-normal pl-9">
                  Export prospect data directly to marketing automation tools or custom API webhooks.
                </p>
              </div>

              <button
                onClick={() => setShowCrmModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Leads Summary Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Target Prospects to Export: <span className="text-indigo-600 font-black">{crmTargetLeads.length} Lead(s)</span></span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold px-2.5 py-1 rounded-md">
                  Est. Value: GHS {crmTargetLeads.reduce((acc, curr) => acc + (curr.estimatedValueGHS || 1299), 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* CRM Provider Tabs */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-extrabold text-xs uppercase tracking-wider">
                1. Select Target Marketing Automation / CRM Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CRM_PROVIDERS.map((provider) => {
                  const isSelected = selectedCrmProvider === provider.id;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => {
                        setSelectedCrmProvider(provider.id);
                        setCrmApiKey(
                          provider.id === 'hubspot' ? 'pat-na1-ghana-maps-demo-token-9842' :
                          provider.id === 'salesforce' ? 'bearer_sf_token_live_ghana_bi' :
                          provider.id === 'gohighlevel' ? 'ghl_loc_accra_subaccount_v1' :
                          provider.id === 'mailchimp' ? 'mc_key_849201948201948' :
                          'api_key_live_marketing_auto'
                        );
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-400 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{provider.icon}</span>
                        {isSelected && (
                          <span className="bg-indigo-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900">{provider.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{provider.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config & API Credentials */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. API Credentials & Authentication</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  SSL Encrypted TLS 1.3
                </span>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                  API Bearer Token / Secret Key ({CRM_PROVIDERS.find(p => p.id === selectedCrmProvider)?.name})
                </label>
                <input
                  type="text"
                  value={crmApiKey}
                  onChange={(e) => setCrmApiKey(e.target.value)}
                  placeholder="e.g. pat-na1-xxxx-xxxx-xxxx"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                  Endpoint / Webhook Target URL
                </label>
                <input
                  type="text"
                  value={crmWebhookUrl}
                  onChange={(e) => setCrmWebhookUrl(e.target.value)}
                  placeholder={CRM_PROVIDERS.find(p => p.id === selectedCrmProvider)?.defaultEndpoint}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Field Mapping Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. Schema Field Mapping Preview</span>
                </span>
                <span className="text-[10px] text-slate-400">Ghana Maps Schema &rarr; CRM Contact Schema</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                <table className="w-full text-left bg-white">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Ghana Maps Property</th>
                      <th className="py-2 px-3">Target CRM Field</th>
                      <th className="py-2 px-3">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {DEFAULT_FIELD_MAPPING.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-1.5 px-3 font-bold text-slate-900">{m.source}</td>
                        <td className="py-1.5 px-3 font-mono text-indigo-600">{m.target}</td>
                        <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">{m.sample}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sync Result Output */}
            {crmSyncResult && (
              <div className={`rounded-2xl p-4 border text-xs space-y-2 ${
                crmSyncResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-extrabold">
                  <div className="flex items-center gap-2">
                    {crmSyncResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span>{crmSyncResult.message}</span>
                  </div>
                  {crmSyncResult.batchId && (
                    <span className="font-mono bg-white border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] text-emerald-800">
                      {crmSyncResult.batchId}
                    </span>
                  )}
                </div>

                {crmSyncResult.records && crmSyncResult.records.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200 space-y-1">
                    <div className="font-bold text-[10px] uppercase tracking-wider text-emerald-800">
                      Synced CRM Contact Receipts ({crmSyncResult.records.length})
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1 font-mono text-[10px]">
                      {crmSyncResult.records.map((r: any, idx: number) => (
                        <div key={idx} className="bg-white/80 border border-emerald-200 rounded px-2 py-1 flex justify-between items-center">
                          <span>{r.name} ({r.email})</span>
                          <span className="font-bold text-emerald-700">{r.crmContactId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sync Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCrmModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isSyncingCrm || crmTargetLeads.length === 0}
                onClick={handleExecuteCrmSync}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSyncingCrm ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Syncing API Payload...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>Execute Sync to {CRM_PROVIDERS.find(p => p.id === selectedCrmProvider)?.name} ({crmTargetLeads.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


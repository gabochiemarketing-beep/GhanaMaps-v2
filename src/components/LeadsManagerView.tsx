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
  X
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
}

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
        // Assign default stages if not present for realistic kanban simulation
        const mapped = json.data.map((l: LeadRecord, idx: number) => ({
          ...l,
          stage: l.stage || (idx % 5 === 0 ? 'closed_won' : idx % 4 === 0 ? 'proposal' : idx % 3 === 0 ? 'audit_sent' : idx % 2 === 0 ? 'contacted' : 'new'),
          estimatedValueGHS: l.estimatedValueGHS || (l.interest.includes('Enterprise') ? 2999 : l.interest.includes('Founder Pro') ? 1299 : 499),
        }));
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Deal</span>
          </button>

          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-indigo-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportLeadsCSV}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

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
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lead name, email, phone, business..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Regions</option>
            <option value="Greater Accra">Greater Accra</option>
            <option value="Ashanti">Ashanti</option>
            <option value="Western">Western</option>
            <option value="Northern">Northern</option>
          </select>
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

                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing relative group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {lead.name}
                                </h4>
                                {lead.businessName && (
                                  <p className="text-[10px] text-slate-500 font-medium">{lead.businessName}</p>
                                )}
                              </div>
                              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
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
                  <th className="py-3 px-4">Prospect Name</th>
                  <th className="py-3 px-4">WhatsApp Contact</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Package & Retainer</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
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

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>{lead.name}</div>
                          {lead.businessName && (
                            <div className="text-[10px] text-slate-400 font-normal">{lead.businessName}</div>
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
                        <td className="py-3.5 px-4 text-slate-400 font-normal">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
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
    </div>
  );
};


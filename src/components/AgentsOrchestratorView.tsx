import React, { useState } from 'react';
import {
  Bot,
  Play,
  Terminal,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  RotateCw,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AgentRole, BusinessRecord, AgentLog } from '../types';

interface AgentsOrchestratorViewProps {
  businesses: BusinessRecord[];
}

export const AgentsOrchestratorView: React.FC<AgentsOrchestratorViewProps> = ({
  businesses,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('Executive Advisor Agent');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    businesses[0]?.id || ''
  );
  const [agentQuery, setAgentQuery] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'log-001',
      agentRole: 'Discovery Agent',
      timestamp: new Date().toLocaleTimeString(),
      action: 'Scanned 16 Ghana Regions',
      details: 'Identified 50+ commercial entities with missing web portals or automated booking systems in Accra, Kumasi & Takoradi.',
      status: 'COMPLETED',
      insightsGained: [
        'Highest revenue gap observed in private clinics & real estate brokers.',
        'Over 82% of businesses lack WhatsApp MoMo automation.',
      ],
    },
  ]);

  const AGENT_ROLES: { role: AgentRole; category: string; description: string }[] = [
    { role: 'Discovery Agent', category: 'Data & Maps', description: 'Finds underserved commercial entities in Ghana regions.' },
    { role: 'Google Maps Agent', category: 'Data & Maps', description: 'Extracts Place ID, reviews, & map ranking signals.' },
    { role: 'Website Auditor Agent', category: 'Audits', description: 'Checks mobile speed, SSL, UX & lead capture.' },
    { role: 'SEO Agent', category: 'Audits', description: 'Analyzes local Ghanaian keyword positioning.' },
    { role: 'AI Opportunity Agent', category: 'Strategy', description: 'Detects automation gaps & revenue leakage.' },
    { role: 'Digital Services Agent', category: 'Sales', description: 'Formulates service packages & setup fees.' },
    { role: 'Micro SaaS Strategist', category: 'Strategy', description: 'Architects B2B SaaS ideas tailored for Ghana.' },
    { role: 'Revenue Forecast Agent', category: 'Strategy', description: 'Calculates TAM & monthly retainer potential.' },
    { role: 'Sales Agent', category: 'Sales', description: 'Generates cold emails & WhatsApp pitches.' },
    { role: 'Proposal Generator Agent', category: 'Sales', description: 'Drafts project scopes & timelines.' },
    { role: 'CRM Agent', category: 'Operations', description: 'Maps lead routing & client follow-up flows.' },
    { role: 'Lead Qualification Agent', category: 'Sales', description: 'Scores lead conversion probability.' },
    { role: 'Competitive Intelligence Agent', category: 'Market', description: 'Benchmarks against regional competitors.' },
    { role: 'Business Health Agent', category: 'Audits', description: 'Calculates overall 0-100 health index.' },
    { role: 'Product Manager Agent', category: 'Strategy', description: 'Defines feature roadmaps for local SaaS.' },
    { role: 'Market Research Agent', category: 'Market', description: 'Analyzes Ghana industry growth trends.' },
    { role: 'Report Writer Agent', category: 'Reporting', description: 'Compiles executive summary decks.' },
    { role: 'Executive Advisor Agent', category: 'Strategy', description: 'Orchestrates top 10 daily founder deals.' },
  ];

  const handleRunAgent = async () => {
    setIsRunning(true);
    const targetBiz = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

    try {
      const response = await fetch('/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentRole: selectedAgent,
          businessId: targetBiz.id,
          queryContext: agentQuery,
        }),
      });

      const data = await response.json();

      const newLog: AgentLog = {
        id: `log-${Date.now()}`,
        agentRole: selectedAgent,
        timestamp: new Date().toLocaleTimeString(),
        action: data.action || `Executed analysis for ${targetBiz.name}`,
        details: data.details || 'Agent completed reasoning cycle.',
        status: 'COMPLETED',
        insightsGained: data.insightsGained || [
          'High demand for WhatsApp MoMo automation.',
          `Suggested setup contract fee: GHS ${data.suggestedOfferGHS || 12000}.`,
        ],
      };

      setLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error('Error running agent:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Studio Header */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>18 SPECIALIZED AUTONOMOUS AI AGENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Agentic Orchestration & Strategy Studio
            </h2>
            <p className="text-sm text-indigo-100/90 font-normal">
              Select any specialized AI agent to execute autonomous analysis, audits, Micro SaaS strategy, and sales proposals for Ghanaian enterprises.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-xs flex items-center gap-3 shrink-0">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-indigo-200 font-medium">Model Engine:</div>
              <div className="font-bold text-white">Gemini 3.6 Flash (Server-Side)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Agent Selector + Execution Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (1 Col wide): 18 Agent Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Select AI Agent ({AGENT_ROLES.length})
          </h3>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {AGENT_ROLES.map((ag) => {
              const isSelected = selectedAgent === ag.role;
              return (
                <div
                  key={ag.role}
                  onClick={() => setSelectedAgent(ag.role)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{ag.role}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                      {ag.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">{ag.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 Cols wide): Run Controls & Live Terminal Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Run Control Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Selected Agent:</span>
                <h3 className="font-extrabold text-lg text-slate-900">{selectedAgent}</h3>
              </div>

              {/* Target Business Selector */}
              <div className="min-w-[200px]">
                <label className="block text-[11px] text-slate-500 mb-1 font-bold uppercase tracking-wider">
                  Target Business in Ghana:
                </label>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Custom Instructions Input */}
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">
                Custom Instructions / Query Context for Agent (Optional):
              </label>
              <input
                type="text"
                value={agentQuery}
                onChange={(e) => setAgentQuery(e.target.value)}
                placeholder="e.g. Focus on Mobile Money payment workflows and cold WhatsApp pitch..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <button
              onClick={handleRunAgent}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Executing Agent Reasoning Cycle...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute {selectedAgent}</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Logs Output Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>Agent Execution Terminal Output</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {logs.length} Cycles Logged
              </span>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      {log.agentRole}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>

                  <div className="font-semibold text-slate-200">{log.action}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-line font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {log.details}
                  </p>

                  {log.insightsGained && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-bold text-emerald-400">
                        Insights & Recommendations:
                      </div>
                      {log.insightsGained.map((ins, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{ins}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

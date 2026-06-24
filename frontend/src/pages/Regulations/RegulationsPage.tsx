import { useState, useEffect } from 'react';
import api from '../../services/api';
import { io } from 'socket.io-client';
import ConflictWarning from '../../components/ConflictWarning';

interface Obligation {
  requirement: string;
  priority: string;
  category: string;
}

interface Conflict {
  regulationId: string;
  title: string;
  explanation: string;
}

interface Regulation {
  _id: string;
  title: string;
  source: string;
  status: string;
  conflicts?: Conflict[];
  analysis?: {
    title?: string;
    summary?: string;
    obligations: Obligation[];
    deadlines: { description: string; date: string }[];
    affectedDepartments: string[];
    affectedSystems: string[];
    riskLevel?: string;
  };
}

interface WorkflowUpdate {
  regulationId: string;
  node: string;
  status: string;
  timestamp: string;
}

const RISK_CONFIG: Record<string, { color: string; bg: string }> = {
  HIGH:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  MEDIUM:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  LOW:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toUpperCase();
  const colors: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
  const c = colors[p] || '#6366f1';
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}
    >
      {priority}
    </span>
  );
}

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<WorkflowUpdate[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const response = await api.get('/regulations');
        setRegulations(response.data);
      } catch (error) {
        console.error('Failed to fetch regulations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000');
    socket.on('workflow_update', (data: WorkflowUpdate) => {
      setUpdates(prev => [data, ...prev].slice(0, 8));
      if (data.node === 'generate_maps' && data.status === 'COMPLETED') {
        setTimeout(fetchRegulations, 1500);
      }
    });
    return () => { socket.disconnect(); };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-white/60 text-sm">Loading regulations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Regulations Explorer</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            AI-analyzed regulatory documents with extracted obligations & conflict detection
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
        >
          {regulations.length} Documents
        </div>
      </div>

      {/* Live workflow feed */}
      {updates.length > 0 && (
        <div
          className="rounded-2xl p-4 bg-indigo-500/5 border border-indigo-500/15"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">Live AI Workflow</p>
          </div>
          <div className="space-y-2">
            {updates.map((upd, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Reg <span className="font-mono text-indigo-400">{upd.regulationId.slice(-6)}</span>
                  {' '}→ <span className="text-white font-medium">{upd.node.replace(/_/g, ' ')}</span>
                </span>
                <span
                  className="px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: upd.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                    color: upd.status === 'COMPLETED' ? '#10b981' : '#818cf8',
                  }}
                >
                  {upd.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {regulations.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl bg-white/5 border border-dashed border-white/10"
        >
          <p className="text-5xl mb-4">📜</p>
          <p className="text-white font-semibold mb-1">No regulations analyzed yet</p>
          <p className="text-sm text-white/40">
            Upload a document to start the autonomous analysis pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {regulations.map((reg) => {
            const rl = reg.analysis?.riskLevel?.toUpperCase() || '';
            const rc = RISK_CONFIG[rl] || RISK_CONFIG['LOW'];
            const isExpanded = expanded === reg._id;
            const conflictCount = reg.conflicts?.length || 0;

            return (
              <div
                key={reg._id}
                className="rounded-2xl overflow-hidden transition-all glass-panel hover:bg-white/5"
              >
                {/* Card header — always visible */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : reg._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {conflictCount > 0 && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                          >
                            ⚠️ {conflictCount} Conflict{conflictCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {rl && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.color}30` }}
                          >
                            {rl} Risk
                          </span>
                        )}
                      </div>
                      <h2 className="text-base font-bold text-white leading-snug">
                        {reg.analysis?.title || reg.title}
                      </h2>
                      <p className="text-xs mt-1 text-white/40">
                        Source: {reg.source} · Status: <span className="text-indigo-400">{reg.status}</span>
                      </p>
                    </div>
                    <svg
                      width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5}
                      className="flex-shrink-0 mt-1 transition-transform"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {reg.analysis?.summary && (
                    <p className="text-sm mt-3 leading-relaxed line-clamp-2 text-white/50">
                      {reg.analysis.summary}
                    </p>
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/10">
                    {conflictCount > 0 && reg.conflicts && (
                      <div className="mt-4">
                        <ConflictWarning conflicts={reg.conflicts} />
                      </div>
                    )}

                    {reg.analysis?.obligations && reg.analysis.obligations.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider mb-3 text-white/40">
                          Extracted Obligations ({reg.analysis.obligations.length})
                        </p>
                        <div className="space-y-2">
                          {reg.analysis.obligations.map((ob, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white leading-snug">{ob.requirement}</p>
                                <p className="text-xs mt-1 text-white/40">{ob.category}</p>
                              </div>
                              <PriorityBadge priority={ob.priority} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {reg.analysis?.affectedDepartments && reg.analysis.affectedDepartments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-white/40">
                          Affected Departments
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {reg.analysis.affectedDepartments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            >
                              🏢 {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

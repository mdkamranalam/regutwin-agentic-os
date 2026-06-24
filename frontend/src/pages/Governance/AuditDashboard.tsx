import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Audit {
  _id: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  evidenceText?: string;
  createdAt: string;
  regulationId: { title: string; source: string };
  mapId: { actionRequired: string; assignedTo: string; description: string };
  validationResult?: { is_valid: boolean; confidence: number; feedback: string };
}

const ACTION_COLORS: Record<string, { textClass: string; bgClass: string; borderClass: string; icon: string }> = {
  CREATED:        { textClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/30', icon: '➕' },
  UPDATED:        { textClass: 'text-amber-500', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/30', icon: '✏️' },
  STATUS_CHANGED: { textClass: 'text-blue-500', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/30', icon: '🔄' },
  VALIDATED:      { textClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/30', icon: '🔬' },
};

export default function AuditDashboard() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await api.get('/audits');
        setAudits(response.data);
      } catch (error) {
        console.error('Failed to fetch audits', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const filtered = filter === 'ALL' ? audits : audits.filter(a => a.action === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-white/60 text-sm">Loading audit trails...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Governance & Audit Trail</h1>
          <p className="text-sm mt-1 text-white/40">
            Immutable compliance activity log — every AI decision recorded
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
        >
          {audits.length} Records
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', 'CREATED', 'STATUS_CHANGED', 'VALIDATED', 'UPDATED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${filter === f ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'bg-white/5 text-white/40 border border-white/10'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl bg-white/5 border border-dashed border-white/10"
        >
          <p className="text-5xl mb-4">🛡️</p>
          <p className="text-white font-semibold mb-1">No audit records</p>
          <p className="text-sm text-white/40">
            Compliance events will appear here as the system processes regulations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((audit) => {
            const ac = ACTION_COLORS[audit.action] || { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: '📋' };
            return (
              <div
                key={audit._id}
                className="rounded-2xl p-5 glass-panel"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${ac.bgClass} ${ac.textClass} ${ac.borderClass}`}
                    >
                      {ac.icon} {audit.action.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/30">
                    {new Date(audit.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-white/30">Regulation</p>
                    <p className="text-sm font-medium text-white">{audit.regulationId?.title || 'Unknown'}</p>
                    <p className="text-xs mt-0.5 text-white/40">{audit.regulationId?.source}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-white/30">MAP Task</p>
                    <p className="text-sm font-medium text-white">{audit.mapId?.actionRequired || 'Unknown'}</p>
                    <p className="text-xs mt-0.5 text-white/40">{audit.mapId?.assignedTo}</p>
                  </div>
                </div>

                {(audit.previousStatus || audit.newStatus) && (
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-xs text-white/40">Status:</span>
                    {audit.previousStatus && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold line-through bg-red-500/10 text-red-500">
                        {audit.previousStatus}
                      </span>
                    )}
                    {audit.previousStatus && audit.newStatus && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {audit.newStatus && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                        {audit.newStatus}
                      </span>
                    )}
                  </div>
                )}

                {audit.validationResult && (
                  <div
                    className={`p-4 rounded-xl border ${audit.validationResult.is_valid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-xs font-bold ${audit.validationResult.is_valid ? 'text-emerald-500' : 'text-red-500'}`}>
                        🔬 AI Validation {audit.validationResult.is_valid ? 'PASSED' : 'FAILED'}
                      </h4>
                      <span className="text-xs font-semibold text-white/50">
                        Confidence: {audit.validationResult.confidence}%
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">
                      {audit.validationResult.feedback}
                    </p>
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

import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Audit {
  _id: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  evidenceText?: string;
  evidenceHash?: string;
  evidenceFilePath?: string;
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
  
  // Verification Modal State
  const [verifyModal, setVerifyModal] = useState<{ open: boolean; auditId: string; hashInput: string; result: any } | null>(null);

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

  const handleVerifySeal = async (auditId: string, hashInput: string) => {
    try {
      const res = await api.post('/audits/verify', { auditId, hashToVerify: hashInput });
      setVerifyModal(prev => prev ? { ...prev, result: res.data } : null);
    } catch (e) {
      alert('Cryptographic ledger verification failed.');
    }
  };

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
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">Phase 14 Active</span>
            <h1 className="text-2xl font-black text-white">Governance & WORM Evidence Vault</h1>
          </div>
          <p className="text-sm mt-1 text-white/40">
            Cryptographic SHA-256 tamper-evident compliance log — every AI execution cryptographically sealed
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
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
        <div className="text-center py-20 rounded-2xl bg-white/5 border border-dashed border-white/10">
          <p className="text-5xl mb-4">🛡️</p>
          <p className="text-white font-semibold mb-1">No audit records</p>
          <p className="text-sm text-white/40">Compliance events will appear here as the system processes regulations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((audit) => {
            const ac = ACTION_COLORS[audit.action] || { textClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/30', icon: '📋' };
            const defaultHash = audit.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            return (
              <div key={audit._id} className="rounded-2xl p-5 glass-panel relative border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${ac.bgClass} ${ac.textClass} ${ac.borderClass}`}>
                      {ac.icon} {audit.action.replace('_', ' ')}
                    </span>
                    {audit.action === 'VALIDATED' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        🔐 SHA-256 SEALED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVerifyModal({ open: true, auditId: audit._id, hashInput: defaultHash, result: null })}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      🛡️ Verify WORM Ledger
                    </button>
                    <span className="text-xs font-mono text-white/30">
                      {new Date(audit.createdAt).toLocaleString()}
                    </span>
                  </div>
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
                    {audit.previousStatus && audit.newStatus && <span>→</span>}
                    {audit.newStatus && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                        {audit.newStatus}
                      </span>
                    )}
                  </div>
                )}

                {audit.validationResult && (
                  <div className={`p-4 rounded-xl border ${audit.validationResult.is_valid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-xs font-bold ${audit.validationResult.is_valid ? 'text-emerald-500' : 'text-red-500'}`}>
                        🔬 AI Validation {audit.validationResult.is_valid ? 'PASSED' : 'FAILED'}
                      </h4>
                      <span className="text-xs font-semibold text-white/50">Confidence: {audit.validationResult.confidence}%</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{audit.validationResult.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cryptographic WORM Verification Modal */}
      {verifyModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-indigo-500/40 shadow-2xl fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔐</span>
                <h3 className="text-lg font-black text-white tracking-tight">Cryptographic Evidence Verification</h3>
              </div>
              <button onClick={() => setVerifyModal(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-gray-300">
              Enter or verify the SHA-256 digital signature of the compliance evidence document. The vault validates against Mongoose Write-Once-Read-Many (WORM) ledger records.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">SHA-256 Hash to Check:</label>
              <input
                type="text"
                value={verifyModal.hashInput}
                onChange={(e) => setVerifyModal({ ...verifyModal, hashInput: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleVerifySeal(verifyModal.auditId, verifyModal.hashInput)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
              >
                🔬 Execute Hash Verification
              </button>
            </div>

            {verifyModal.result && (
              <div className={`p-4 rounded-xl border mt-4 ${verifyModal.result.verified ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-red-500/15 border-red-500/40 text-red-300'}`}>
                <div className="flex items-center gap-2 font-black text-sm uppercase mb-1">
                  <span>{verifyModal.result.verified ? '✅ INTEGRITY VERIFIED' : '❌ TAMPER DETECTED'}</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{verifyModal.result.message}</p>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono space-y-1 text-gray-400">
                  <p>Ledger Seal: {verifyModal.result.storedHash?.slice(0, 32)}...</p>
                  <p>Input Check: {verifyModal.result.providedHash?.slice(0, 32)}...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../../services/api';
import ApiTestConfigurator from '../../components/ApiTestConfigurator';

interface MAP {
  _id: string;
  description: string;
  assignedTo: string;
  status: string;
  actionRequired: string;
  targetApiEndpoint?: string;
  testConfig?: any;
  priority?: string;
  riskLevel?: string;
  acceptanceCriteria?: string;
  validationMethod?: string;
  deadline?: string;
  regulationId: {
    _id: string;
    title: string;
    source: string;
  };
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  OPEN:        { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'Open' },
  IN_PROGRESS: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'In Progress' },
  IN_REVIEW:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  label: 'In Review' },
  CLOSED:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  label: 'Closed' },
  OVERDUE:     { color: '#ef4444', bg: 'rgba(239,68,68,0.3)',   label: '🚨 Overdue' },
};

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl shadow-2xl max-w-sm fade-in backdrop-blur-xl ${type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-red-500/15 border border-red-500/40'}`}
    >
      <span className="text-xl mt-0.5">{type === 'success' ? '✅' : '❌'}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{type === 'success' ? 'Validation Passed' : 'Validation Failed'}</p>
        <p className="text-xs mt-1 line-clamp-4 text-white/60">{message}</p>
      </div>
      <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors text-sm mt-0.5">✕</button>
    </div>
  );
}

export default function MapDashboard() {
  const [maps, setMaps] = useState<MAP[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchMaps = async () => {
    try {
      const userStr = localStorage.getItem('user');
      let query = '';
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.role !== 'ADMIN' && u.department && u.department !== 'All') {
            query = `?department=${u.department}`;
          }
        } catch(e) {}
      }
      const response = await api.get(`/maps${query}`);
      setMaps(response.data);
    } catch (error) {
      console.error('Failed to fetch MAPs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
    window.addEventListener('tenant_switched', fetchMaps);
    return () => window.removeEventListener('tenant_switched', fetchMaps);
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/maps/${id}/status`, { status: newStatus });
      setMaps((prev) => prev.map((map) => (map._id === id ? { ...map, status: newStatus } : map)));
    } catch (error) {
      console.error('Failed to update MAP status', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-white/60 text-sm">Loading MAPs...</span>
        </div>
      </div>
    );
  }

  const openCount = maps.filter(m => m.status === 'OPEN').length;
  const closedCount = maps.filter(m => m.status === 'CLOSED').length;

  return (
    <div className="fade-in space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">MAP Dashboard</h1>
          <p className="text-sm mt-1 text-white/40">
            Measurable Action Points — Assigned & Tracked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
            {openCount} Open
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {closedCount} Closed
          </div>
        </div>
      </div>

      {maps.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl bg-white/5 border border-dashed border-white/10"
        >
          <p className="text-5xl mb-4">📋</p>
          <p className="text-white font-semibold mb-1">No MAPs generated yet</p>
          <p className="text-sm text-white/40">
            Upload a regulatory document to automatically generate MAPs.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {maps.map((map) => {
            const sc = STATUS_CONFIG[map.status] || STATUS_CONFIG['OPEN'];
            return (
              <div
                key={map._id}
                className="rounded-2xl p-5 transition-all glass-panel"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 mr-4">
                    <h2 className="text-base font-bold text-white mb-1 leading-snug">{map.actionRequired}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                      >
                        📁 {map.regulationId?.title || 'Unknown Regulation'}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10"
                      >
                        🏢 {map.assignedTo}
                      </span>
                      {map.priority && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${map.priority === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/30' : map.priority === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                          ⚡ {map.priority}
                        </span>
                      )}
                      {map.validationMethod && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          🔬 {map.validationMethod}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}33` }}
                    >
                      {sc.label}
                    </span>
                    <select
                      value={map.status}
                      onChange={(e) => handleStatusChange(map._id, e.target.value)}
                      className="text-xs font-medium rounded-lg px-2 py-1.5 outline-none cursor-pointer bg-white/5 border border-white/10 text-white/70"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="IN_REVIEW">IN REVIEW</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {map.description && (
                  <p className="text-sm mb-3 leading-relaxed text-white/50">
                    {map.description}
                  </p>
                )}

                {map.acceptanceCriteria && (
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 mb-4">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">🎯 Measurable Acceptance Criteria</p>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed">{map.acceptanceCriteria}</p>
                  </div>
                )}

                <ApiTestConfigurator
                  mapId={map._id}
                  initialEndpoint={map.targetApiEndpoint}
                  initialConfig={map.testConfig}
                  onValidationComplete={(res) => {
                    if (res.map) {
                      setMaps(prev => prev.map(m => m._id === map._id ? { ...m, status: res.map.status } : m));
                    }
                    const passed = res.validationResult?.is_valid;
                    setToast({
                      type: passed ? 'success' : 'error',
                      message: res.validationResult?.feedback || (passed ? 'Compliance verified.' : 'Validation failed.'),
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

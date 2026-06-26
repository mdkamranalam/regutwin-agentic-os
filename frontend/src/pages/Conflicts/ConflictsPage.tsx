import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Zap, BookOpen, Clock, ChevronDown, ChevronUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

interface ConflictItem {
  conflictingRegulationId: string;
  conflictingTitle: string;
  explanation: string;
  severity: 'Critical' | 'High' | 'Medium';
  recommendation: string;
}

interface ConflictGroup {
  regulationId: string;
  regulationTitle: string;
  source: string;
  riskLevel: string;
  detectedAt: string;
  conflicts: ConflictItem[];
}

interface ConflictStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  regulationsAffected: number;
}

const SEVERITY_CONFIG = {
  Critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: ShieldAlert,
    dot: 'bg-red-500',
  },
  High: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: AlertTriangle,
    dot: 'bg-orange-500',
  },
  Medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: Zap,
    dot: 'bg-yellow-500',
  },
};

function ConflictCard({ group }: { group: ConflictGroup }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={14} className="text-emerald-400 shrink-0" />
              <span className="text-xs text-gray-500 truncate">{group.source}</span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{group.regulationTitle}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={11} />
                {new Date(group.detectedAt).toLocaleDateString()}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                group.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : group.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              }`}>
                {group.riskLevel} Risk
              </span>
              <span className="text-xs text-gray-500">
                {group.conflicts.length} conflict{group.conflicts.length > 1 ? 's' : ''} detected
              </span>
            </div>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors shrink-0 mt-1">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Conflict List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10"
          >
            <div className="p-5 space-y-4">
              {group.conflicts.map((c, i) => {
                const cfg = SEVERITY_CONFIG[c.severity] || SEVERITY_CONFIG.Medium;
                const Icon = cfg.icon;
                return (
                  <div key={i} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <Icon size={15} className={cfg.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                            {c.severity} Conflict
                          </span>
                          <span className="text-xs text-gray-500 truncate">{c.conflictingTitle}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-3">{c.explanation}</p>
                        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                          <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Recommended Mitigation
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed">{c.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ConflictsPage() {
  const [groups, setGroups] = useState<ConflictGroup[]>([]);
  const [stats, setStats] = useState<ConflictStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [conflictsRes, statsRes] = await Promise.all([
        api.get('/conflicts'),
        api.get('/conflicts/stats').catch(() => ({ data: null })),
      ]);
      setGroups(conflictsRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = severityFilter === 'ALL'
    ? groups
    : groups.filter(g => g.conflicts.some(c => c.severity === severityFilter));

  const totalConflicts = stats?.total || groups.reduce((a, g) => a + g.conflicts.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Conflict Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">
            Semantic cross-regulation conflict detection powered by ChromaDB + LLM reasoning
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Conflicts', value: stats.total, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
            { label: 'Critical', value: stats.critical, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
            { label: 'High', value: stats.high, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { label: 'Regulations Affected', value: stats.regulationsAffected, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-4 ${s.bg} ${s.border}`}
            >
              <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Severity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', 'Critical', 'High', 'Medium'].map((f) => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              severityFilter === f
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
            }`}
          >
            {f === 'ALL' ? `All (${totalConflicts})` : f}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span className="text-gray-400 text-sm">Scanning conflict registry...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No Conflicts Detected</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {groups.length === 0
              ? 'Upload regulations and run the AI pipeline to start detecting cross-regulatory conflicts.'
              : `No ${severityFilter.toLowerCase()} conflicts found. Try a different severity filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((group) => (
            <ConflictCard key={group.regulationId} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

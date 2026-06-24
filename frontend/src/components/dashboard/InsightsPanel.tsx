import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function InsightsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl p-6 overflow-hidden border',
        'bg-gradient-to-br from-indigo-900/40 to-violet-900/20',
        'border-indigo-500/30 backdrop-blur-xl',
        'shadow-[0_8px_32px_0_rgba(99,102,241,0.15)]'
      )}
    >
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">AI Compliance Briefing</h2>
          <p className="text-xs text-indigo-300 font-medium">Auto-generated summary for the current operational window</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
          <FileText size={18} className="text-cyan-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">2 New Regulations</p>
            <p className="text-xs text-gray-400 mt-1">Detected and ingested into the vector database this week.</p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">1 Conflict Detected</p>
            <p className="text-xs text-amber-200/70 mt-1">Between RBI Mandate 2026 and existing SEBI guidelines.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
          <ShieldAlert size={18} className="text-emerald-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">Overall Risk: Low</p>
            <p className="text-xs text-emerald-200/70 mt-1">Current mapped obligations cover 98% of active regulations.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          Review Conflicts <ArrowRight size={16} />
        </button>
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/10 transition-colors">
          Generate Executive Report
        </button>
      </div>
    </motion.div>
  );
}

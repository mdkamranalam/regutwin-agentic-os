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
        'bg-gradient-to-br from-slate-900/80 to-slate-950/90',
        'border-white/10 backdrop-blur-xl',
        'shadow-2xl'
      )}
    >
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Compliance Briefing</h2>
            <p className="text-xs text-gray-400 font-medium">Real-time intelligence for the current operational window</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Confidence: 98.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <FileText size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">2 New Regulations</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">Ingested into vector DB: SEBI ESGGuidelines & RBI DigitalLending.</p>
          </div>
        </div>

        <div className="group p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/[0.08] transition-all duration-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">1 Conflict Detected</p>
            <p className="text-xs text-amber-200/60 mt-1 leading-relaxed">RBI Mandate 2026 vs existing SEBI guidelines on risk weighting.</p>
          </div>
        </div>

        <div className="group p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/[0.08] transition-all duration-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <ShieldAlert size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Overall Risk: Low</p>
            <p className="text-xs text-emerald-200/60 mt-1 leading-relaxed">98% of mapped obligations are current and verified.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/5">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all duration-200 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] group">
          Investigate Conflicts <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all duration-200 hover:border-white/20">
          Generate Executive Report
        </button>
      </div>
    </motion.div>
  );
}

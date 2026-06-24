import { motion } from 'framer-motion';
import { Eye, BrainCircuit, Zap, Scale, UserCheck, Stethoscope, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const AGENTS = [
  { id: 'watchman', name: 'Watchman', icon: Eye, status: 'Active', load: '12%', conf: '99%', desc: 'Regulatory Monitoring' },
  { id: 'analyst', name: 'Analyst', icon: BrainCircuit, status: 'Active', load: '45%', conf: '92%', desc: 'Requirement Analysis' },
  { id: 'conflict', name: 'Conflict Engine', icon: Zap, status: 'Active', load: '8%', conf: '88%', desc: 'Collision Detection' },
  { id: 'legal', name: 'Legal Review', icon: Scale, status: 'Active', load: '15%', conf: '95%', desc: 'Statutory Validation' },
  { id: 'human', name: 'Human Gate', icon: UserCheck, status: 'Waiting', load: '0%', conf: 'N/A', desc: 'Expert Approval' },
  { id: 'validator', name: 'Validator', icon: Stethoscope, status: 'Standby', load: '0%', conf: 'N/A', desc: 'Final Verification' },
];

export function AIPipeline() {
  return (
    <div className="rounded-2xl p-8 glass-panel border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Agentic Workflow Pipeline
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-xs text-gray-400 font-medium">Autonomous orchestration of regulatory intelligence agents</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM OPERATIONAL
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto hide-scrollbar pb-4">
        <div className="min-w-[900px] relative flex justify-between items-start px-4">
          {/* Connection Line Background */}
          <div className="absolute top-12 left-0 right-0 h-[2px] bg-white/5 z-0" />

          {/* Animated Flow Line */}
          <motion.div
            className="absolute top-12 left-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 z-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            initial={{ width: '0%' }}
            animate={{ width: '83%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {AGENTS.map((agent, idx) => {
            const isActive = agent.status === 'Active';
            const isWaiting = agent.status === 'Waiting';

            return (
              <div key={agent.id} className="relative z-10 flex flex-col items-center group w-32">
                {/* Agent Node */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-2 transition-all duration-300 shadow-xl',
                    isActive ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-indigo-500/10' :
                    isWaiting ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-amber-500/10' :
                    'bg-slate-800/50 border-slate-700/50 text-slate-500 shadow-black/20'
                  )}
                >
                  <agent.icon size={24} strokeWidth={2} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/30 animate-ping opacity-30" />
                  )}
                </motion.div>

                {/* Label and Status */}
                <div className="text-center">
                  <p className="text-xs font-bold text-white whitespace-nowrap group-hover:text-indigo-400 transition-colors">{agent.name}</p>
                  <p className={cn(
                    'text-[9px] font-black uppercase tracking-tighter mt-1 px-1.5 py-0.5 rounded-md border inline-block',
                    isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    isWaiting ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-slate-500 bg-slate-500/10 border-slate-500/20'
                  )}>
                    {agent.status}
                  </p>
                </div>

                {/* Detailed Tooltip */}
                <div className="absolute top-full mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-20 w-40 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">{agent.desc}</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Processing Load</span>
                      <span className="text-white font-mono">{agent.load}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Confidence Score</span>
                      <span className="text-white font-mono">{agent.conf}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] text-slate-500">Agent ID: {agent.id}</span>
                    <ChevronRight size={10} className="text-slate-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

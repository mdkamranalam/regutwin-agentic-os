import { motion } from 'framer-motion';
import { Eye, BrainCircuit, Zap, Scale, UserCheck, Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';

const AGENTS = [
  { id: 'watchman', name: 'Watchman', icon: Eye, status: 'Active', load: '12%', conf: '99%' },
  { id: 'analyst', name: 'Analyst', icon: BrainCircuit, status: 'Active', load: '45%', conf: '92%' },
  { id: 'conflict', name: 'Conflict Engine', icon: Zap, status: 'Active', load: '8%', conf: '88%' },
  { id: 'legal', name: 'Legal Review', icon: Scale, status: 'Active', load: '15%', conf: '95%' },
  { id: 'human', name: 'Human Gate', icon: UserCheck, status: 'Waiting', load: '0%', conf: 'N/A' },
  { id: 'validator', name: 'Validator', icon: Stethoscope, status: 'Standby', load: '0%', conf: 'N/A' },
];

export function AIPipeline() {
  return (
    <div className="rounded-2xl p-6 glass-panel border border-white/10 bg-white/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Agentic Workflow Pipeline</h3>
          <p className="text-xs text-gray-400 mt-1">Real-time status of the autonomous compliance agents</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Healthy
          </span>
        </div>
      </div>

      <div className="relative flex justify-between items-start pt-4">
        {/* Animated Connecting Line */}
        <div className="absolute top-10 left-8 right-8 h-0.5 bg-gray-800 z-0" />
        <motion.div
          className="absolute top-10 left-8 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 z-0"
          initial={{ width: '0%' }}
          animate={{ width: '80%' }} // Simulating flow up to Human Gate
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {AGENTS.map((agent, idx) => {
          const isActive = agent.status === 'Active';
          const isWaiting = agent.status === 'Waiting';
          
          return (
            <div key={agent.id} className="relative z-10 flex flex-col items-center group cursor-pointer w-24">
              {/* Icon Container */}
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-3 border shadow-lg transition-colors',
                  isActive ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' :
                  isWaiting ? 'bg-amber-900/50 border-amber-500/50 text-amber-300' :
                  'bg-gray-800/50 border-gray-700/50 text-gray-500'
                )}
              >
                <agent.icon size={20} />
                {/* Active pulse ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl border border-indigo-400/50 animate-ping opacity-20" />
                )}
              </motion.div>

              {/* Text info */}
              <div className="text-center">
                <p className="text-[11px] font-bold text-gray-200 whitespace-nowrap">{agent.name}</p>
                <p className={cn(
                  'text-[9px] font-semibold uppercase mt-0.5',
                  isActive ? 'text-emerald-400' : isWaiting ? 'text-amber-400' : 'text-gray-500'
                )}>
                  {agent.status}
                </p>
              </div>

              {/* Hover tooltip for extra data */}
              <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-32 bg-gray-900 border border-white/10 rounded-lg p-2 shadow-xl">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400">Load:</span>
                  <span className="text-white font-medium">{agent.load}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-white font-medium">{agent.conf}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

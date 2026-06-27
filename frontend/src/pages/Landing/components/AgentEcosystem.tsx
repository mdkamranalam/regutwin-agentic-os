import { motion } from 'framer-motion';
import { Eye, BrainCircuit, Target, Zap, ShieldCheck, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

const agents = [
  {
    name: 'Watchman Agent',
    icon: <Eye size={24} />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'The first line of defense. Watchman autonomously monitors regulatory bodies and detects new compliance requirements in real-time.',
    features: [
      'Monitors RBI circulars & notifications',
      'Tracks SEBI and government portals',
      'Detects new regulations via semantic triggers',
      'Triggers downstream analysis workflows automatically'
    ]
  },
  {
    name: 'Analyst Agent',
    icon: <BrainCircuit size={24} />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    description: 'The intelligence core. Analyst extracts obligations and interprets legal jargon into actionable compliance requirements.',
    features: [
      'Extracts specific legal obligations',
      'Identifies critical deadlines & milestones',
      'Determines organizational impact',
      'Generates compliance action plans'
    ]
  },
  {
    name: 'MAP Engine',
    icon: <Target size={24} />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'The orchestrator. MAP turns obligations into measurable action points, assigning ownership and tracking progress.',
    features: [
      'Creates measurable action points (MAPs)',
      'Prioritizes tasks based on risk weight',
      'Assigns ownership to specific departments',
      'Tracks implementation progress in real-time'
    ]
  },
  {
    name: 'Conflict Engine',
    icon: <Zap size={24} />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    description: 'The risk detector. Using semantic search, it identifies contradictions between new regulations and existing internal policies.',
    features: [
      'Performs cross-regulation semantic search',
      'Detects contradictions and overlaps',
      'Finds gaps in internal policy coverage',
      'Prevents compliance conflicts before they occur'
    ]
  },
  {
    name: 'Validation Agent',
    icon: <ShieldCheck size={24} />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    description: 'The auditor. Validation verifies that implemented controls actually meet the regulatory requirement and generates evidence.',
    features: [
      'Tests implementation against obligations',
      'Verifies control effectiveness',
      'Generates immutable audit evidence',
      'Maintains end-to-end regulatory audit trails'
    ]
  },
];

export default function AgentEcosystem() {
  return (
    <section id="agents" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Autonomous Agent Ecosystem</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            A coordinated swarm of AI agents, each specialized in a specific stage of the regulatory lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={cn(
                "p-8 rounded-3xl border glass-card-hover transition-all duration-300",
                agent.border
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all",
                agent.bg,
                agent.color
              )}>
                {agent.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{agent.name}</h3>
              <p className="text-gray-400 leading-relaxed mb-8 font-medium">
                {agent.description}
              </p>

              <ul className="space-y-3">
                {agent.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className={cn("mt-0.5 shrink-0", agent.color)} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: agents.length * 0.1 }}
            className="p-8 rounded-3xl bg-emerald-500 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-emerald-400 transition-all"
          >
            <h3 className="text-2xl font-black text-black mb-4">Ready to Automate?</h3>
            <p className="text-black/80 font-bold mb-8">Join the future of regulatory intelligence.</p>
            <div className="px-6 py-3 rounded-full bg-black text-white font-bold group-hover:scale-105 transition-transform">
              Request Access
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

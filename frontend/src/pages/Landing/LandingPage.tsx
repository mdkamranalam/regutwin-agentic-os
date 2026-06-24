import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, BrainCircuit, Zap, ArrowRight, Activity, Code, Server, Lock } from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ReguTwin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              to="/dashboard" 
              className="px-5 py-2.5 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-24 pb-20 md:pt-32 md:pb-28 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase">ReguTwin Agentic OS v1.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
              Automate Regulatory <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
                Compliance Intelligence
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              The first multi-agent operating system designed for enterprise compliance. 
              Watchman, Analyst, and Conflict Engine agents orchestrate your regulatory posture in real-time.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)]"
              >
                Launch Dashboard <ArrowRight size={18} />
              </Link>
              <Link 
                to="/auth/login" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Book Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Dashboard Preview (Abstract) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 rounded-3xl blur opacity-20" />
          <div className="relative rounded-2xl glass-panel p-2">
            <div className="rounded-xl overflow-hidden bg-[#09090b] border border-white/5 aspect-[16/9] flex flex-col">
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="relative z-10 text-center">
                  <Activity size={48} className="mx-auto text-indigo-400 mb-4 opacity-50" />
                  <p className="text-gray-500 font-medium">Interactive Dashboard Interface</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features / Agents Section */}
        <div className="py-24 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Agentic Workflows</h2>
            <p className="text-gray-400">A sophisticated ecosystem of autonomous AI agents working in concert.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Eye className="text-cyan-400" />}
              title="Watchman Agent"
              description="Continuously monitors external regulatory bodies and detects new compliance documents."
            />
            <FeatureCard 
              icon={<BrainCircuit className="text-indigo-400" />}
              title="Analyst Agent"
              description="Extracts obligations, deadlines, and impacts using advanced NLP and stores them in ChromaDB."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-400" />}
              title="Conflict Engine"
              description="Identifies overlaps and contradictions between new regulations and existing internal policies."
            />
          </div>
        </div>

        {/* Technical Footer */}
        <footer className="border-t border-white/10 py-12 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck size={20} className="text-gray-400" />
            <span className="font-semibold text-gray-400">ReguTwin OS</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><Code size={14} /> React + Node</span>
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><Server size={14} /> LangGraph</span>
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer"><Lock size={14} /> SOC2 Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card-hover p-8 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

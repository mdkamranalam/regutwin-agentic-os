import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, BrainCircuit, Zap, ArrowRight, Code, Server, Lock } from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 font-sans flex flex-col">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#09090b] to-[#09090b]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex-1 flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-white/10 transition-all">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ReguTwin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-12 pb-10 md:pt-20 md:pb-16 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">ReguTwin OS v1.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white text-balance">
              Automate Regulatory <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">Compliance Intelligence</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-base md:text-lg text-gray-400 font-medium mb-8 max-w-2xl mx-auto leading-relaxed text-balance">
              The first multi-agent operating system designed for enterprise compliance. 
              Watchman, Analyst, and Conflict Engine agents orchestrate your regulatory posture in real-time.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Launch Dashboard <ArrowRight size={18} />
              </Link>
              <Link 
                to="/auth/login" 
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Book Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* High-Fidelity Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto w-full mb-16 md:mb-24"
        >
          {/* Main Dashboard Frame */}
          <div className="relative rounded-2xl p-1 border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-2xl opacity-50" />
            <div className="rounded-xl overflow-hidden bg-[#09090b] relative border border-white/5">
              {/* Browser-like top bar */}
              <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <img 
                src="/dashboard-mockup.png" 
                alt="ReguTwin Dashboard UI Preview" 
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300 block"
              />
            </div>
          </div>
        </motion.div>

        {/* Features / Agents Section */}
        <div className="py-12 md:py-20 border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Powered by Agentic Workflows</h2>
            <p className="text-gray-400 font-medium">A sophisticated ecosystem of autonomous AI agents working in concert.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Eye className="text-cyan-400" size={24} />}
              title="Watchman Agent"
              description="Continuously monitors external regulatory bodies and detects new compliance documents."
            />
            <FeatureCard 
              icon={<BrainCircuit className="text-indigo-400" size={24} />}
              title="Analyst Agent"
              description="Extracts obligations, deadlines, and impacts using advanced NLP and stores them in ChromaDB."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-400" size={24} />}
              title="Conflict Engine"
              description="Identifies overlaps and contradictions between new regulations and existing internal policies."
            />
          </div>
        </div>

        {/* Technical Footer */}
        <footer className="mt-auto border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck size={18} className="text-gray-400" />
            <span className="font-bold text-gray-300">ReguTwin OS</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"><Code size={16} /> React + Node</span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"><Server size={16} /> LangGraph</span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"><Lock size={16} /> SOC2 Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 md:p-8 flex flex-col h-full bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}

import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, BrainCircuit, Zap, ArrowRight, Code, Server, Lock } from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-hero-glow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 transition-all">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white group-hover:text-gray-200 transition-colors">ReguTwin</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-16 pb-12 md:pt-24 md:pb-16 text-center mx-auto flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center w-full">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">ReguTwin OS v1.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-[64px] font-extrabold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm max-w-5xl text-center">
              Automate Regulatory <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400">
                Compliance Intelligence
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed text-center">
              The first multi-agent operating system designed for enterprise compliance. 
              Watchman, Analyst, and Conflict Engine agents orchestrate your regulatory posture in real-time.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Launch Dashboard <ArrowRight size={16} />
              </Link>
              <Link 
                to="/auth/login" 
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Book Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* High-Fidelity Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto group perspective-[2000px] mb-20 md:mb-32"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          
          {/* Main Dashboard Frame with Perspective Tilt */}
          <motion.div 
            whileHover={{ rotateX: 2, rotateY: -1, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            className="relative rounded-[20px] p-1.5 border border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm transform-gpu"
          >
            <div className="rounded-[14px] overflow-hidden bg-[#09090b] border border-white/5 relative">
              <img 
                src="/dashboard-mockup.png" 
                alt="ReguTwin Dashboard UI Preview" 
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
              {/* Overlay reflection for glass effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>

        {/* Features / Agents Section */}
        <div className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Powered by Agentic Workflows</h2>
            <p className="text-gray-400 font-medium">A sophisticated ecosystem of autonomous AI agents working in concert.</p>
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
            <ShieldCheck size={18} className="text-gray-400" />
            <span className="font-semibold text-gray-300">ReguTwin OS</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span className="flex items-center gap-1.5 hover:text-gray-300 cursor-pointer transition-colors"><Code size={14} /> React + Node</span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 cursor-pointer transition-colors"><Server size={14} /> LangGraph</span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 cursor-pointer transition-colors"><Lock size={14} /> SOC2 Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card-hover p-8 group flex flex-col h-full bg-white/[0.02] border border-white/10 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}

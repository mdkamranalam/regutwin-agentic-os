import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, BrainCircuit, Zap, ArrowRight, Code, Server, Lock, BarChart3, ListTodo, FileText } from 'lucide-react';

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
        <div className="pt-24 pb-20 md:pt-32 md:pb-28 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">ReguTwin OS v1.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              Automate Regulatory <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">
                Compliance Intelligence
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-gray-400 font-normal mb-10 max-w-2xl mx-auto leading-relaxed">
              The first multi-agent operating system designed for enterprise compliance. 
              Watchman, Analyst, and Conflict Engine agents orchestrate your regulatory posture in real-time.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          className="relative max-w-5xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-3xl blur-2xl opacity-50" />
          
          {/* Main Dashboard Frame */}
          <div className="relative rounded-2xl glass-panel p-1 border border-white/10 shadow-2xl bg-black/40">
            <div className="rounded-xl overflow-hidden bg-[#09090b] border border-white/5 flex flex-col h-[500px]">
              
              {/* Window Controls & Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/5 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex gap-2">
                  <div className="w-24 h-5 rounded bg-white/5 border border-white/10" />
                  <div className="w-8 h-5 rounded bg-indigo-500/20 border border-indigo-500/30" />
                </div>
              </div>

              {/* Dashboard Content Area */}
              <div className="flex flex-1 overflow-hidden relative">
                {/* Miniature Sidebar */}
                <div className="w-48 border-r border-white/5 p-4 flex flex-col gap-4 hidden sm:flex bg-black/20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-500" />
                    <div className="w-20 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="w-full h-8 bg-white/10 rounded border border-white/5" />
                  <div className="w-3/4 h-8 bg-white/5 rounded" />
                  <div className="w-5/6 h-8 bg-white/5 rounded" />
                  <div className="w-full h-8 bg-white/5 rounded" />
                </div>

                {/* Miniature Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6 bg-gradient-to-b from-transparent to-indigo-900/10">
                  
                  {/* Top Stats Row */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl" />
                      <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center"><BarChart3 size={14} className="text-indigo-400" /></div>
                      <div>
                        <div className="w-16 h-3 bg-gray-500/50 rounded mb-2" />
                        <div className="w-24 h-6 bg-white/80 rounded" />
                      </div>
                    </div>
                    <div className="flex-1 h-24 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between hidden md:flex">
                      <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center"><ListTodo size={14} className="text-emerald-400" /></div>
                      <div>
                        <div className="w-16 h-3 bg-gray-500/50 rounded mb-2" />
                        <div className="w-12 h-6 bg-white/80 rounded" />
                      </div>
                    </div>
                    <div className="flex-1 h-24 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between hidden lg:flex">
                      <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center"><FileText size={14} className="text-amber-400" /></div>
                      <div>
                        <div className="w-16 h-3 bg-gray-500/50 rounded mb-2" />
                        <div className="w-16 h-6 bg-white/80 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Main Grid Area */}
                  <div className="flex gap-6 flex-1">
                    {/* Main Chart Area */}
                    <div className="flex-[2] border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col">
                      <div className="w-32 h-4 bg-white/20 rounded mb-6" />
                      {/* CSS Abstract Chart */}
                      <div className="flex-1 flex items-end gap-2 px-2 pb-2">
                        {[40, 70, 45, 90, 65, 80, 50, 100, 75, 60].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/80 to-cyan-400/80 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    {/* Activity Feed Area */}
                    <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col gap-4 hidden sm:flex">
                      <div className="w-24 h-4 bg-white/20 rounded mb-2" />
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                          <div className="flex flex-col gap-2 w-full pt-1">
                            <div className="w-full h-2 bg-white/20 rounded" />
                            <div className="w-2/3 h-2 bg-white/10 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Features / Agents Section */}
        <div className="py-24 md:py-32">
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
    <div className="glass-card-hover p-8 group flex flex-col">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  BrainCircuit,
  Zap,
  ArrowRight,
  CheckCircle2,
  Database,
  Server,
  Lock,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-emerald-500/10 blur-[180px]" />
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">ReguTwin</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
          <a href="#architecture" className="hover:text-white transition-colors duration-200">Pipeline</a>
          <a href="#agents" className="hover:text-white transition-colors duration-200">Agents</a>
          <a href="#dashboard" className="hover:text-white transition-colors duration-200">Dashboard</a>
          <a href="#metrics" className="hover:text-white transition-colors duration-200">Metrics</a>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/auth/login"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Login
          </Link>

          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl btn-premium-glow text-sm font-bold shadow-md"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-300">
              ReguTwin OS v1.0
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.95]">
            Autonomous
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Regulatory Intelligence
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-8 text-zinc-400 text-base md:text-lg leading-relaxed">
            Transform compliance operations with autonomous agents that monitor
            regulations, analyze obligations, detect conflicts, validate
            implementation, and maintain audit-ready governance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl btn-premium-glow font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              Launch Dashboard
              <ArrowRight size={18} />
            </Link>

            <button className="px-8 py-4 rounded-xl btn-premium-secondary font-semibold">
              Book Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-zinc-500 text-xs font-bold uppercase tracking-widest bg-white/[0.01] border border-white/5 rounded-2xl py-6 px-8 backdrop-blur-sm shadow-sm">
          <span>SOC2 Ready</span>
          <span>RBI Monitoring</span>
          <span>SEBI Monitoring</span>
          <span>Audit Trails</span>
          <span>Conflict Detection</span>
          <span>AI Powered</span>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section
        id="dashboard"
        className="max-w-[1300px] mx-auto px-6 pb-32"
      >
        <div className="relative">
          {/* Mockup Underglow */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[85%] h-[75%] bg-gradient-to-r from-cyan-500/10 via-emerald-500/5 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
            <div className="rounded-2xl overflow-hidden border border-white/5">
              <div className="h-12 bg-[#09090b] border-b border-white/5 flex items-center px-5 relative">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>
                <div className="absolute inset-x-0 text-center pointer-events-none">
                  <span className="text-zinc-500 text-xs font-semibold tracking-wider font-mono">regutwin.io/dashboard</span>
                </div>
              </div>

              <img
                src="/dashboard-mockup.png"
                alt="dashboard"
                className="w-full object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Connected Visual Pipeline */}
      <section
        id="architecture"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Regulatory Intelligence Pipeline
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            End-to-end automation from regulation discovery to compliance validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {[
            { step: "01", name: "Watchman", role: "Discovery", desc: "Monitors regulatory portals 24/7", color: "text-emerald-400" },
            { step: "02", name: "Analyst", role: "Extraction", desc: "Parses mandates & obligations", color: "text-cyan-400" },
            { step: "03", name: "Conflict Engine", role: "Collision", desc: "Detects policy contradictions", color: "text-red-400" },
            { step: "04", name: "MAP Engine", role: "Orchestration", desc: "Launches tasks and SLAs", color: "text-indigo-400" },
            { step: "05", name: "Validator", role: "Proof Check", desc: "Verifies compliance evidence", color: "text-amber-400" },
            { step: "06", name: "Dashboard", role: "Governance", desc: "Saves cryptographically to WORM", color: "text-purple-400" },
          ].map((item, idx) => (
            <div
              key={item.name}
              className="relative p-6 rounded-2xl glass-panel hover:border-white/15 transition-all duration-300 flex flex-col justify-between min-h-[170px] group shadow-inner"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">{item.step}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mt-1">{item.role}</p>
                <p className="text-zinc-400 text-xs mt-3 leading-relaxed">{item.desc}</p>
              </div>
              {idx < 5 && (
                <div className="hidden lg:block absolute top-1/2 -right-3.5 transform -translate-y-1/2 z-10 text-zinc-800">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section
        id="agents"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Autonomous AI Agents
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Independent agents working collaboratively within a secure compliance blackboard structure.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <AgentCard
            icon={<Eye size={24} />}
            title="Watchman Agent"
            themeClass="glow-border-emerald"
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
            points={[
              "RBI Monitoring",
              "SEBI Monitoring",
              "PDF Ingestion",
              "Real-time Detection",
            ]}
          />

          <AgentCard
            icon={<BrainCircuit size={24} />}
            title="Analyst Agent"
            themeClass="glow-border-cyan"
            iconBg="bg-cyan-500/10"
            iconColor="text-cyan-400"
            points={[
              "Obligation Extraction",
              "Deadline Analysis",
              "Risk Assessment",
              "MAP Generation",
            ]}
          />

          <AgentCard
            icon={<Zap size={24} />}
            title="Conflict Engine"
            themeClass="glow-border-violet"
            iconBg="bg-violet-500/10"
            iconColor="text-violet-400"
            points={[
              "Vector Search",
              "Policy Matching",
              "Conflict Detection",
              "Risk Alerts",
            ]}
          />
        </div>
      </section>

      {/* Metrics */}
      <section
        id="metrics"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetricCard value="98%" label="Compliance Accuracy" borderGlow="glow-border-emerald" />
          <MetricCard value="24/7" label="Regulation Monitoring" borderGlow="glow-border-cyan" />
          <MetricCard value="75%" label="Manual Effort Reduced" borderGlow="glow-border-violet" />
          <MetricCard value="<5s" label="Detection Time" borderGlow="glow-border-cyan" />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-center text-4xl font-extrabold tracking-tight text-white mb-16">
          Built For Enterprise Scale
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <StackCard
            icon={<Database size={24} />}
            title="Data Layer"
            description="PostgreSQL, MongoDB, ChromaDB"
            iconColor="text-emerald-400"
          />

          <StackCard
            icon={<Server size={24} />}
            title="AI Layer"
            description="LangGraph, Ollama, Agent Workflows"
            iconColor="text-cyan-400"
          />

          <StackCard
            icon={<Lock size={24} />}
            title="Governance"
            description="Audit Trails, Validation, Security"
            iconColor="text-violet-400"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            <span className="font-bold">ReguTwin OS</span>
          </div>

          <div className="flex gap-6 text-zinc-500 text-xs font-semibold mt-4 md:mt-0">
            <span>React</span>
            <span>Node.js</span>
            <span>PostgreSQL</span>
            <span>LangGraph</span>
            <span>ChromaDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({
  icon,
  title,
  points,
  themeClass,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
  themeClass: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className={cn(
      "group p-8 rounded-3xl glass-panel transition-all duration-300",
      themeClass
    )}>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", iconBg, iconColor)}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">{title}</h3>

      <div className="space-y-3.5">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors"
          >
            <CheckCircle2 size={16} className={iconColor} />
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  borderGlow,
}: {
  value: string;
  label: string;
  borderGlow: string;
}) {
  return (
    <div className={cn(
      "rounded-3xl p-8 glass-panel text-center transition-all duration-300 hover:border-white/15",
      borderGlow
    )}>
      <div className="text-5xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">{value}</div>
      <div className="text-zinc-400 text-sm mt-3 font-medium">{label}</div>
    </div>
  );
}

function StackCard({
  icon,
  title,
  description,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
}) {
  return (
    <div className="p-8 rounded-3xl glass-panel hover:border-white/15 transition-all duration-300 group">
      <div className={cn("mb-5 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center", iconColor)}>{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
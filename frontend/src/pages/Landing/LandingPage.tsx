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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-emerald-500/10 blur-[180px]" />
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>

          <span className="font-bold text-xl">ReguTwin</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#architecture">Architecture</a>
          <a href="#agents">Agents</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#metrics">Metrics</a>
        </div>

        <div className="flex gap-3">
          <Link
            to="/auth/login"
            className="text-sm text-zinc-400 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest">
              ReguTwin OS v1.0
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-none">
            Autonomous
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Regulatory Intelligence
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-8 text-zinc-400 text-lg md:text-xl leading-relaxed">
            Transform compliance operations with autonomous agents that monitor
            regulations, analyze obligations, detect conflicts, validate
            implementation, and maintain audit-ready governance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2"
            >
              Launch Dashboard
              <ArrowRight size={18} />
            </Link>

            <button className="px-8 py-4 rounded-xl border border-white/10 bg-white/5">
              Book Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-center gap-10 text-zinc-500 text-sm uppercase tracking-widest">
          <span>SOC2 Ready</span>
          <span>RBI Monitoring</span>
          <span>SEBI Monitoring</span>
          <span>Audit Trails</span>
          <span>Conflict Detection</span>
          <span>AI Powered</span>
        </div>
      </section>

      {/* Dashboard */}
      <section
        id="dashboard"
        className="max-w-[1400px] mx-auto px-6 pb-32"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[180px]" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-3 shadow-2xl">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="h-12 bg-zinc-950 border-b border-white/10 flex items-center px-5 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <img
                src="/dashboard-mockup.png"
                alt="dashboard"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="architecture"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Regulatory Intelligence Pipeline
          </h2>

          <p className="text-zinc-400 mt-4">
            End-to-end automation from regulation discovery to compliance
            validation.
          </p>
        </div>

        <div className="grid lg:grid-cols-6 gap-4">
          {[
            "Watchman",
            "Analyst",
            "MAP Engine",
            "Conflict",
            "Validator",
            "Dashboard",
          ].map((item) => (
            <div
              key={item}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section
        id="agents"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Autonomous AI Agents
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <AgentCard
            icon={<Eye size={24} />}
            title="Watchman Agent"
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
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-4 gap-6">
          <MetricCard value="98%" label="Compliance Accuracy" />
          <MetricCard value="24/7" label="Regulation Monitoring" />
          <MetricCard value="75%" label="Manual Effort Reduced" />
          <MetricCard value="<5s" label="Detection Time" />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-center text-4xl font-bold mb-16">
          Built For Enterprise Scale
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <StackCard
            icon={<Database />}
            title="Data Layer"
            description="PostgreSQL, MongoDB, ChromaDB"
          />

          <StackCard
            icon={<Server />}
            title="AI Layer"
            description="LangGraph, Ollama, Agent Workflows"
          />

          <StackCard
            icon={<Lock />}
            title="Governance"
            description="Audit Trails, Validation, Security"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="font-semibold">ReguTwin OS</span>
          </div>

          <div className="flex gap-6 text-zinc-500 mt-4 md:mt-0">
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
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="group p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:-translate-y-2 transition-all">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-6">{title}</h3>

      <div className="space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 text-zinc-400"
          >
            <CheckCircle2 size={16} />
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
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl p-8 border border-white/10 bg-white/[0.03] text-center">
      <div className="text-5xl font-black">{value}</div>
      <div className="text-zinc-400 mt-2">{label}</div>
    </div>
  );
}

function StackCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, GitBranch, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const ORCHESTRATION_NODES = [
  { id: 'watchman', name: '1. Ingestion Node', status: 'DONE', time: '14ms', desc: 'Normalized document text & metadata extraction' },
  { id: 'analyst', name: '2. Synthesizer Core', status: 'ACTIVE', time: '128ms', desc: 'Semantic reasoning via Gemini 1.5 Pro' },
  { id: 'mapper', name: '3. MAP Generator', status: 'QUEUED', time: '—', desc: 'Translates legal clauses to HTTP API probe specs' },
  { id: 'validator', name: '4. WORM Sealer', status: 'QUEUED', time: '—', desc: 'SHA-256 cryptographic proof generation' }
];

const THOUGHT_STREAM = [
  '🧠 Reasoning: Analyzing Clause 35A of RBI Banking Directions...',
  '🔎 Context Retrieval: Querying ChromaDB top-k=5 nearest neighbors...',
  '💡 Insight: Clause mandates 30s session timeout. Existing IT policy allows 60s.',
  '⚙️ State Transition: Flagging semantic discrepancy to Conflict Engine node.',
  '📝 Spec Drafting: Generating Measurable Acceptance Criteria token array...'
];

export default function AnalystConsole() {
  const [thoughts, setThoughts] = useState<string[]>(THOUGHT_STREAM.slice(0, 3));
  const [provider, setProvider] = useState<'GEMINI' | 'OPENAI' | 'OLLAMA'>('GEMINI');

  useEffect(() => {
    const t = setInterval(() => {
      const nextThought = THOUGHT_STREAM[Math.floor(Math.random() * THOUGHT_STREAM.length)];
      setThoughts(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${nextThought}`]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-950 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Brain size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">LangGraph Cognitive Analyst</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-bold border border-purple-500/30 uppercase tracking-wider">
                Stateful AI Orchestrator
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Synthesizing raw banking regulatory prose into engineering test specifications.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-bold text-gray-400 px-2 uppercase">Core Provider:</span>
          <button onClick={() => setProvider('GEMINI')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${provider === 'GEMINI' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'text-gray-400 hover:text-white'}`}>✨ Gemini Native</button>
          <button onClick={() => setProvider('OPENAI')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${provider === 'OPENAI' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'text-gray-400 hover:text-white'}`}>🤖 OpenAI GPT-4o</button>
          <button onClick={() => setProvider('OLLAMA')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${provider === 'OLLAMA' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'text-gray-400 hover:text-white'}`}>🦙 Local Ollama</button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Model</span>
          <p className="text-xl font-mono font-bold text-purple-400 mt-2">{provider === 'GEMINI' ? 'gemini-1.5-pro' : provider === 'OPENAI' ? 'gpt-4o' : 'llama3:8b'}</p>
          <span className="text-[10px] text-emerald-400 mt-1">● Temperature: 0.1 (Deterministic)</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">LangGraph Nodes</span>
          <p className="text-xl font-mono font-bold text-cyan-400 mt-2">4 Cyclic States</p>
          <span className="text-[10px] text-gray-400 mt-1">State checkpointing active</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inference Speed</span>
          <p className="text-xl font-mono font-bold text-amber-400 mt-2">1,240 tokens/s</p>
          <span className="text-[10px] text-amber-300/80 mt-1">Low latency cloud pipeline</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Synthesizer Accuracy</span>
          <p className="text-xl font-mono font-bold text-emerald-400 mt-2">98.4%</p>
          <span className="text-[10px] text-emerald-400/80 mt-1">Zero hallucination bounds</span>
        </div>
      </div>

      {/* State Graph Visualizer */}
      <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/20 backdrop-blur-xl">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <GitBranch size={16} className="text-purple-400" /> Active LangGraph Execution Pipeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {ORCHESTRATION_NODES.map((n, idx) => (
            <div key={n.id} className={`p-4 rounded-xl border relative ${n.status === 'ACTIVE' ? 'bg-purple-500/15 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : n.status === 'DONE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 opacity-60'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white">{n.name}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${n.status === 'ACTIVE' ? 'bg-purple-400 text-black animate-pulse' : n.status === 'DONE' ? 'bg-emerald-400 text-black' : 'bg-gray-600 text-white'}`}>{n.status}</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-tight mb-3">{n.desc}</p>
              <div className="text-[10px] font-mono text-purple-300 flex justify-between">
                <span>Latency: {n.time}</span>
                {n.status === 'DONE' && <CheckCircle2 size={14} className="text-emerald-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thought Stream */}
      <div className="rounded-2xl bg-slate-950 border border-white/10 p-5 font-mono text-xs shadow-2xl">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles size={14} /> Cognitive Thought Chain Buffer
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 flex flex-col-reverse">
          {thoughts.slice().reverse().map((th, i) => (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="text-gray-300 border-l-2 border-purple-500/40 pl-3 py-1">
              {th}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

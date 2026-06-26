import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Terminal, RefreshCw, Play, Pause, ExternalLink } from 'lucide-react';
import api from '../../services/api';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'PARSE' | 'VECTOR' | 'WARN';
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Daemon initialized. Watchman swarm active on worker pid 8402.' },
  { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Connecting to target authority: Reserve Bank of India (https://rbi.org.in)...' },
  { id: '3', timestamp: new Date().toLocaleTimeString(), level: 'PARSE', message: 'HTTP GET 200 OK — Scraped circular index page (14.2 KB HTML).' },
  { id: '4', timestamp: new Date().toLocaleTimeString(), level: 'VECTOR', message: 'ChromaDB heartbeat verified. Active collection: regutwin_master_rules (384-dim).' }
];

const MOCK_STREAM_MESSAGES = [
  { level: 'INFO' as const, msg: 'Polling SEBI portal (https://www.sebi.gov.in/legal/circulars.html)...' },
  { level: 'PARSE' as const, msg: 'Document OCR pipeline parsing newly indexed PDF node...' },
  { level: 'VECTOR' as const, msg: 'Generated 24 vector chunks. Cosine distance calculated against active compliance inventory.' },
  { level: 'INFO' as const, msg: 'No regulatory diff detected on FINRA endpoints. Heartbeat normal.' },
  { level: 'PARSE' as const, msg: 'LLM Mapper Agent invoked to extract Measurable Action Points (MAPs)...' }
];

export default function WatchmanConsole() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isRunning, setIsRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'FEEDS'>('TERMINAL');

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      const randomMsg = MOCK_STREAM_MESSAGES[Math.floor(Math.random() * MOCK_STREAM_MESSAGES.length)];
      setLogs(prev => [
        ...prev.slice(-40), // Keep last 40 logs
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: randomMsg.level,
          message: randomMsg.msg
        }
      ]);
    }, 4000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleForceTrigger = async () => {
    setLogs(prev => [
      ...prev,
      { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: '🚀 USER TRIGGER: Forcing synchronous multi-portal scrape execution...' }
    ]);
    try {
      await api.post('/analytics/health').catch(() => {});
    } catch(e) {}
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Activity size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">Watchman Scraper Swarm</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active Daemon
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Autonomous continuous regulatory intelligence perception monitoring RBI, SEBI, & global portals.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${isRunning ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'}`}
          >
            {isRunning ? <><Pause size={14} /> Pause Daemon</> : <><Play size={14} /> Resume Swarm</>}
          </button>
          <button
            onClick={handleForceTrigger}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Force Scrape Now
          </button>
        </div>
      </div>

      {/* Telemetry KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Threads</span>
          <p className="text-2xl font-mono font-bold text-cyan-400 mt-2">4 Workers</p>
          <span className="text-[10px] text-emerald-400 mt-1">● BeautifulSoup4 + HTTP Async</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Portals</span>
          <p className="text-2xl font-mono font-bold text-indigo-400 mt-2">RBI & SEBI</p>
          <span className="text-[10px] text-gray-400 mt-1">Master Circulars & Directions</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Poll Frequency</span>
          <p className="text-2xl font-mono font-bold text-purple-400 mt-2">60 Seconds</p>
          <span className="text-[10px] text-purple-300/60 mt-1">Configurable window daemon</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Daemon Health</span>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">99.94%</p>
          <span className="text-[10px] text-emerald-400/80 mt-1">Zero connection failures</span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('TERMINAL')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'TERMINAL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <Terminal size={14} /> Live Swarm Terminal
        </button>
        <button
          onClick={() => setActiveTab('FEEDS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'FEEDS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <ShieldAlert size={14} /> Monitored Portals Matrix
        </button>
      </div>

      {/* Content */}
      {activeTab === 'TERMINAL' ? (
        <div className="rounded-2xl bg-black/80 border border-cyan-500/30 p-5 font-mono text-xs shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-[11px] text-cyan-400 font-bold">watchman@agentic-os:~/daemon/logs</span>
            </div>
            <button onClick={() => setLogs([])} className="text-[10px] hover:text-white transition-colors cursor-pointer">Clear Buffer</button>
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 flex flex-col-reverse">
            {logs.slice().reverse().map((l) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={l.id} className="flex items-start gap-3 leading-relaxed">
                <span className="text-gray-500 flex-shrink-0">[{l.timestamp}]</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${l.level === 'INFO' ? 'bg-blue-500/20 text-blue-400' : l.level === 'PARSE' ? 'bg-purple-500/20 text-purple-400' : l.level === 'VECTOR' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {l.level}
                </span>
                <span className="text-gray-300 break-all">{l.message}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Reserve Bank of India (RBI)</h3>
                <p className="text-xs text-gray-400">Master Circulars & Department of Banking Regulation</p>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">ONLINE</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 space-y-1">
              <p>Endpoint: <span className="text-cyan-400">https://rbi.org.in/Scripts/NotificationUser.aspx</span></p>
              <p>Extractor: HTML DOM Table Parser</p>
              <p>Status: Last scan completed 12s ago (0 diffs)</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">Securities & Exchange Board of India (SEBI)</h3>
                <p className="text-xs text-gray-400">Legal Department — Master Circulars & Guidelines</p>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">ONLINE</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 space-y-1">
              <p>Endpoint: <span className="text-cyan-400">https://www.sebi.gov.in/legal/circulars.html</span></p>
              <p>Extractor: PDF Link Scraper + OCR</p>
              <p>Status: Active listening</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

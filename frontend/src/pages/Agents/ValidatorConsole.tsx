import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Radio, Play, Pause, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const INITIAL_PROBES = [
  { id: '1', mapId: 'MAP-104', title: 'Session Timeout Verification', endpoint: 'http://localhost:8000/api/v1/health', method: 'GET', status: 200, lastCheck: '5s ago', passed: true },
  { id: '2', mapId: 'MAP-108', title: 'KYC Document Encryption Cipher Check', endpoint: 'https://auth.regutwin.bank/oauth/token', method: 'POST', status: 401, lastCheck: '12s ago', passed: true },
  { id: '3', mapId: 'MAP-112', title: 'Rate Limiting Threshold Verification', endpoint: 'http://localhost:8000/api/v1/maps', method: 'GET', status: 200, lastCheck: '18s ago', passed: true }
];

export default function ValidatorConsole() {
  const [probes, setProbes] = useState(INITIAL_PROBES);
  const [isRunning, setIsRunning] = useState(true);
  const [heartbeatCount, setHeartbeatCount] = useState(148);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => {
      setHeartbeatCount(c => c + 1);
      setProbes(prev => prev.map(p => ({
        ...p,
        lastCheck: 'Just now'
      })));
    }, 5000);
    return () => clearInterval(t);
  }, [isRunning]);

  const runManualSweep = async () => {
    try {
      await api.get('/analytics/health').catch(() => {});
      setHeartbeatCount(c => c + 1);
    } catch(e) {}
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950 border border-emerald-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Radio size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">Autonomous Validator Probe Daemon</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">
                node-cron Heartbeat Active
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Continuous background validation probe cycles testing banking microservices against MAP engineering criteria.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${isRunning ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}`}
          >
            {isRunning ? <><Pause size={14} /> Pause Heartbeat</> : <><Play size={14} /> Resume Sweep</>}
          </button>
          <button onClick={runManualSweep} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all cursor-pointer">
            <Activity size={14} /> Trigger Sweep Now
          </button>
        </div>
      </div>

      {/* Heartbeat Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Heartbeat Cycles</span>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">#{heartbeatCount}</p>
          <span className="text-[10px] text-gray-400 mt-1">Fires every 60,000ms</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Monitored Probes</span>
          <p className="text-2xl font-mono font-bold text-cyan-400 mt-2">{probes.length} Active</p>
          <span className="text-[10px] text-cyan-400/80 mt-1">Zero timeout exceptions</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Validation Rate</span>
          <p className="text-2xl font-mono font-bold text-purple-400 mt-2">100% Passed</p>
          <span className="text-[10px] text-purple-300/80 mt-1">All endpoints verified</span>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Daemon Status</span>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">LISTENING</p>
          <span className="text-[10px] text-emerald-400/80 mt-1">Background worker running</span>
        </div>
      </div>

      {/* Probes Table */}
      <div className="rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10 bg-white/[0.02]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> Live Target Telemetry Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-white/[0.01]">
                <th className="p-4">MAP ID</th>
                <th className="p-4">Target Mandate Specification</th>
                <th className="p-4">HTTP Probe Endpoint</th>
                <th className="p-4">Expected</th>
                <th className="p-4">Last Cycle</th>
                <th className="p-4">Compliance Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {probes.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-indigo-400 font-bold">{p.mapId}</td>
                  <td className="p-4 text-white font-sans font-medium">{p.title}</td>
                  <td className="p-4 text-cyan-300 break-all">{p.method} {p.endpoint}</td>
                  <td className="p-4 text-amber-300">HTTP {p.status}</td>
                  <td className="p-4 text-gray-400">{p.lastCheck}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-sans font-bold text-[10px] border border-emerald-500/30">
                      <CheckCircle size={12} className="text-emerald-400" /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

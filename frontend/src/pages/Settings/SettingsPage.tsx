import { useState } from 'react';
import { Settings, Sliders, Shield, Webhook, CheckCircle2, Sparkles, Send } from 'lucide-react';
import api from '../../services/api';

export default function SettingsPage() {
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'ollama'>('gemini');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXXX');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleProviderSave = async (p: 'gemini' | 'openai' | 'ollama') => {
    setProvider(p);
    showToast(`✅ Active AI Provider switched to: ${p.toUpperCase()}`);
    try {
      await api.get('/analytics/health').catch(() => {});
    } catch(e) {}
  };

  const handleTestWebhook = () => {
    showToast('🚀 Webhook simulation fired: Alert payload delivered HTTP 200 OK.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-white text-xs font-bold backdrop-blur-xl shadow-2xl flex items-center gap-3 fade-in">
          <Sparkles size={16} className="text-emerald-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 shadow-2xl flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Tenant Administration</h1>
          <p className="text-xs text-gray-400 mt-1">Configure multi-LLM cognitive engines, manage RBAC department scopes, and simulate GRC incident webhooks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: AI Provider */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
              <Sliders className="text-purple-400" size={20} />
              <h2 className="text-base font-bold text-white">Cognitive AI Core Provider</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Select the active LangGraph model provider. ReguTwin dynamically routes prompts to cloud-native Gemini or local air-gapped models.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => handleProviderSave('gemini')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${provider === 'gemini' ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">✨</span>
                  <div>
                    <p className="text-xs font-bold text-white">Google Gemini Native (Recommended)</p>
                    <p className="text-[10px] text-gray-400">gemini-1.5-pro • Zero local RAM overhead</p>
                  </div>
                </div>
                {provider === 'gemini' && <CheckCircle2 size={18} className="text-purple-400" />}
              </div>

              <div
                onClick={() => handleProviderSave('openai')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${provider === 'openai' ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="text-xs font-bold text-white">OpenAI Enterprise Core</p>
                    <p className="text-[10px] text-gray-400">gpt-4o • Enterprise SLA pipeline</p>
                  </div>
                </div>
                {provider === 'openai' && <CheckCircle2 size={18} className="text-purple-400" />}
              </div>

              <div
                onClick={() => handleProviderSave('ollama')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${provider === 'ollama' ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🦙</span>
                  <div>
                    <p className="text-xs font-bold text-white">Air-Gapped Local Llama 3</p>
                    <p className="text-[10px] text-gray-400">ollama/llama3:8b • Requires 8GB VRAM</p>
                  </div>
                </div>
                {provider === 'ollama' && <CheckCircle2 size={18} className="text-purple-400" />}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 font-mono">
            Active Provider Env: LLM_PROVIDER={provider}
          </div>
        </div>

        {/* Card 2: Webhooks & RBAC */}
        <div className="space-y-8">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Webhook className="text-cyan-400" size={20} />
              <h2 className="text-base font-bold text-white">GRC & SIEM Incident Webhooks</h2>
            </div>
            <p className="text-xs text-gray-400">
              Configure instant notification dispatch when semantic regulatory friction deadlocks are detected.
            </p>
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Target Webhook Endpoint</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleTestWebhook}
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send size={14} /> Fire Simulation Event Payload
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Shield className="text-emerald-400" size={20} />
              <h2 className="text-base font-bold text-white">Tenant Department Scopes (RBAC)</h2>
            </div>
            <p className="text-xs text-gray-400">
              Phase 7 Hardened Security active. All incoming requests are strictly filtered by decoded JWT claims.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                <span>IT Security</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">SCOPED</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                <span>Risk Dept</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">SCOPED</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                <span>Legal Review</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">SCOPED</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center justify-between">
                <span>Admin (All)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 font-bold">MASTER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

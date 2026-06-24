import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import HumanApprovalQueue from '../../components/HumanApprovalQueue';
import { KPICard, RadialKPICard } from '../../components/dashboard/KPICard';
import { InsightsPanel } from '../../components/dashboard/InsightsPanel';
import { AIPipeline } from '../../components/dashboard/AIPipeline';
import { AlertCircle, FileText, CheckCircle2, RefreshCw, Layers, Bell, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '../../utils/cn';

interface HealthMetrics {
  healthScore: number;
  metrics: {
    total: number;
    open: number;
    inProgress: number;
    inReview: number;
    closed: number;
  };
}

export default function ExecutiveDashboard() {
  const [data, setData] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/analytics/health');
        setData(response.data);
      } catch (error) {
        console.error('Failed to load health metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-gray-400 text-sm font-medium animate-pulse">Initializing Dashboard...</span>
        </div>
      </div>
    );
  }

  const safeData = data || {
    healthScore: 85,
    metrics: { total: 124, open: 12, inProgress: 45, inReview: 18, closed: 49 }
  };

  const trendData = [
    { day: 'Mon', risk: 45, compliance: 80 },
    { day: 'Tue', risk: 42, compliance: 82 },
    { day: 'Wed', risk: 50, compliance: 75 },
    { day: 'Thu', risk: 38, compliance: 85 },
    { day: 'Fri', risk: 30, compliance: 88 },
    { day: 'Sat', risk: 28, compliance: 90 },
    { day: 'Sun', risk: 25, compliance: 92 },
  ];

  const impactData = [
    { name: 'Data Privacy', value: 35 },
    { name: 'AML/KYC', value: 45 },
    { name: 'Capital Markets', value: 10 },
    { name: 'Consumer Prot.', value: 10 },
  ];
  const PIE_COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B'];

  const activityFeed = [
    { id: 1, event: 'Regulation uploaded', detail: 'RBI Digital Lending Guidelines 2026', time: '2m ago', type: 'upload', icon: FileText },
    { id: 2, event: 'Conflict detected', detail: 'RBI 2026 vs SEBI Risk Weighting', time: '15m ago', type: 'conflict', icon: AlertCircle },
    { id: 3, event: 'Review completed', detail: 'MAP-2024-008 finalized', time: '1h ago', type: 'success', icon: CheckCircle2 },
    { id: 4, event: 'Audit logged', detail: 'Quarterly compliance snapshot taken', time: '3h ago', type: 'audit', icon: ShieldCheck },
  ];

  const deadlines = [
    { id: 1, task: 'SEBI Reporting', date: 'Tomorrow, 5:00 PM', priority: 'Critical' },
    { id: 2, task: 'AML Audit Response', date: 'June 28, 2026', priority: 'High' },
    { id: 3, task: 'Quarterly Risk Review', date: 'July 02, 2026', priority: 'Medium' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
              Live System
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Executive Compliance Dashboard</h1>
          <p className="text-sm text-gray-400 font-medium">
            Real-time regulatory intelligence and risk orchestration for <span className="text-white font-bold">Global Bank Inc</span>
          </p>
        </div>
        <div className="flex items-center gap-6 p-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Last Sync</p>
            <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5 justify-end">
              <RefreshCw size={12} className="text-emerald-500" /> Just now
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Regs</p>
            <p className="text-xs text-white font-bold">14,209</p>
          </div>
        </div>
      </div>

      {/* Top Section: Insights & Radial Score */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <InsightsPanel />
        </div>
        <RadialKPICard score={safeData.healthScore} previousScore={82} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active MAPs"
          value={safeData.metrics.total}
          icon={<Layers />}
          trend={12}
          trendLabel="from last week"
          colorTheme="blue"
          sparklineData={[40, 42, 38, 45, 43, 48, 46]}
        />
        <KPICard
          title="Open Critical Issues"
          value={safeData.metrics.open}
          icon={<AlertCircle />}
          trend={-5}
          trendLabel="from yesterday"
          colorTheme="red"
          sparklineData={[20, 18, 22, 15, 12, 14, 12]}
        />
        <KPICard
          title="In Review"
          value={safeData.metrics.inReview}
          icon={<FileText />}
          colorTheme="amber"
          sparklineData={[10, 15, 12, 18, 15, 20, 18]}
        />
        <KPICard
          title="Completed Maps"
          value={safeData.metrics.closed}
          icon={<CheckCircle2 />}
          trend={8}
          trendLabel="from last week"
          colorTheme="emerald"
          sparklineData={[30, 35, 32, 40, 38, 45, 49]}
        />
      </div>

      {/* Agentic Pipeline */}
      <AIPipeline />

      {/* Middle Section: Charts and Enterprise Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Compliance vs Risk Trend</h3>
              <p className="text-xs text-gray-400 mt-1">7-day historical performance</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Compliance
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-red-500" /> Risk
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="compliance" name="Compliance %" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
                <Area type="monotone" dataKey="risk" name="Risk Exposure" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Overview Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white tracking-tight">Risk Distribution</h3>
            <p className="text-xs text-gray-400 mt-1">Criticality breakdown</p>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { label: 'Critical', value: '12', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/20', pct: '15%' },
              { label: 'High', value: '24', color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', pct: '30%' },
              { label: 'Medium', value: '45', color: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20', pct: '40%' },
              { label: 'Low', value: '43', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', pct: '15%' },
            ].map((risk) => (
              <div key={risk.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', risk.color)} />
                  <span className="text-sm font-medium text-gray-300">{risk.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{risk.value}</span>
                  <span className={cn('text-[10px] font-bold', risk.text)}>{risk.pct}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500">Audit Readiness</span>
            <span className="text-xs font-bold text-emerald-400">94% Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Impact Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border_white/10">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white tracking-tight">Sector Impact</h3>
            <p className="text-xs text-gray-400 mt-1">Obligation distribution</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impactData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value" stroke="none"
                >
                  {impactData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '13px', color: '#fff' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle"
                  formatter={(value) => <span className="text-xs text-gray-400 ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Activity Feed</h3>
              <p className="text-xs text-gray-400 mt-1">Latest system events</p>
            </div>
            <Bell size={16} className="text-gray-500" />
          </div>
          <div className="space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                  item.type === 'upload' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                  item.type === 'conflict' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  item.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                )}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-white truncate">{item.event}</p>
                    <span className="text-[10px] text-gray-500 font-medium">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Upcoming Deadlines</h3>
              <p className="text-xs text-gray-400 mt-1">Action required items</p>
            </div>
            <Calendar size={16} className="text-gray-500" />
          </div>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white">{d.task}</p>
                    <p className="text-[10px] text-gray-500">{d.date}</p>
                  </div>
                </div>
                <span className={cn(
                  'text-[9px] font-black uppercase px-2 py-0.5 rounded border',
                  d.priority === 'Critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  d.priority === 'High' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-blue-400 bg-blue-500/10 border-blue-500/20'
                )}>
                  {d.priority}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors border-t border-white/5 pt-4">
            View Full Compliance Calendar
          </button>
        </div>
      </div>

      {/* Human Approval Queue */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <HumanApprovalQueue />
      </div>
    </motion.div>
  );
}

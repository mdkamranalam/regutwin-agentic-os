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
  activeRegulationsCount: number;
  metrics: {
    total: number;
    open: number;
    inProgress: number;
    inReview: number;
    closed: number;
    overdue: number;
  };
}

export default function ExecutiveDashboard() {
  const [data, setData] = useState<HealthMetrics | null>(null);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [velocityList, setVelocityList] = useState<any[]>([]);
  const [riskTrend, setRiskTrend] = useState<any[]>([]);
  const [sectorImpact, setSectorImpact] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningDemo, setRunningDemo] = useState(false);

  const handleRunDemo = async () => {
    setRunningDemo(true);
    try {
      const res = await api.post('/demo/seed');
      alert(res.data?.message || 'Demo seeding complete.');
      fetchHealth();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Ensure DEMO_MODE=true in backend .env.');
    } finally {
      setRunningDemo(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const [healthRes, deadRes, trendRes, riskRes, sectorRes, activityRes] = await Promise.all([
        api.get('/analytics/health'),
        api.get('/analytics/upcoming-deadlines').catch(() => ({ data: [] })),
        api.get('/analytics/trends').catch(() => ({ data: [] })),
        api.get('/analytics/risk-trends').catch(() => ({ data: [] })),
        api.get('/analytics/sector-impact').catch(() => ({ data: [] })),
        api.get('/analytics/recent-activities').catch(() => ({ data: [] }))
      ]);
      setData(healthRes.data);
      setUpcomingList(deadRes.data || []);
      setVelocityList(trendRes.data || []);
      setRiskTrend(riskRes.data || []);
      setSectorImpact(sectorRes.data || []);
      setActivities(activityRes.data || []);
    } catch (error) {
      console.error('Failed to load health metrics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
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
    healthScore: 100,
    activeRegulationsCount: 0,
    metrics: { total: 0, open: 0, inProgress: 0, inReview: 0, closed: 0, overdue: 0 }
  };

  const activeTrendData = riskTrend.length > 0 ? riskTrend : [];
  const activeImpactData = sectorImpact.length > 0 ? sectorImpact : [];

  const PIE_COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'];

  const typeIcons: Record<string, any> = {
    upload: FileText,
    conflict: AlertCircle,
    success: CheckCircle2,
    audit: ShieldCheck
  };

  const activeDeadlines = upcomingList.length > 0
    ? upcomingList.slice(0, 3).map(u => ({
        id: u._id,
        task: u.actionRequired,
        date: u.deadline ? new Date(u.deadline).toLocaleDateString() : 'No specific deadline',
        priority: u.assignedTo === 'Risk' ? 'Critical' : u.assignedTo === 'IT Security' ? 'High' : 'Medium'
      }))
    : [];

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
              <RefreshCw size={12} className="text-emerald-500 animate-spin" /> Just now
            </p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Regs</p>
            <p className="text-xs text-white font-bold">{safeData.activeRegulationsCount ?? 0}</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button
            onClick={handleRunDemo}
            disabled={runningDemo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={runningDemo ? 'animate-spin' : ''} />
            <span>{runningDemo ? 'Seeding Hackathon Demo...' : '🚀 Seed Hackathon Demo'}</span>
          </button>
        </div>
      </div>

      {/* Self-Guiding Demo Banner — only shown when the DB is fresh/empty */}
      {safeData.activeRegulationsCount === 0 && !runningDemo && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 text-xl">
              🚀
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">Ready to Demo? Seed the Hackathon Pipeline</p>
              <p className="text-xs text-gray-400 mt-0.5 max-w-lg">
                Click <span className="text-emerald-400 font-bold">🚀 Seed Hackathon Demo</span> (top right) to instantly ingest 3 live RBI &amp; SEBI regulations,
                trigger the full AI agent swarm, generate Measurable Action Points, and surface a
                <span className="text-red-400 font-bold"> Critical Regulatory Conflict</span> between RBI's 30s and SEBI's 60s session timeout mandates.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">DEMO_MODE=ON</span>
          </div>
        </div>
      )}

      {/* Phase 11 SLA Breach Ticker Banner */}
      {((safeData.metrics as any).overdue > 0) && (
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/30 flex items-center justify-between text-red-400 animate-alert-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 animate-bounce" />
            <div>
              <p className="text-sm font-extrabold text-white">🚨 SLA Breach Escalation Warning: {(safeData.metrics as any).overdue} Task(s) Overdue</p>
              <p className="text-xs text-red-300/70 mt-0.5">Critical compliance deadlines breached. Tasks weighted with 3× penalty drop on enterprise health score.</p>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-red-500 text-black shadow-md">Action Required</span>
        </div>
      )}

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
        <div className="lg:col-span-2 glass-panel p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Compliance vs Risk Trend</h3>
              <p className="text-xs text-zinc-400 mt-1">7-day historical performance</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Compliance
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Risk
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="compliance" name="Compliance %" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorComp)" />
                <Area type="monotone" dataKey="risk" name="Risk Exposure" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phase 13 Longitudinal Compliance Memory & Velocity Widget */}
        <div className="lg:col-span-3 glass-panel p-6 bg-gradient-to-r from-indigo-950/10 to-zinc-900/30 shadow-lg">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono uppercase font-bold tracking-wider">Phase 13 Active</span>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">🧠 Longitudinal Compliance Memory</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Autonomous AI memory curve demonstrating learning & closure velocity acceleration across historical audits</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Current Avg Closure Time</span>
              <p className="text-lg font-black text-emerald-400">6.1 Days <span className="text-[10px] text-emerald-500 font-mono">(-66% vs Jan)</span></p>
            </div>
          </div>
          <div className="h-48 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityList.length > 0 ? velocityList : [
                { month: "Jan", avgDaysToClose: 18.2, closureRate: 72 },
                { month: "Feb", avgDaysToClose: 14.5, closureRate: 81 },
                { month: "Mar", avgDaysToClose: 11.0, closureRate: 88 },
                { month: "Apr", avgDaysToClose: 8.4,  closureRate: 94 },
                { month: "May", avgDaysToClose: 6.1,  closureRate: 98 }
              ]}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#818cf8', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#818cf8', fontWeight: 500 }} unit="d" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="avgDaysToClose" name="Avg Resolution (Days)" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Overview Widget */}
        <div className="glass-panel p-6 flex flex-col shadow-lg">
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-white tracking-tight">Risk Distribution</h3>
            <p className="text-xs text-zinc-400 mt-1">Criticality breakdown</p>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { label: 'Critical', value: '12', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/20', pct: '15%' },
              { label: 'High', value: '24', color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', pct: '30%' },
              { label: 'Medium', value: '45', color: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20', pct: '40%' },
              { label: 'Low', value: '43', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', pct: '15%' },
            ].map((risk) => (
              <div key={risk.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2.5 h-2.5 rounded-full shadow-sm', risk.color)} />
                  <span className="text-xs font-semibold text-zinc-300">{risk.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{risk.value}</span>
                  <span className={cn('text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5', risk.text)}>{risk.pct}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Audit Readiness</span>
            <span className="text-xs font-bold text-emerald-400">94% Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Impact Distribution */}
        <div className="glass-panel p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white tracking-tight">Sector Impact</h3>
            <p className="text-xs text-zinc-400 mt-1">Obligation distribution</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeImpactData}
                  cx="50%" cy="40%"
                  innerRadius={60} outerRadius={76}
                  paddingAngle={5} dataKey="value" stroke="none"
                >
                  {activeImpactData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-zinc-400 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Activity Feed</h3>
              <p className="text-xs text-zinc-400 mt-1">Latest system events</p>
            </div>
            <Bell size={16} className="text-zinc-500" />
          </div>
          <div className="space-y-3.5 max-h-[250px] overflow-y-auto hide-scrollbar">
            {activities.map((item) => {
              const IconComponent = typeIcons[item.type] || ShieldCheck;
              return (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-200 group cursor-pointer">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-inner',
                    item.type === 'upload' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                    item.type === 'conflict' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    item.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  )}>
                    <IconComponent size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{item.event}</p>
                      <span className="text-[10px] text-zinc-500 font-mono font-medium">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-panel p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Upcoming Deadlines</h3>
              <p className="text-xs text-zinc-400 mt-1">Action required items</p>
            </div>
            <Calendar size={16} className="text-zinc-500" />
          </div>
          <div className="space-y-3">
            {activeDeadlines.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:border-white/10 hover:bg-white/[0.02] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">{d.task}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{d.date}</p>
                  </div>
                </div>
                <span className={cn(
                  'text-[9px] font-black uppercase px-2 py-0.5 rounded border shadow-sm',
                  d.priority === 'Critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  d.priority === 'High' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-blue-400 bg-blue-500/10 border-blue-500/20'
                )}>
                  {d.priority}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors border-t border-white/5 pt-4">
            View Full Compliance Calendar
          </button>
        </div>
      </div>

      {/* Human Approval Queue */}
      <div className="glass-panel overflow-hidden shadow-lg">
        <HumanApprovalQueue />
      </div>
    </motion.div>
  );
}

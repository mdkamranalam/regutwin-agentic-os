import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import HumanApprovalQueue from '../../components/HumanApprovalQueue';
import { KPICard, RadialKPICard } from '../../components/dashboard/KPICard';
import { InsightsPanel } from '../../components/dashboard/InsightsPanel';
import { AIPipeline } from '../../components/dashboard/AIPipeline';
import { AlertCircle, FileText, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

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

  // Fallback for demo purposes if backend fails
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Compliance Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Real-time regulatory intelligence and risk orchestration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Last Sync</p>
            <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
              <RefreshCw size={12} className="text-emerald-500" /> Just now
            </p>
          </div>
          <div className="h-8 w-px bg-white/10 mx-2" />
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
        />
        <KPICard 
          title="Open Critical Issues" 
          value={safeData.metrics.open} 
          icon={<AlertCircle />} 
          trend={-5} 
          trendLabel="from yesterday" 
          colorTheme="red" 
        />
        <KPICard 
          title="In Review" 
          value={safeData.metrics.inReview} 
          icon={<FileText />} 
          colorTheme="amber" 
        />
        <KPICard 
          title="Completed Maps" 
          value={safeData.metrics.closed} 
          icon={<CheckCircle2 />} 
          trend={8} 
          trendLabel="from last week" 
          colorTheme="emerald" 
        />
      </div>

      {/* Agentic Pipeline */}
      <AIPipeline />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance vs Risk Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white">Compliance vs Risk Trend</h3>
            <p className="text-xs text-gray-400 mt-1">7-day historical performance</p>
          </div>
          <div className="h-64">
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

        {/* Impact Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="mb-2">
            <h3 className="text-base font-bold text-white">Regulation Impact Distribution</h3>
            <p className="text-xs text-gray-400 mt-1">Breakdown by operational sector</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impactData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {impactData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '13px', color: '#fff' }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-gray-300 ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Human Approval Queue */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <HumanApprovalQueue />
      </div>

    </motion.div>
  );
}

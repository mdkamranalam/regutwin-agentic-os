import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import NotificationCenter from '../components/NotificationCenter';
import { 
  LayoutDashboard, UploadCloud, Library, ListTodo, ClipboardCheck, 
  Eye, BrainCircuit, Zap, Stethoscope, 
  History, BarChart3, Settings,
  Search, Bot, Activity, ChevronDown, Menu, ShieldCheck
} from 'lucide-react';
import { cn } from '../utils/cn';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Explorer', path: '/explorer', icon: Search },
    ]
  },
  {
    title: 'Compliance Operations',
    items: [
      { label: 'Upload Regulations', path: '/upload', icon: UploadCloud },
      { label: 'Regulations Library', path: '/regulations', icon: Library },
      { label: 'MAP Tasks', path: '/maps', icon: ListTodo },
      { label: 'Reviews', path: '/reviews', icon: ClipboardCheck },
    ]
  },
  {
    title: 'AI Agents',
    items: [
      { label: 'Watchman', path: '/agents/watchman', icon: Eye },
      { label: 'Analyst', path: '/agents/analyst', icon: BrainCircuit },
      { label: 'Conflict Engine', path: '/agents/conflict', icon: Zap },
      { label: 'Validator', path: '/agents/validator', icon: Stethoscope },
    ]
  },
  {
    title: 'Governance',
    items: [
      { label: 'Audit Trail', path: '/audits', icon: History },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
      { label: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-slate-300 bg-[#09090b]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 h-screen flex flex-col w-[260px] z-50 glass-sidebar',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Workspace Switcher */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight tracking-wide truncate">Global Bank Inc</p>
              <p className="text-[10px] font-medium text-emerald-400/80 truncate">Premium Enterprise</p>
            </div>
          </div>
          <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
        </div>

        {/* Search Command Bar */}
        <div className="px-4 py-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 text-xs hover:border-white/20 hover:bg-white/5 transition-all duration-200 group">
            <Search size={14} className="group-hover:text-white transition-colors" />
            <span className="flex-1 text-left">Search commands...</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-400 border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scroll-smooth hide-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 opacity-60">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      )}
                    >
                      <Icon size={16} className={cn(isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white transition-colors')} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group">
            <div className="relative">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8B93&color=fff&rounded=true" alt="User" className="w-9 h-9 rounded-full border border-white/10" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f1115] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate group-hover:text-emerald-400 transition-colors">Sarah Jenkins</p>
              <p className="text-[11px] text-gray-500 truncate">Chief Compliance Officer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 glass-header border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span>Workspace</span>
              <span className="text-gray-600">/</span>
              <span className="text-white font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Phase 12 Multi-Tenancy Role Switcher */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Scope:</span>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  const [role, dept] = val.split(':');
                  localStorage.setItem('user', JSON.stringify({ name: `${dept} Manager`, role, department: dept }));
                  window.dispatchEvent(new Event('tenant_switched'));
                }}
                defaultValue="ADMIN:All"
                className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="ADMIN:All" className="bg-zinc-900 text-white">👑 Admin (All Depts)</option>
                <option value="MANAGER:IT Security" className="bg-zinc-900 text-white">🛡️ IT Security Manager</option>
                <option value="MANAGER:Risk" className="bg-zinc-900 text-white">⚖️ Risk Officer</option>
                <option value="MANAGER:Legal" className="bg-zinc-900 text-white">📜 Legal Counsel</option>
                <option value="COMPLIANCE:Compliance" className="bg-zinc-900 text-white">📋 Compliance Specialist</option>
              </select>
            </div>

            {/* AI Assistant Button */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
              <Bot size={14} />
              Ask AI
            </button>

            {/* System Health */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 cursor-help" title="All Systems Operational">
              <Activity size={14} />
              <span className="hidden sm:inline">99.9% Uptime</span>
            </div>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <NotificationCenter />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

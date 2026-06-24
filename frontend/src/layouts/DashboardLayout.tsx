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
        <div className="p-4 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight tracking-wide">Global Bank Inc</p>
              <p className="text-[10px] font-medium text-emerald-400">Premium Enterprise</p>
            </div>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </div>

        {/* Search Command Bar (Fake) */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 text-xs hover:bg-white/5 transition-colors">
            <Search size={14} />
            <span className="flex-1 text-left">Search commands...</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
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
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      )}
                    >
                      <Icon size={16} className={cn(isActive ? 'text-emerald-400' : 'text-gray-500')} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8B93&color=fff&rounded=true" alt="User" className="w-9 h-9 rounded-full border border-white/10" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">Sarah Jenkins</p>
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

          <div className="flex items-center gap-4">
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

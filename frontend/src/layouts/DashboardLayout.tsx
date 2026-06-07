import { Outlet, Link, useLocation } from 'react-router-dom';

/* ============================================
   DashboardLayout — Light theme sidebar
   ============================================ */

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Upload', path: '/upload', icon: '📄' },
  { label: 'Regulations', path: '/regulations', icon: '📋' },
  { label: 'Validation', path: '/validation', icon: '✅' },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9fc' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] sidebar p-5">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 px-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            R
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>ReguTwin</h1>
            <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
              Agentic OS
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f3f4f6' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
          >
            U
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }} className="truncate">Test User</p>
            <p style={{ fontSize: '11px', color: '#9ca3af' }} className="truncate">test@regutwin.com</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4" style={{ background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
            >
              R
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>ReguTwin</span>
          </Link>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: isActive ? '#f5f3ff' : 'transparent',
                    color: isActive ? '#7c3aed' : '#9ca3af',
                  }}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

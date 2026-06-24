import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Alert {
  id: string;
  department: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    socket.on('new_alert', (alert: Alert) => {
      setAlerts(prev => [{ ...alert, read: false }, ...prev]);
    });
    return () => { socket.disconnect(); };
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  return (
    <div className="relative flex items-center gap-3">
      {/* Connection Status Indicator */}
      <div 
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${
          isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}
        title={isConnected ? "AI Bridge Connected" : "AI Bridge Disconnected"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        {isConnected ? 'Connected' : 'Reconnecting...'}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl transition-colors glass-panel"
        style={{ background: isOpen ? 'rgba(99,102,241,0.15)' : '' }}
        title="Notifications"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.6)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: '#ef4444' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 glass-panel"
            style={{ top: '100%' }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold text-white">Alerts</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#818cf8' }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-2xl mb-2">🔔</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>No alerts yet</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="px-4 py-3 border-b transition-colors"
                    style={{
                      borderColor: 'rgba(255,255,255,0.05)',
                      background: !alert.read ? 'rgba(239,68,68,0.05)' : 'transparent',
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#ef4444' }}>
                        {alert.department}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white mb-0.5">{alert.subject}</p>
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {alert.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

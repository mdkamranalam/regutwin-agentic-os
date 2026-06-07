import { Outlet } from 'react-router-dom';

/* ============================================
   AuthLayout — Split centered card design
   Left panel: ReguTwin Agentic OS mesh gradient
   Right panel: Clean auth form area
   ============================================ */
export default function AuthLayout() {
  return (
    <div className="page-center-wrapper">
      <div className="auth-card">
        {/* Left Gradient Panel */}
        <div className="auth-gradient-panel">
          <div className="auth-gradient-bg" />

          {/* Top brand symbol (white asterisk) */}
          <div className="auth-panel-content">
            <span className="brand-asterisk-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M3.33975 7L20.6603 17" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M3.33975 17L20.6603 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
            </span>
          </div>

          {/* Bottom branding messaging */}
          <div className="auth-panel-content">
            <p className="auth-panel-bottom-text">ReguTwin AI</p>
            <h2 className="auth-panel-title">
              Automate regulatory intelligence & compliance audits with Agentic OS
            </h2>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

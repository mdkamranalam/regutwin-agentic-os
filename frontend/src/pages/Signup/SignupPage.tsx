import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

/* ============================================
   SignupPage — Create an account
   ============================================ */

const DEPARTMENTS = [
  'Compliance',
  'Risk Management',
  'Internal Audit',
  'Legal',
  'Operations',
  'IT & Cybersecurity',
  'Finance',
  'Treasury',
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getStrength = (): number => {
    let s = 0;
    if (password.length >= 4) s++;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strengthLevel = getStrength();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = '/upload';
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Brand logo symbol */}
      <div className="mb-6 flex justify-start fade-in">
        <span className="brand-asterisk-color">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M3.33975 7L20.6603 17" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M3.33975 17L20.6603 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </span>
      </div>

      {/* Heading & Subtitle */}
      <div className="mb-8 fade-in fade-in-delay-1">
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">
          Create your ReguTwin account to track regulatory feeds, analyze compliance circulars, and automate audit readiness.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner mb-5 fade-in">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="fade-in fade-in-delay-2" id="signup-form">
        {/* Name Field */}
        <div className="mb-6">
          <label htmlFor="signup-name" className="form-label">Full name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            className="form-input"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="signup-email" className="form-label">Your email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@bank.com"
            autoComplete="email"
            className="form-input"
            required
          />
        </div>

        {/* Department Select */}
        <div className="mb-6">
          <label htmlFor="signup-department" className="form-label">Department</label>
          <select
            id="signup-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="form-input form-select"
          >
            <option value="">Select department (optional)</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="signup-password" className="form-label">Password</label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="form-input"
              style={{ paddingRight: '40px' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
              style={{ color: '#9ca3af' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
          {/* Password strength indicators */}
          {password.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`strength-bar ${
                    i <= strengthLevel
                      ? strengthLevel <= 1
                        ? 'weak'
                        : strengthLevel <= 2
                          ? 'medium'
                          : 'strong'
                      : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-8">
          <label htmlFor="signup-confirm" className="form-label">Confirm password</label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="form-input"
              style={{ paddingRight: '40px' }}
              required
            />
            {confirmPassword.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {password === confirmPassword ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
          id="signup-submit"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin-custom" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account…
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="divider my-6 fade-in fade-in-delay-3">
        <span className="divider-text">or continue with</span>
      </div>

      {/* Social Buttons */}
      <div className="social-buttons-container fade-in fade-in-delay-3">
        <button type="button" className="social-btn" aria-label="Sign up with Behance">
          <span className="font-extrabold text-[15px] tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Bē</span>
        </button>
        <button type="button" className="social-btn" aria-label="Sign up with Google">
          <span className="social-btn-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </span>
        </button>
        <button type="button" className="social-btn" aria-label="Sign up with Facebook">
          <span className="social-btn-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1f2937"/>
            </svg>
          </span>
        </button>
      </div>

      {/* Footer link */}
      <p className="auth-footer-text mt-6 fade-in fade-in-delay-4">
        Already have an account?{' '}
        <Link to="/auth/login" className="auth-footer-link" id="go-to-login">
          Sign in
        </Link>
      </p>
    </>
  );
}

import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/Login/LoginPage';
import SignupPage from '../pages/Signup/SignupPage';
import UploadPage from '../pages/Upload/UploadPage';

/* ============================================
   Application Routes
   ============================================ */
export const router = createBrowserRouter([
  {
    /* Auth routes — /auth/login, /auth/signup */
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { index: true, element: <Navigate to="login" replace /> },
    ],
  },
  {
    /* Protected routes — /upload, /dashboard, etc. */
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'upload', element: <UploadPage /> },
      { path: 'dashboard', element: <PlaceholderPage title="Dashboard" message="The compliance dashboard will be built here." /> },
      { path: 'regulations', element: <PlaceholderPage title="Regulations" message="Regulation tracking will be built here." /> },
      { path: 'validation', element: <PlaceholderPage title="Validation" message="Validation results will be built here." /> },
      { index: true, element: <Navigate to="upload" replace /> },
    ],
  },
  {
    /* Catch-all redirect */
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);

/* ============================================
   Placeholder Page (for future sections)
   ============================================ */
function PlaceholderPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <svg className="w-8 h-8 text-[var(--color-surface-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-[var(--color-surface-300)] text-sm">{message}</p>
      <p className="text-[var(--color-surface-400)] text-xs mt-4">Coming soon — this section is under development.</p>
    </div>
  );
}

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrandPage } from './pages/BrandPage';
import { KairoMark } from './components/brand/KairoLogo';

const FullScreenLoader: React.FC = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4" role="status">
    <span className="rounded-lg animate-moment">
      <KairoMark size={40} />
    </span>
    <span className="text-[13px] text-slate-500">Opening your workspace…</span>
  </div>
);

// No loader here: sign-in toggles the shared isLoading flag, and unmounting the form would drop its error state
const LoginRoute: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/app" replace /> : <LoginPage />;
};

const WorkspaceRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  return user ? <DashboardPage /> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/app" element={<WorkspaceRoute />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

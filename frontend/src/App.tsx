import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

const FullScreenLoader: React.FC = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    <span className="text-xs font-semibold text-slate-500">Loading HCCDI TaskPilot...</span>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

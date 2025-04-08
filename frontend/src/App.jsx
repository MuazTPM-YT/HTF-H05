import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import AuthLayout from './components/layouts/auth-layout';
import { OnboardingFlow } from './pages/Onboarding';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/dashboard/sidebar';

const DashboardOverview = React.lazy(() => import('./components/dashboard/dashboard-overview'));
const HealthRecords = React.lazy(() => import('./pages/patient-dashboard/health-records'));
const SharingControls = React.lazy(() => import('./pages/patient-dashboard/sharing'));
const SecuritySettings = React.lazy(() => import('./pages/patient-dashboard/security'));
const EmergencyAccess = React.lazy(() => import('./pages/patient-dashboard/emergency'));
const Providers = React.lazy(() => import('./pages/patient-dashboard/providers'));
const Appointments = React.lazy(() => import('./pages/patient-dashboard/appointments'));
const Analytics = React.lazy(() => import('./pages/patient-dashboard/analytics'));
const Profile = React.lazy(() => import('./pages/patient-dashboard/profile'));
const Settings = React.lazy(() => import('./pages/patient-dashboard/settings'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`${collapsed ? 'ml-16' : 'ml-64'} flex-1 transition-all duration-300 ease-in-out`}>
        <header className="bg-white border-b shadow-sm h-16 flex items-center px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">HealthChain</h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
        <footer className="py-4 px-6 border-t text-center text-gray-500 text-sm">
          © 2023 HealthChain. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingFlow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardOverview />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-records"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <HealthRecords />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sharing"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <SharingControls />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <SecuritySettings />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <EmergencyAccess />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Providers />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Appointments />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Analytics />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Profile />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Settings />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

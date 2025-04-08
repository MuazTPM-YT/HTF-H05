import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/dashboard/sidebar';

// Lazy load page components for better performance
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const HealthRecords = React.lazy(() => import('./pages/health-records'));
const SharingControls = React.lazy(() => import('./pages/sharing'));
const SecuritySettings = React.lazy(() => import('./pages/security'));
const EmergencyAccess = React.lazy(() => import('./pages/emergency'));
const Providers = React.lazy(() => import('./pages/providers'));
const Appointments = React.lazy(() => import('./pages/appointments'));
const Analytics = React.lazy(() => import('./pages/analytics'));
const Profile = React.lazy(() => import('./pages/profile'));
const Settings = React.lazy(() => import('./pages/settings'));

// Loading spinner for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Layout wrapper for all dashboard pages
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
        <Route path="/" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/health-records" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <HealthRecords />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/sharing" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <SharingControls />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/security" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <SecuritySettings />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/emergency" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <EmergencyAccess />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/providers" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Providers />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/appointments" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Appointments />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/analytics" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/profile" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </DashboardLayout>
        } />
        
        <Route path="/settings" element={
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;

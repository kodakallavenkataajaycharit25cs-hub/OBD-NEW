import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BookingPage from './components/BookingPage';
import FeaturesPage from './components/FeaturesPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import OwnerDashboard from './components/OwnerDashboard';
import DriverPortal from './components/DriverPortal';
import SuperAdminPortal from './components/admin/SuperAdminPortal';
import AdminPortal from './components/admin/AdminPortal';
import LoginModal from './components/LoginModal';
import ResetPasswordPage from './components/ResetPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white font-sans">
        <Routes>
          <Route path="/" element={<LandingPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/booking" element={<BookingPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/about" element={<AboutPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/features" element={<FeaturesPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/contact" element={<ContactPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route 
            path="/owner/*" 
            element={
              user?.role === 'owner' ? <OwnerDashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/driver/*" 
            element={
              user?.role === 'driver' ? <DriverPortal /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/super-admin-dashboard/*" 
            element={
              user?.role === 'superadmin' ? <SuperAdminPortal /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/admin-dashboard/*" 
            element={
              user?.role === 'admin' ? <AdminPortal /> : <Navigate to="/" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {showLogin && (
          <LoginModal 
            isOpen={showLogin} 
            onClose={() => setShowLogin(false)} 
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
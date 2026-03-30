import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BookingPage from './components/BookingPage';
import OwnerDashboard from './components/OwnerDashboard';
import DriverPortal from './components/DriverPortal';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Routes>
          <Route path="/" element={<LandingPage onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/booking" element={<BookingPage onLoginClick={() => setShowLogin(true)} />} />
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
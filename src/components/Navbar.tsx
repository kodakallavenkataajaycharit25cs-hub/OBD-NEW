import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user?.role === 'owner') {
      navigate('/owner');
    } else if (user?.role === 'driver') {
      navigate('/driver');
    } else {
      onLoginClick();
    }
  };

  return (
    <nav className="glass-navbar border-b border-white/5 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 cursor-pointer group">
            <div className="w-11 h-11 bg-white text-black rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl transition-all group-hover:rotate-6">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none clay-text-3d text-white">SUKRUTHA</span>
            </div>
          </Link>

          <div className="flex items-center space-x-8 md:space-x-12">
            <Link to="/about" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/features" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/contact" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <ThemeToggle />
            <button
              onClick={handleDashboardAccess}
              className="clay-btn clay-btn-blue text-[10px] uppercase tracking-[0.2em] px-4 py-2"
            >
              {user ? 'View Dashboard' : 'Member Login'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  Car, 
  Users, 
  Wrench, 
  CreditCard, 
  Brain, 
  Settings, 
  LogOut,
  Home,
  TrendingUp,
  Shield,
  MapPin,
  Camera,
  Bot
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseClassifier from './ExpenseClassifier';
import AIVoiceAssistant from './AIVoiceAssistant';
import FleetOverview from './owner/FleetOverview';
import VehicleHealth from './owner/VehicleHealth';
import TripCosting from './owner/TripCosting';
import DriverManagement from './owner/DriverManagement';
import SafetyEmergency from './owner/SafetyEmergency';
import Maintenance from './owner/Maintenance';
import BillingFinance from './owner/BillingFinance';
import Analytics from './owner/Analytics';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  const handleSectionHighlight = (section: string) => {
    setHighlightedSection(section);
    setTimeout(() => setHighlightedSection(null), 3000);
  };

  const navigation = [
    { name: 'Overview', href: '/owner', icon: Home, current: location.pathname === '/owner' },
    { name: 'Fleet Health', href: '/owner/health', icon: Car, current: location.pathname === '/owner/health' },
    { name: 'Trip Costing', href: '/owner/costing', icon: TrendingUp, current: location.pathname === '/owner/costing' },
    { name: 'Driver Management', href: '/owner/drivers', icon: Users, current: location.pathname === '/owner/drivers' },
    { name: 'Safety & Emergency', href: '/owner/safety', icon: Shield, current: location.pathname === '/owner/safety' },
    { name: 'Maintenance', href: '/owner/maintenance', icon: Wrench, current: location.pathname === '/owner/maintenance' },
    { name: 'Billing & Finance', href: '/owner/billing', icon: CreditCard, current: location.pathname === '/owner/billing' },
    { name: 'Expense Classifier', href: '/owner/expenses', icon: Camera, current: location.pathname === '/owner/expenses' },
    { name: 'Analytics & ML', href: '/owner/analytics', icon: Brain, current: location.pathname === '/owner/analytics' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Sukrutha Mobility</h1>
                <p className="text-sm text-gray-400">Owner Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current || (highlightedSection && item.href.includes(highlightedSection))
                    ? 'bg-blue-600 text-white'
                    : highlightedSection && item.href.includes(highlightedSection)
                    ? 'bg-yellow-500/20 text-yellow-300 animate-pulse'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {sidebarOpen && item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          {sidebarOpen && (
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<FleetOverview />} />
            <Route path="/health" element={<VehicleHealth />} />
            <Route path="/costing" element={<TripCosting />} />
            <Route path="/drivers" element={<DriverManagement />} />
            <Route path="/safety" element={<SafetyEmergency />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/billing" element={<BillingFinance />} />
            <Route path="/expenses" element={<ExpenseClassifier userRole="owner" />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/owner" replace />} />
          </Routes>
        </main>

        {/* AI Voice Assistant */}
        <AIVoiceAssistant onHighlightSection={handleSectionHighlight} />
      </div>
    </div>
  );
}
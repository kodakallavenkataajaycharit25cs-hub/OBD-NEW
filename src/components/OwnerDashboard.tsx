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
  Bot,
  Activity
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
import SpotBooking from './SpotBooking';
import BorderGlow from './BorderGlow';

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
    { name: 'Booking', href: '/owner/booking', icon: MapPin, current: location.pathname === '/owner/booking' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex font-['Space_Grotesk'] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 p-4 flex flex-col z-20`}>
        <div className="h-full flex flex-col bg-[#120F17]/50 border-white/5 shadow-2xl overflow-hidden rounded-2xl">
          <div className={`mb-4 flex ${sidebarOpen ? 'p-6' : 'p-4 justify-center'}`}>
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <div className="w-10 h-10 bg-white border-none flex items-center justify-center font-black text-lg text-black shadow-xl rounded-full">
                  S
                </div>
              )}
              {sidebarOpen && (
                <div className="flex flex-col">
                  <h1 className="text-lg font-black tracking-tighter leading-none clay-text-3d uppercase">SUKRUTHA</h1>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Intelligence</span>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 ${sidebarOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto custom-scrollbar`}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center ${sidebarOpen ? 'px-4 justify-start' : 'justify-center'} py-3 rounded-2xl transition-all ${item.current || (highlightedSection && item.href.includes(highlightedSection))
                  ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${item.current ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                {sidebarOpen && (
                  <span className="ml-4 text-xs font-black uppercase tracking-widest leading-none">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        {/* Soft Depth Gradients */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between z-10">
          <div className="flex items-center space-x-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 italic leading-none mb-2">Fleet Authority Dashboard</h2>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-white tracking-tighter uppercase">Operator Control</span>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Active Link</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Operations Lead</span>
              <span className="text-sm font-black text-white uppercase tracking-tight">{user?.name}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-white/5 flex items-center justify-center group overflow-hidden">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 group shadow-none"
            >


              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
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
              <Route path="/booking" element={<SpotBooking />} />
              <Route path="*" element={<Navigate to="/owner" replace />} />
            </Routes>
          </div>
        </main>

        {/* AI Voice Assistant */}
        <AIVoiceAssistant onHighlightSection={handleSectionHighlight} />
      </div>
    </div>
  );
}
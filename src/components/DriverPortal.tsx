import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  TrendingUp, 
  Award, 
  LogOut,
  Car,
  Upload,
  Calendar,
  MapPin,
  Camera,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseClassifier from './ExpenseClassifier';

export default function DriverPortal() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '1m' | '3m'>('1m');

  const navigation = [
    { name: 'Profile', href: '/driver', icon: User, current: location.pathname === '/driver' },
    { name: 'Documents', href: '/driver/documents', icon: FileText, current: location.pathname === '/driver/documents' },
    { name: 'Trip Logs', href: '/driver/trips', icon: MapPin, current: location.pathname === '/driver/trips' },
    { name: 'Earnings', href: '/driver/earnings', icon: TrendingUp, current: location.pathname === '/driver/earnings' },
    { name: 'Badges', href: '/driver/badges', icon: Award, current: location.pathname === '/driver/badges' },
    { name: 'Expenses', href: '/driver/expenses', icon: Camera, current: location.pathname === '/driver/expenses' },
  ];

  // Mock driver data
  const getDriverDataForPeriod = (period: '7d' | '1m' | '3m') => {
    const baseData = {
      vehicleAssigned: 'Toyota Innova Crysta - MH 02 AB 1234',
      safetyScore: 8.7,
      fuelEfficiencyScore: 7.9,
      customerRating: 4.8,
      documents: [
        { name: 'Driving License', status: 'valid', expiry: '2026-03-15' },
        { name: 'Commercial Permit', status: 'expiring', expiry: '2025-02-20' },
        { name: 'Vehicle Registration', status: 'valid', expiry: '2027-01-10' },
        { name: 'Medical Certificate', status: 'expired', expiry: '2024-12-01' }
      ]
    };

    switch (period) {
      case '7d':
        return {
          ...baseData,
          totalTrips: 12,
          totalDistance: '1,850 km',
          currentPeriodEarnings: 8400,
          previousPeriodEarnings: 7800,
          periodLabel: 'This Week',
          previousLabel: 'Last Week'
        };
      case '1m':
        return {
          ...baseData,
          totalTrips: 47,
          totalDistance: '7,240 km',
          currentPeriodEarnings: 32600,
          previousPeriodEarnings: 29800,
          periodLabel: 'This Month',
          previousLabel: 'Last Month'
        };
      case '3m':
        return {
          ...baseData,
          totalTrips: 147,
          totalDistance: '22,450 km',
          currentPeriodEarnings: 98400,
          previousPeriodEarnings: 89200,
          periodLabel: 'Last 3 Months',
          previousLabel: 'Previous 3 Months'
        };
      default:
        return baseData;
    }
  };

  const driverData = getDriverDataForPeriod(selectedPeriod);

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ProfileSection = () => (
    <div className="space-y-8">
      {/* Time Period Selector */}
      <div className="clay-card p-6 bg-zinc-900 border-white/5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase clay-text-3d">Performance Horizon</h3>
          <div className="flex p-1 bg-black/20 rounded-2xl shadow-inner">
            {[
              { key: '7d', label: '7D' },
              { key: '1m', label: '1M' },
              { key: '3m', label: '3M' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedPeriod === period.key
                    ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="clay-card p-8 bg-zinc-900 border-white/10 group">
        <div className="flex items-center space-x-8 mb-10">
          <div className="w-24 h-24 clay-card bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40 relative">
            <User className="w-12 h-12 text-white" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 clay-card bg-green-500 border-none flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase clay-text-3d">{user?.name}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Certified Driver Node</p>
            <div className="flex items-center space-x-3 mt-4 py-2 px-4 bg-white/5 rounded-xl border border-white/5">
              <Car className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{driverData.vehicleAssigned}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Missions', val: driverData.totalTrips, icon: MapPin },
            { label: 'Distance Vector', val: driverData.totalDistance, icon: TrendingUp },
            { label: 'Pilot Rating', val: `${driverData.customerRating}/5`, icon: Award }
          ].map((stat, i) => (
            <div key={i} className="clay-card p-6 bg-black/20 border-white/5 shadow-inner text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                <stat.icon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-2xl font-black text-white tracking-tighter">{stat.val}</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="clay-card p-8 border-white/5">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase clay-text-3d italic">Efficiency Matrix</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Safety Vector</span>
                <span className="text-xs font-black text-green-500">{driverData.safetyScore}/10</span>
              </div>
              <div className="bg-black/40 rounded-full h-3 p-0.5 shadow-inner border border-white/5">
                <div 
                  className="bg-green-500 h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-1000" 
                  style={{ width: `${driverData.safetyScore * 10}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Fuel Optimization</span>
                <span className="text-xs font-black text-blue-500">{driverData.fuelEfficiencyScore}/10</span>
              </div>
              <div className="bg-black/40 rounded-full h-3 p-0.5 shadow-inner border border-white/5">
                <div 
                  className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000" 
                  style={{ width: `${driverData.fuelEfficiencyScore * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="clay-card p-8 bg-blue-600/5 border-blue-500/20">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase clay-text-3d italic">{driverData.periodLabel} Credit</h3>
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 italic">Current Yield</div>
              <div className="text-4xl font-black text-green-400 tracking-tighter">
                {formatIndianCurrency(driverData.currentPeriodEarnings)}
              </div>
            </div>
            <div className="flex justify-between items-end pt-6 border-t border-white/5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1 leading-none italic">Prev Cycle</div>
                <div className="text-lg font-black text-gray-400 tracking-tight">
                  {formatIndianCurrency(driverData.previousPeriodEarnings)}
                </div>
              </div>
              <div className="px-4 py-2 clay-card bg-green-500 border-none text-[10px] font-black text-white uppercase tracking-widest shadow-green-900/40">
                +{(((driverData.currentPeriodEarnings - driverData.previousPeriodEarnings) / driverData.previousPeriodEarnings) * 100).toFixed(1)}% Yield
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="space-y-8">
      <div className="clay-card p-8 bg-zinc-900 border-white/5">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Document Archives</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {driverData.documents.map((doc, index) => (
            <div key={index} className="clay-card p-6 bg-black/20 border-white/5 shadow-inner">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{doc.name}</h3>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  doc.status === 'valid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  doc.status === 'expiring' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {doc.status}
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">
                 <span>Expiry Registry</span>
                 <span className="text-white">{new Date(doc.expiry).toLocaleDateString('en-IN')}</span>
              </div>
              <button className="w-full clay-btn clay-btn-blue h-12 flex items-center justify-center space-x-3 text-[10px]">
                <Upload className="w-4 h-4" />
                <span>UPLOAD REVISION</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TripLogsSection = () => (
    <div className="space-y-8">
      <div className="clay-card p-8 bg-zinc-900 border-white/5">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Historical Missions</h2>
        
        <div className="space-y-4">
          {[
            { date: '2025-01-15', route: 'Mumbai → Pune', distance: '148 km', duration: '3h 15m', fare: 2840 },
            { date: '2025-01-14', route: 'Pune → Mumbai', distance: '148 km', duration: '3h 30m', fare: 2940 },
            { date: '2025-01-13', route: 'Mumbai → Nashik', distance: '166 km', duration: '4h 10m', fare: 3200 },
            { date: '2025-01-12', route: 'Mumbai Airport → Lonavala', distance: '98 km', duration: '2h 45m', fare: 2100 }
          ].map((trip, index) => (
            <div key={index} className="clay-card p-6 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">{trip.route}</h3>
                  <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-600 mt-2">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-blue-500/50" /> {trip.date}</span>
                    <span className="flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-blue-500/50" /> {trip.distance}</span>
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-blue-500/50" /> {trip.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-green-400 tracking-tighter">
                    {formatIndianCurrency(trip.fare)}
                  </div>
                  <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest mt-1">Mission Credit</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EarningsSection = () => (
    <div className="space-y-8">
      {/* Time Period Selector */}
      <div className="clay-card p-6 bg-zinc-900 border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase clay-text-3d">Earnings Analysis</h3>
          <div className="flex p-1 bg-black/20 rounded-2xl shadow-inner">
            {[
              { key: '7d', label: '7D' },
              { key: '1m', label: '1M' },
              { key: '3m', label: '3M' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedPeriod === period.key
                    ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="clay-card p-8 bg-zinc-900 border-white/5">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Credit Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="clay-card p-6 bg-green-500/10 border-green-500/20 text-center">
            <div className="text-3xl font-black text-green-400 tracking-tighter">{formatIndianCurrency(driverData.currentPeriodEarnings)}</div>
            <div className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-2 italic">{driverData.periodLabel}</div>
          </div>
          <div className="clay-card p-6 bg-blue-500/10 border-blue-500/20 text-center">
            <div className="text-3xl font-black text-blue-400 tracking-tighter">{formatIndianCurrency(driverData.previousPeriodEarnings)}</div>
            <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-2 italic">{driverData.previousLabel}</div>
          </div>
          <div className="clay-card p-6 bg-purple-500/10 border-purple-500/20 text-center">
            <div className="text-3xl font-black text-purple-400 tracking-tighter">{formatIndianCurrency(driverData.currentPeriodEarnings + driverData.previousPeriodEarnings)}</div>
            <div className="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-2 italic">Total Ops Credit</div>
          </div>
        </div>

        <div className="clay-card p-8 bg-black/20 border-white/5 shadow-inner">
          <h3 className="text-xs font-black text-white mb-8 uppercase tracking-[0.3em] italic">Settlement Cycles</h3>
          <div className="space-y-6">
            {[
              { date: '2025-01-15', amount: 15200, type: 'Weekly Settlement' },
              { date: '2025-01-08', amount: 14800, type: 'Weekly Settlement' },
              { date: '2025-01-01', amount: 15600, type: 'Weekly Settlement' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0 group">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 clay-card bg-zinc-800 border-none flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                   </div>
                   <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight italic">{payment.type}</div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{payment.date}</div>
                   </div>
                </div>
                <div className="text-lg font-black text-green-400 tracking-tighter">
                  {formatIndianCurrency(payment.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const BadgesSection = () => (
    <div className="space-y-8">
      <div className="clay-card p-8 bg-zinc-900 border-white/5">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Achievement Nodes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Safe Pilot', description: 'No incidents for 6 months', earned: true, color: 'green' },
            { name: 'Eco Warrior', description: 'Efficiency Alpha Lead', earned: true, color: 'blue' },
            { name: 'Unit Favorite', description: '4.8+ Core Rating', earned: true, color: 'yellow' },
            { name: 'Travel Master', description: '10,000+ km Traversed', earned: true, color: 'purple' },
            { name: 'Punctual Opt', description: '95% On-Time Stream', earned: false, color: 'gray' },
            { name: 'Route Expert', description: 'Perfect Geo Navigation', earned: false, color: 'gray' }
          ].map((badge, index) => (
            <div key={index} className={`clay-card p-8 border-white/5 text-center transition-all ${
              badge.earned 
                ? 'bg-blue-600/5 opacity-100' 
                : 'bg-black/20 opacity-40 grayscale'
            }`}>
              <div className={`w-20 h-20 clay-card mx-auto mb-6 flex items-center justify-center transition-transform ${
                badge.earned
                  ? `bg-${badge.color}-500 border-none shadow-${badge.color}-900/40 hover:scale-110`
                  : 'bg-zinc-800 border-white/5'
              }`}>
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-sm font-black text-white mb-3 uppercase tracking-tight">{badge.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{badge.description}</p>
              {badge.earned && (
                <div className="text-[10px] text-green-400 mt-4 font-black uppercase tracking-widest shadow-green-500/20">NODE UNLOCKED</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex font-['Space_Grotesk'] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 p-4 flex flex-col z-20">
        <div className="clay-card h-full flex flex-col bg-zinc-900/50 border-white/5 shadow-2xl overflow-hidden">
          <div className="p-6 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 clay-card bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter leading-none clay-text-3d uppercase">SUKRUTHA</h1>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Pilot Portal</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 rounded-2xl transition-all ${
                  item.current
                    ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${item.current ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="ml-4 text-xs font-black uppercase tracking-widest leading-none text-white/90">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="clay-card bg-black/20 border-white/5 p-4 mb-4 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none mb-1">Active Pilot</p>
                  <p className="font-bold text-sm truncate">{user?.name}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full clay-btn bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center p-3 rounded-2xl shadow-none"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]">Exit Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 italic leading-none mb-2">Operations Node Alpha</h2>
            <div className="flex items-center space-x-3">
               <span className="text-2xl font-black text-white tracking-tighter uppercase">Pilot Core Interface</span>
               <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Bio-Link Active</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 italic">Auth Level 4</span>
              <span className="text-sm font-black text-white uppercase tracking-tight">{user?.name}</span>
            </div>
            <div className="w-14 h-14 clay-card bg-zinc-800 border-white/5 flex items-center justify-center group overflow-hidden">
               <div className="w-full h-full bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                 <User className="w-6 h-6 text-white" />
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <Routes>
              <Route index element={<ProfileSection />} />
              <Route path="/documents" element={<DocumentsSection />} />
              <Route path="/trips" element={<TripLogsSection />} />
              <Route path="/earnings" element={<EarningsSection />} />
              <Route path="/badges" element={<BadgesSection />} />
              <Route path="/expenses" element={<ExpenseClassifier userRole="driver" />} />
              <Route path="*" element={<Navigate to="/driver" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
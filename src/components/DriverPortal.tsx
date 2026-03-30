import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  TrendingUp, 
  Award, 
  LogOut,
  Home,
  Car,
  Upload,
  Calendar,
  MapPin,
  Camera
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
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Performance Overview</h3>
          <div className="flex space-x-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '1m', label: '1 Month' },
              { key: '3m', label: '3 Months' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Car className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{driverData.vehicleAssigned}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{driverData.totalTrips}</div>
            <div className="text-sm text-gray-400">Total Trips</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{driverData.totalDistance}</div>
            <div className="text-sm text-gray-400">Distance Covered</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{driverData.customerRating}/5</div>
            <div className="text-sm text-gray-400">Customer Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performance Scores</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Safety Score</span>
                <span className="text-white font-semibold">{driverData.safetyScore}/10</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${driverData.safetyScore * 10}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Fuel Efficiency</span>
                <span className="text-white font-semibold">{driverData.fuelEfficiencyScore}/10</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${driverData.fuelEfficiencyScore * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">{driverData.periodLabel} Earnings</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">{driverData.periodLabel}</div>
              <div className="text-2xl font-bold text-green-400">
                {formatIndianCurrency(driverData.currentPeriodEarnings)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">{driverData.previousLabel}</div>
              <div className="text-lg text-gray-300">
                {formatIndianCurrency(driverData.previousPeriodEarnings)}
              </div>
            </div>
            <div className="text-sm text-green-400">
              +{(((driverData.currentPeriodEarnings - driverData.previousPeriodEarnings) / driverData.previousPeriodEarnings) * 100).toFixed(1)}% vs {driverData.previousLabel.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Document Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {driverData.documents.map((doc, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{doc.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'valid' ? 'bg-green-500/20 text-green-400' :
                  doc.status === 'expiring' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Expiry: {new Date(doc.expiry).toLocaleDateString('en-IN')}
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload New</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TripLogsSection = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Trip Logs</h2>
        
        <div className="space-y-4">
          {[
            { date: '2025-01-15', route: 'Mumbai → Pune', distance: '148 km', duration: '3h 15m', fare: 2840 },
            { date: '2025-01-14', route: 'Pune → Mumbai', distance: '148 km', duration: '3h 30m', fare: 2940 },
            { date: '2025-01-13', route: 'Mumbai → Nashik', distance: '166 km', duration: '4h 10m', fare: 3200 },
            { date: '2025-01-12', route: 'Mumbai Airport → Lonavala', distance: '98 km', duration: '2h 45m', fare: 2100 }
          ].map((trip, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{trip.route}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span>{trip.date}</span>
                    <span>{trip.distance}</span>
                    <span>{trip.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-400">
                    {formatIndianCurrency(trip.fare)}
                  </div>
                  <div className="text-sm text-gray-400">Earnings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EarningsSection = () => (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Earnings Analysis</h3>
          <div className="flex space-x-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '1m', label: '1 Month' },
              { key: '3m', label: '3 Months' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Earnings Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{formatIndianCurrency(driverData.currentPeriodEarnings)}</div>
            <div className="text-sm text-green-300">{driverData.periodLabel}</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{formatIndianCurrency(driverData.previousPeriodEarnings)}</div>
            <div className="text-sm text-blue-300">{driverData.previousLabel}</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{formatIndianCurrency(driverData.currentPeriodEarnings + driverData.previousPeriodEarnings)}</div>
            <div className="text-sm text-purple-300">Total</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {[
              { date: '2025-01-15', amount: 15200, type: 'Weekly Settlement' },
              { date: '2025-01-08', amount: 14800, type: 'Weekly Settlement' },
              { date: '2025-01-01', amount: 15600, type: 'Weekly Settlement' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                <div>
                  <div className="text-white font-medium">{payment.type}</div>
                  <div className="text-sm text-gray-400">{payment.date}</div>
                </div>
                <div className="text-green-400 font-semibold">
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
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Achievement Badges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Safe Driver', description: 'No incidents for 6 months', earned: true, color: 'green' },
            { name: 'Eco Warrior', description: 'Top fuel efficiency', earned: true, color: 'blue' },
            { name: 'Customer Favorite', description: '4.8+ rating', earned: true, color: 'yellow' },
            { name: 'Distance Master', description: '10,000+ km driven', earned: true, color: 'purple' },
            { name: 'Punctual Pro', description: '95% on-time record', earned: false, color: 'gray' },
            { name: 'Route Expert', description: 'Perfect navigation', earned: false, color: 'gray' }
          ].map((badge, index) => (
            <div key={index} className={`border rounded-lg p-4 text-center ${
              badge.earned 
                ? 'border-green-500/50 bg-green-500/20' 
                : 'border-gray-600 bg-gray-500/20'
            }`}>
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                badge.earned
                  ? `bg-${badge.color}-500`
                  : 'bg-gray-600'
              }`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-400">{badge.description}</p>
              {badge.earned && (
                <div className="text-xs text-green-400 mt-2 font-medium">EARNED</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sukrutha Mobility</h1>
              <p className="text-sm text-gray-400">Driver Portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Driver Portal</h2>
                <p className="text-gray-400">Manage your profile and view performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<ProfileSection />} />
            <Route path="/documents" element={<DocumentsSection />} />
            <Route path="/trips" element={<TripLogsSection />} />
            <Route path="/earnings" element={<EarningsSection />} />
            <Route path="/badges" element={<BadgesSection />} />
            <Route path="/expenses" element={<ExpenseClassifier userRole="driver" />} />
            <Route path="*" element={<Navigate to="/driver" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
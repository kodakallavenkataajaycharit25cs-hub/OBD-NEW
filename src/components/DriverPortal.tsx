import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Settings,
  Bot,
  Zap,
  Thermometer,
  Gauge,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseClassifier from './ExpenseClassifier';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import SpotBooking from './SpotBooking';
import BorderGlow from './BorderGlow';
import { 
  fetchRPM, 
  fetchSpeed, 
  fetchFuelLevel, 
  fetchDiagnostics, 
  fetchPilots, 
  fetchTrips, 
  createAlert, 
  fetchEngineTemp, 
  fetchO2Level,
  OBDData 
} from '../services/obdApi';

export default function DriverPortal() {
  const { user, logout, loginAs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '1m' | '3m' | '1y'>('1m');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<any>({});
  const [pilotRecord, setPilotRecord] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sosLoading, setSosLoading] = useState(false);

  useEffect(() => {
    const updateTelemetry = async () => {
      try {
        const [rpmData, speedData, fuelData, diagData, tempData, o2Data] = await Promise.all([
          fetchRPM(),
          fetchSpeed(),
          fetchFuelLevel(),
          fetchDiagnostics(),
          fetchEngineTemp(),
          fetchO2Level()
        ]);
        setTelemetry({
          rpm: rpmData.rpm,
          speed: speedData.speed,
          fuel_level: fuelData.fuel_level,
          diagnostics: diagData.diagnostics,
          engine_temp: tempData.temp,
          o2_voltage: o2Data.o2_voltage
        });
      } catch (error) {
        console.error('Failed to update telemetry:', error);
      }
    };

    const loadPilotProfile = async () => {
      try {
        const [pilots, tripsData] = await Promise.all([
          fetchPilots(),
          fetchTrips()
        ]);
        
        // Match by Email (primary key link from Auth)
        const record = pilots.find((p: any) => p.email === user?.email);
        setPilotRecord(record);
        
        // Filter trips for this pilot
        if (record) {
          const myTrips = tripsData.filter((t: any) => t.pilot_id === record.id);
          setTrips(myTrips);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setLoading(false);
      }
    };

    updateTelemetry();
    loadPilotProfile();
    const interval = setInterval(updateTelemetry, 2000); 
    return () => clearInterval(interval);
  }, [user]);

  const handleSectionHighlight = (section: string) => {
    setHighlightedSection(section);
    setTimeout(() => setHighlightedSection(null), 3000);
  };

  const handleTriggerSOS = async () => {
    setSosLoading(true);
    try {
      await createAlert({
        type: 'SOS',
        severity: 'critical',
        message: `SOS triggered by driver ${user?.name}`,
        vehicle: driverData?.vehicleAssigned || 'Unknown',
        driver: user?.name || 'Unknown',
      });
      alert('🚨 SOS Alert has been broadcast to Fleet Command!');
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
      alert('SOS Alert broadcast! Emergency team has been notified.');
    } finally {
      setSosLoading(false);
    }
  };

  const navigation = [
    { name: 'Profile', href: '/driver', icon: User, current: location.pathname === '/driver' },
    { name: 'Telemetry', href: '/driver/telemetry', icon: Activity, current: location.pathname === '/driver/telemetry' },
    { name: 'Documents', href: '/driver/documents', icon: FileText, current: location.pathname === '/driver/documents' },
    { name: 'Trip Logs', href: '/driver/trips', icon: MapPin, current: location.pathname === '/driver/trips' },
    { name: 'Earnings', href: '/driver/earnings', icon: TrendingUp, current: location.pathname === '/driver/earnings' },
    { name: 'Expenses', href: '/driver/expenses', icon: Camera, current: location.pathname === '/driver/expenses' },
    { name: 'Booking', href: '/driver/booking', icon: MapPin, current: location.pathname === '/driver/booking' },
  ];

  // Map Supabase pilot data to the UI format
  const getDriverDataForPeriod = (period: '7d' | '1m' | '3m' | '1y') => {
    const baseData = {
      vehicleAssigned: 'Toyota Innova Crysta - MH-12-PQ-8890',
      safetyScore: pilotRecord?.safetyScore || 8.5,
      fuelEfficiencyScore: 7.9,
      customerRating: pilotRecord?.rating || 4.5,
      totalTrips: pilotRecord?.trips || 0,
      totalDistance: `${(pilotRecord?.hours || 0) * 45} km`, // Simple calc for demo
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
          currentPeriodEarnings: (pilotRecord?.trips || 0) * 150,
          previousPeriodEarnings: 7800,
          periodLabel: 'This Week',
          previousLabel: 'Last Week'
        };
      case '1m':
        return {
          ...baseData,
          currentPeriodEarnings: (pilotRecord?.trips || 0) * 450,
          previousPeriodEarnings: 29800,
          periodLabel: 'This Month',
          previousLabel: 'Last Month'
        };
      case '3m':
        return {
          ...baseData,
          currentPeriodEarnings: (pilotRecord?.trips || 0) * 1200,
          previousPeriodEarnings: 89200,
          periodLabel: 'Last 3 Months',
          previousLabel: 'Previous 3 Months'
        };
      case '1y':
        return {
          ...baseData,
          currentPeriodEarnings: (pilotRecord?.trips || 0) * 4800,
          previousPeriodEarnings: 362000,
          periodLabel: 'This Year',
          previousLabel: 'Last Year'
        };
      default:
        return baseData as any;
    }
  };

  const driverData = getDriverDataForPeriod(selectedPeriod);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#120F17] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">Syncing Pilot Vector with Core...</p>
      </div>
    );
  }

  const formatIndianCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')} cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} lacs`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')} K`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ProfileSection = () => (
    <div className="space-y-8">
      {/* Time Period Selector */}
      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="p-6 border-white/5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase clay-text-3d">Performance Horizon</h3>
          <div className="flex p-1 bg-black/20 rounded-2xl shadow-inner">
            {[
              { key: '7d', label: '7D' },
              { key: '1m', label: '1M' },
              { key: '3m', label: '3M' },
              { key: '1y', label: '1Y' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriod === period.key
                  ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                  : 'text-gray-500 hover:text-white'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </BorderGlow>

      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="p-8 border-white/10 group"
      >
        <div className="flex items-center space-x-8 mb-10">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40 relative">
            <User className="w-12 h-12 text-white" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green-500 border-none flex items-center justify-center">
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
            <div key={i} className="p-6 bg-black/20 border-white/5 shadow-inner text-center rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                <stat.icon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-2xl font-black text-white tracking-tighter">{stat.val}</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BorderGlow
          borderRadius={28}
          backgroundColor="#120F17"
          glowRadius={40}
          glowIntensity={1}
          className="p-8 border-white/5 h-full"
        >
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
        </BorderGlow>

        <BorderGlow
          borderRadius={28}
          glowColor="120 70 50"
          backgroundColor="#120F17"
          glowRadius={40}
          glowIntensity={1}
          className="p-8 bg-blue-600/5 border-blue-500/20 h-full"
        >
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase clay-text-3d italic">{driverData.periodLabel} Credit</h3>
          <div className="space-y-6">
            <div>
              <div className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2 italic">Current Yield</div>
              <div className="text-5xl md:text-6xl font-black text-green-400 tracking-tighter">
                {formatIndianCurrency(driverData.currentPeriodEarnings)}
              </div>
            </div>
            <div className="flex justify-between items-end pt-6 border-t border-white/5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1 leading-none italic">Prev Cycle</div>
                <div className="text-xl md:text-2xl font-black text-gray-400 tracking-tight">
                  {formatIndianCurrency(driverData.previousPeriodEarnings)}
                </div>
              </div>
              <div className="px-5 py-3 bg-green-500 border-none text-xs md:text-sm font-black text-white uppercase tracking-widest shadow-green-900/40 rounded-2xl">
                +{(((driverData.currentPeriodEarnings - driverData.previousPeriodEarnings) / driverData.previousPeriodEarnings) * 100).toFixed(1)}% Yield
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="space-y-8">
      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="p-8 border-white/5 h-full"
      >
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Document Archives</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {driverData.documents?.map((doc: any, index: number) => (
            <BorderGlow
              key={index}
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              backgroundColor="#120F17"
              className="p-6 border-white/5 shadow-inner h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{doc.name}</h3>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${doc.status === 'valid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
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
              <button 
                onClick={() => alert(`Opening file dialog to upload revision for ${doc.name}`)}
                className="w-full clay-btn clay-btn-blue h-12 flex items-center justify-center space-x-3 text-[10px]"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD REVISION</span>
              </button>
            </BorderGlow>
          ))}
        </div>
      </BorderGlow>
    </div>
  );

  const TripLogsSection = () => (
    <div className="space-y-8">
      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="p-8 border-white/5 h-full"
      >
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Historical Missions</h2>

        <div className="space-y-4">
          {trips.length > 0 ? trips.map((trip, index) => (
            <BorderGlow
              key={index}
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              backgroundColor="#120F17"
              className="p-6 shadow-inner hover:bg-white/5 transition-all group border-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white tracking tight uppercase group-hover:text-blue-400 transition-colors">Mission Vector: {trip.id}</h3>
                  <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-600 mt-2">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-blue-500/50" /> {new Date(trip.start_time).toLocaleDateString()}</span>
                    <span className="flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-blue-500/50" /> {trip.distance} km</span>
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-blue-500/50" /> {trip.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black text-green-400 tracking-tighter">
                    {formatIndianCurrency(trip.distance * 15)}
                  </div>
                  <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest mt-1">Mission Credit</div>
                </div>
              </div>
            </BorderGlow>
          )) : (
            <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No mission logs detected in current sector.</p>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );

  const EarningsSection = () => (
    <div className="space-y-8">
      {/* Time Period Selector */}
      <div className="p-6 bg-[#120F17] border-white/5 rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase clay-text-3d">Earnings Analysis</h3>
          <div className="flex p-1 bg-black/20 rounded-2xl shadow-inner">
            {[
              { key: '7d', label: '7D' },
              { key: '1m', label: '1M' },
              { key: '3m', label: '3M' },
              { key: '1y', label: '1Y' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriod === period.key
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

      <div className="p-8 bg-[#120F17] border-white/5 rounded-2xl">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Credit Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-green-500/10 border-green-500/20 text-center rounded-2xl">
            <div className="text-4xl md:text-5xl font-black text-green-400 tracking-tighter mb-1">{formatIndianCurrency(driverData.currentPeriodEarnings)}</div>
            <div className="text-xs text-green-500 font-black uppercase tracking-widest mt-2 italic">{driverData.periodLabel}</div>
          </div>
          <div className="p-6 bg-blue-500/10 border-blue-500/20 text-center rounded-2xl">
            <div className="text-4xl md:text-5xl font-black text-blue-400 tracking-tighter mb-1">{formatIndianCurrency(driverData.previousPeriodEarnings)}</div>
            <div className="text-xs text-blue-500 font-black uppercase tracking-widest mt-2 italic">{driverData.previousLabel}</div>
          </div>
          <div className="p-6 bg-purple-500/10 border-purple-500/20 text-center rounded-2xl">
            <div className="text-4xl md:text-5xl font-black text-purple-400 tracking-tighter mb-1">{formatIndianCurrency(driverData.currentPeriodEarnings + driverData.previousPeriodEarnings)}</div>
            <div className="text-xs text-purple-500 font-black uppercase tracking-widest mt-2 italic">Total Ops Credit</div>
          </div>
        </div>

        <div className="p-8 bg-black/20 border-white/5 shadow-inner rounded-2xl">
          <h3 className="text-sm font-black text-white mb-8 uppercase tracking-[0.3em] italic">Settlement Cycles</h3>
          <div className="space-y-6">
            {[
              { date: '2025-01-15', amount: 15200, type: 'Weekly Settlement' },
              { date: '2025-01-08', amount: 14800, type: 'Weekly Settlement' },
              { date: '2025-01-01', amount: 15600, type: 'Weekly Settlement' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0 group">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-zinc-800 border-none flex items-center justify-center rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight italic">{payment.type}</div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-1">{payment.date}</div>
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-black text-green-400 tracking-tighter">
                  {formatIndianCurrency(payment.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TelemetrySection = () => (
    <div className="space-y-8">
      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="p-8 border-white/5 h-full"
      >
        <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase clay-text-3d">Real-time Telemetry</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Engine RPM', value: telemetry.rpm || 0, unit: 'RPM', icon: Gauge, color: 'blue' },
            { label: 'Ground Speed', value: telemetry.speed || 0, unit: 'km/h', icon: Zap, color: 'orange' },
            { label: 'Fuel Reservoir', value: telemetry.fuel_level || 0, unit: '%', icon: Thermometer, color: 'green' },
            { label: 'Engine Temp', value: telemetry.engine_temp || 0, unit: '°C', icon: Thermometer, color: 'red' }
          ].map((stat, i) => (
            <BorderGlow
              key={i}
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              backgroundColor="#120F17"
              className="p-6 shadow-inner text-center group hover:bg-white/5 transition-all h-full border-white/5"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mx-auto mb-4 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <div className="text-3xl font-black text-white tracking-tighter">
                {stat.value}<span className="text-xs ml-1 text-gray-500">{stat.unit}</span>
              </div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{stat.label}</div>
            </BorderGlow>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="p-8 border-white/5 shadow-inner h-full"
          >
            <h3 className="text-lg font-black text-white mb-6 tracking-tighter uppercase clay-text-3d italic">Diagnostic Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">MIL Status</span>
                <span className={`text-xs font-black uppercase ${telemetry.diagnostics?.mil_status === 'OFF' ? 'text-green-500' : 'text-red-500'}`}>
                  {telemetry.diagnostics?.mil_status || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">O2 Voltage</span>
                <span className="text-xs font-black text-blue-400">
                  {telemetry.o2_voltage || '0.00'}V
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Engine Load</span>
                <span className="text-xs font-black text-purple-400">
                  {telemetry.diagnostics?.engine_load || '0%'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active DTCs</span>
                <span className="text-xs font-black text-gray-400">
                  {telemetry.diagnostics?.dtc?.length || 0} Codes Detected
                </span>
              </div>
            </div>
          </BorderGlow>

          <BorderGlow
            borderRadius={28}
            glowColor="120 70 50"
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="p-8 border-blue-500/20 relative overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24 text-blue-500" />
            </div>
            <h3 className="text-lg font-black text-white mb-6 tracking-tighter uppercase clay-text-3d italic">System Health</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              All vehicle subsystems are currently operating within nominal parameters. Real-time sync with Core Command is active.
            </p>
            <div className="flex items-center space-x-3 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nominal State Verified</span>
            </div>
          </BorderGlow>
        </div>
      </BorderGlow>
    </div>
  );


  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans overflow-hidden">
      {sessionStorage.getItem('admin_impersonating') === 'true' && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-xs flex justify-between items-center z-[999] relative border-b border-white/10 font-bold shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
            <span>IMPERSONATION MODE ACTIVE: Logged in as <span className="underline">{user?.name}</span> ({user?.email})</span>
          </div>
          <button 
            onClick={() => {
              sessionStorage.removeItem('admin_impersonating');
              loginAs({
                id: '4',
                email: 'admin@test.com',
                role: 'admin',
                name: 'Super Admin'
              });
              navigate('/super-admin-dashboard');
            }}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all text-[10px] uppercase tracking-widest active:scale-95 shrink-0"
          >
            Exit & Return to Super Admin
          </button>
        </div>
      )}
      <div className="flex-1 flex overflow-hidden">
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
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Pilot Portal</span>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 ${sidebarOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto custom-scrollbar`}>
            {navigation.map((item) => {
              const isSpecial = item.name === 'Expenses' || item.name === 'Booking';
              const isHighlighted = highlightedSection && item.href.includes(highlightedSection);

              if (isSpecial && sidebarOpen && (item.current || isHighlighted)) {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center p-1 mt-2"
                  >
                    <div className={`w-full ${isHighlighted
                      ? 'bg-orange-500 animate-pulse'
                      : 'bg-blue-600'
                      } border-none shadow-blue-900/40 py-4 px-6 flex items-center space-x-4 group transition-all active:scale-95 rounded-2xl`}>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${sidebarOpen ? 'px-4 justify-start' : 'justify-center'} py-3 rounded-2xl transition-all ${item.current || isHighlighted
                    ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                    } ${isHighlighted ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900 animate-bounce' : ''}`}
                >
                  <div className={`p-2 rounded-xl transition-colors shrink-0 ${item.current || isHighlighted ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <span className="ml-4 text-xs font-black uppercase tracking-widest leading-none text-white/90">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between z-10">
          <div className="flex items-center space-x-6">
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
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={handleTriggerSOS}
              disabled={sosLoading}
              className={`flex items-center px-6 py-3 bg-red-600 border-none text-white transition-all active:scale-95 group shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-2xl ${sosLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              <ShieldAlert className={`w-5 h-5 mr-3 ${sosLoading ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{sosLoading ? 'Broadcasting...' : 'TRIGGER SOS'}</span>
            </button>
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 italic">Auth Level 4</span>
              <span className="text-sm font-black text-white uppercase tracking-tight">{user?.name}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-white/5 flex items-center justify-center group overflow-hidden">
              <div className="w-full h-full bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 group shadow-none rounded-2xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <Routes>
              <Route index element={<ProfileSection />} />
              <Route path="/telemetry" element={<TelemetrySection />} />
              <Route path="/documents" element={<DocumentsSection />} />
              <Route path="/trips" element={<TripLogsSection />} />
              <Route path="/earnings" element={<EarningsSection />} />
              <Route path="/expenses" element={<ExpenseClassifier userRole="driver" />} />
              <Route path="/booking" element={<SpotBooking />} />
              <Route path="*" element={<Navigate to="/driver" replace />} />
            </Routes>
          </div>
        </main>

        {/* AI Voice Assistant */}

      </div>
    </div>
  </div>
  );
}
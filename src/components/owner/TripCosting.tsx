import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  IndianRupee
} from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function TripCosting() {
  const [dateRange, setDateRange] = useState('30d');

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const tripStats = [
    { title: 'Avg Cost/km', value: '₹14.2', change: '-2.4%', trend: 'down' },
    { title: 'Total Revenue', value: formatIndianCurrency(845600), change: '+12.8%', trend: 'up' },
    { title: 'Operational Cost', value: formatIndianCurrency(312400), change: '+5.2%', trend: 'up' },
    { title: 'Net Profit', value: formatIndianCurrency(533200), change: '+18.4%', trend: 'up' }
  ];

  const recentTrips = [
    { 
      id: 'TRP-1024', 
      route: 'Mumbai → Pune', 
      distance: '148 km', 
      fuelCost: 2150, 
      tollCost: 320, 
      driverPay: 800, 
      revenue: 5600,
      status: 'profitable'
    },
    { 
      id: 'TRP-1025', 
      route: 'Pune → Nashik', 
      distance: '210 km', 
      fuelCost: 3100, 
      tollCost: 150, 
      driverPay: 1200, 
      revenue: 6800,
      status: 'profitable'
    },
    { 
      id: 'TRP-1026', 
      route: 'Mumbai → Lonavala', 
      distance: '94 km', 
      fuelCost: 1350, 
      tollCost: 320, 
      driverPay: 600, 
      revenue: 2800,
      status: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tripStats.map((stat, i) => (
          <BorderGlow
            key={i}
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            backgroundColor="#120F17"
            className="clay-card p-6 border-white/5 shadow-2xl relative group overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className={`mt-2 flex items-center text-sm font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-[14px] h-[14px] mr-1" /> : <ArrowDownRight className="w-[14px] h-[14px] mr-1" />}
              {stat.change} vs last period
            </div>
          </BorderGlow>
        ))}
      </div>

      {/* Main Analysis Section */}
      <BorderGlow
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        backgroundColor="#120F17"
        className="clay-card p-8 border-white/5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold tracking-tight uppercase text-white">Trip Economics Interface</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="clay-card p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="text-[10px] uppercase font-black tracking-widest text-gray-600 mb-2">Fuel Expenditures</div>
                <div className="text-xl font-bold text-white tracking-tight">{formatIndianCurrency(112400)}</div>
                <div className="text-[10px] text-blue-400 font-bold mt-1 uppercase tracking-widest leading-none">36% of Net Ops</div>
              </div>
              <div className="clay-card p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="text-[10px] uppercase font-black tracking-widest text-gray-600 mb-2">Toll & Tariffs</div>
                <div className="text-xl font-bold text-white tracking-tight">{formatIndianCurrency(24500)}</div>
                <div className="text-[10px] text-purple-400 font-bold mt-1 uppercase tracking-widest leading-none">8% of Net Ops</div>
              </div>
              <div className="clay-card p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="text-[10px] uppercase font-black tracking-widest text-gray-600 mb-2">Labor/Pilot Pay</div>
                <div className="text-xl font-bold text-white tracking-tight">{formatIndianCurrency(85600)}</div>
                <div className="text-[10px] text-green-400 font-bold mt-1 uppercase tracking-widest leading-none">27% of Net Ops</div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="h-64 clay-card bg-black/40 border-white/5 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px]" />
              <div className="text-center z-10 p-8">
                <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400 mx-auto" />
                </div>
                <div className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">Profitability Stream Visualization Live</div>
                <p className="max-w-xs text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4 mx-auto leading-relaxed">ML-powered route profitability correlation active</p>
              </div>
            </div>
          </div>

          {/* Controls & Mini Stats */}
          <div className="space-y-6">
            <BorderGlow
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              backgroundColor="#120F17"
              className="clay-card p-6 border-none shadow-blue-900/40 relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-2 text-left">Unit Economics Lead</h3>
                <div className="text-4xl font-bold text-white tracking-tight">₹28.4</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-1">Net profit per missions kilometer</div>
              </div>
            </BorderGlow>

            <div className="clay-card p-6 border-white/5">
              <h3 className="text-xs font-black text-white mb-6 uppercase tracking-[0.3em]">Temporal Core Filtering</h3>
              <div className="space-y-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all custom-select"
                >
                  <option value="7d" className="bg-zinc-900">Last 7 Days</option>
                  <option value="30d" className="bg-zinc-900">Last 30 Days</option>
                  <option value="90d" className="bg-zinc-900">Last 3 Months</option>
                  <option value="1y" className="bg-zinc-900">Last Year</option>
                </select>
                <button className="w-full clay-btn py-4 text-[13px] flex items-center justify-center">
                  <Download className="w-[19px] h-[19px] mr-2" />
                  EXPORT AUDIT LOG
                </button>
              </div>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Recent Trips Analysis */}
      <BorderGlow
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        backgroundColor="#120F17"
        className="clay-card p-8 border-white/5 shadow-2xl h-full"
      >
        <h2 className="text-xl font-bold text-white mb-8 tracking-tight uppercase text-left">Mission Profitability Audit</h2>

        <div className="space-y-4">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="clay-card p-6 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/80">{trip.id}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">{trip.route}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {trip.distance}</span>
                    <span className={`px-2 py-0.5 rounded-full ${trip.status === 'profitable' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'} border border-white/5`}>
                      {trip.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-[10.5px] font-black uppercase tracking-widest text-gray-700 leading-none mb-1">Fuel Core</div>
                    <div className="text-base font-bold text-white">{formatIndianCurrency(trip.fuelCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-black uppercase tracking-widest text-gray-700 leading-none mb-1">Driver Pay</div>
                    <div className="text-base font-bold text-white">{formatIndianCurrency(trip.driverPay)}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-black uppercase tracking-widest text-gray-700 leading-none mb-1">Net Yield</div>
                    <div className="text-base font-bold text-green-400">{formatIndianCurrency(trip.revenue - (trip.fuelCost + trip.tollCost + trip.driverPay))}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/40 leading-none mb-1 text-right">Revenue</div>
                    <div className="text-xl font-bold text-white tracking-tight text-right leading-none transition-all group-hover:text-blue-400">{formatIndianCurrency(trip.revenue)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BorderGlow>
    </div>
  );
}
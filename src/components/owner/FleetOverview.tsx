import React from 'react';
import {
  TrendingUp,
  Truck,
  Users,
  AlertTriangle,
  IndianRupee,
  MapPin,
  Fuel,
  Clock,
  Activity,
  Zap,
  Car
} from 'lucide-react';

export default function FleetOverview() {
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const kpiData = [
    {
      title: 'Gross Revenue',
      value: formatIndianCurrency(284760),
      change: '+12.5%',
      icon: IndianRupee,
      color: 'blue'
    },
    {
      title: 'Active Nodes',
      value: '34/38',
      change: '+2',
      icon: Car,
      color: 'blue'
    },
    {
      title: 'Pilot Network',
      value: '42',
      change: '+3',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Active Alerts',
      value: '7',
      change: '-2',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const topRoutes = [
    { route: 'Mumbai → Pune', trips: 47, profit: 142800, margin: '23.4%' },
    { route: 'Delhi → Agra', trips: 32, profit: 98600, margin: '21.8%' },
    { route: 'Bengaluru → Coorg', trips: 28, profit: 87400, margin: '19.6%' },
    { route: 'Mumbai → Goa', trips: 24, profit: 156000, margin: '28.7%' },
  ];

  const topDrivers = [
    { name: 'Suresh Singh', score: 9.2, trips: 34, earnings: 48600 },
    { name: 'Ramesh Sharma', score: 9.0, trips: 31, earnings: 44200 },
    { name: 'Vikram Patel', score: 8.8, trips: 29, earnings: 42800 },
  ];

  const recentAlerts = [
    { type: 'Service', message: 'MH 02 AB 1234 due for revision', time: '2h ago', severity: 'medium' },
    { type: 'Efficiency', message: 'DL 01 CD 5678 - Low yield detected', time: '4h ago', severity: 'high' },
    { type: 'Velocity', message: 'GJ 03 EF 9012 protocol breach', time: '6h ago', severity: 'high' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="clay-card clay-card-hover p-6 bg-zinc-900 border-white/5 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 clay-card bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40 group-hover:rotate-6 transition-transform">
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full tabular-nums font-['Space_Grotesk'] not-italic ${kpi.change.startsWith('+') ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 tabular-nums font-['Space_Grotesk'] not-italic">{kpi.value}</h3>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Route Profitability */}
        <div className="clay-card p-8 bg-zinc-900 border-white/5 shadow-2xl">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Route Efficiency Matrix</h3>
          </div>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="clay-card p-5 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{route.route}</h4>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-500 uppercase tracking-widest font-['Space_Grotesk'] not-italic">{route.margin} Yield</div>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-600">
                  <span className="tabular-nums font-['Space_Grotesk'] not-italic">{route.trips} Missions</span>
                  <span className="text-[14px] font-black text-white opacity-90 tabular-nums font-['Space_Grotesk'] not-italic">{formatIndianCurrency(route.profit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Leaderboard */}
        <div className="clay-card p-8 bg-zinc-900 border-white/5 shadow-2xl">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Pilot Ranking Archives</h3>
          </div>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div key={index} className="clay-card p-5 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 clay-card bg-zinc-800 border-none flex items-center justify-center text-white font-black text-xs shadow-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">{driver.name}</h4>
                      <div className="flex items-center space-x-4 text-[11px] font-bold uppercase tracking-widest text-gray-600 mt-1">
                        <span className="tabular-nums font-['Space_Grotesk'] not-italic">{driver.trips} Missions</span>
                        <span className="flex items-center text-blue-500 tabular-nums font-['Space_Grotesk'] not-italic"><Activity className="w-3 h-3 mr-1" /> Score: {driver.score}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-black text-green-400 tabular-nums font-['Space_Grotesk'] not-italic">
                    {formatIndianCurrency(driver.earnings)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Vehicle Health Summary */}
        <div className="clay-card p-8 bg-zinc-900 border-white/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Structural Health Summary</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { l: 'Nominal', v: 28, c: 'green' },
              { l: 'Alert', v: 6, c: 'yellow' },
              { l: 'Revised', v: 3, c: 'orange' },
              { l: 'Critical', v: 1, c: 'red' }
            ].map((stat, i) => (
              <div key={i} className={`clay-card clay-card-hover p-4 bg-${stat.c}-500/5 border-${stat.c}-500/20 text-center group`}>
                <div className={`text-2xl font-black text-${stat.c}-500 tabular-nums font-['Space_Grotesk'] not-italic group-hover:scale-110 transition-transform`}>{stat.v}</div>
                <div className={`text-[8px] font-black text-${stat.c}-500/60 uppercase tracking-widest mt-1 group-hover:text-${stat.c}-400 transition-colors`}>{stat.l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 px-2">
            {[
              { l: 'Fleet Efficiency Alpha', v: '14.2 km/l', p: 85 },
              { l: 'Operational Flux', v: '89.5%', p: 90 },
              { l: 'Mean Mission Distance', v: '167 km', p: 65 }
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  <span>{m.l}</span>
                  <span className="text-white tabular-nums font-['Space_Grotesk'] not-italic">{m.v}</span>
                </div>
                <div className="bg-black/40 rounded-full h-2 p-0.5 shadow-inner border border-white/5">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.2)]" style={{ width: `${m.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="clay-card p-8 bg-zinc-900 border-white/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">System Alerts</h3>
          </div>

          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="clay-card p-5 bg-black/20 border-white/5 border-l-4 border-l-red-600 shadow-inner group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${alert.severity === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                    {alert.type} protocol
                  </div>
                  <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest tabular-nums">{alert.time}</span>
                </div>
                <p className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{alert.message}</p>
              </div>
            ))}
          </div>
          <button className="w-full clay-btn bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white mt-8 h-12 text-[10px] uppercase tracking-widest">
            Access Full Logs
          </button>
        </div>
      </div>
    </div>
  );
}
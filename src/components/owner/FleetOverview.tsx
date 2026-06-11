import React, { useState, useEffect } from 'react';
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
import BorderGlow from '../BorderGlow';
import { useAuth } from '../../contexts/AuthContext';
import { fetchOwners, fetchPilots, fetchDevices, fetchAlerts } from '../../services/obdApi';

export default function FleetOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ownerData, setOwnerData] = useState<any>(null);
  const [fleetDevices, setFleetDevices] = useState<any[]>([]);
  const [fleetPilots, setFleetPilots] = useState<any[]>([]);
  const [fleetAlerts, setFleetAlerts] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [owners, devices, pilots, alerts] = await Promise.all([
          fetchOwners(),
          fetchDevices(),
          fetchPilots(),
          fetchAlerts()
        ]);

        // Find the current owner record by email (most reliable across Auth and DB)
        const currentOwner = owners.find((o: any) => o.email === user?.email);
        setOwnerData(currentOwner);

        // Filter devices belonging to this owner
        const myDevices = devices.filter((d: any) => d.ownerId === currentOwner?.id || d.owner === currentOwner?.name);
        setFleetDevices(myDevices);

        // Filter alerts for this owner's vehicles
        const vehicleIds = myDevices.map((d: any) => d.id);
        const myAlerts = alerts.filter((a: any) => 
          vehicleIds.includes(a.vehicle) || 
          (currentOwner?.name && a.vehicle.includes(currentOwner.name))
        );
        setFleetAlerts(myAlerts);

        // Filter pilots belonging to this owner only
        const myPilots = pilots.filter((p: any) => p.owner_id === currentOwner?.id);
        setFleetPilots(myPilots);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load owner dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000); // Sync every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">Syncing with Supabase Cluster...</p>
      </div>
    );
  }

  const kpiData = [
    {
      title: 'Gross Revenue',
      value: formatIndianCurrency(ownerData?.revenue || 0),
      change: '+8.4%',
      icon: IndianRupee,
      color: 'blue'
    },
    {
      title: 'Active Nodes',
      value: `${fleetDevices.filter(d => d.status === 'active').length}/${fleetDevices.length || 0}`,
      change: '+1',
      icon: Car,
      color: 'blue'
    },
    {
      title: 'Pilot Network',
      value: fleetPilots.length.toString(),
      change: '+2',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Active Alerts',
      value: fleetAlerts.length.toString(),
      change: fleetAlerts.length > 0 ? '+1' : '0',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const topRoutes: any[] = [];

  const topDrivers = fleetPilots.slice(0, 3).map((p, i) => ({
    name: p.name,
    score: p.safetyScore ?? p.safety_score ?? '—',
    trips: p.trips ?? 0,
    earnings: null // earnings not tracked yet
  }));

  const recentAlerts = fleetAlerts.slice(0, 3).map(a => ({
    type: a.type,
    message: a.description,
    time: 'Live',
    severity: a.severity === 'CRITICAL' ? 'high' : 'medium'
  }));

  return (
    <div className="space-y-10 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiData.map((kpi, index) => (
          <BorderGlow
            key={index}
            borderRadius={28}
            glowRadius={35}
            glowIntensity={1}
            backgroundColor="#120F17"
            className="border-white/5 group h-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 border-none flex items-center justify-center shadow-blue-900/40 group-hover:rotate-6 transition-transform">
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full tabular-nums font-sans not-italic ${kpi.change.startsWith('+') ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 tabular-nums font-sans not-italic">{kpi.value}</h3>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">{kpi.title}</p>
          </BorderGlow>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Route Profitability */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          backgroundColor="#120F17"
          className="p-8 border-white/5 shadow-2xl h-full"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Route Efficiency Matrix</h3>
          </div>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="p-5 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{route.route}</h4>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-500 uppercase tracking-widest font-sans not-italic">{route.margin} Yield</div>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-600">
                  <span className="tabular-nums font-sans not-italic">{route.trips} Missions</span>
                  <span className="text-[14px] font-black text-white opacity-90 tabular-nums font-sans not-italic">{formatIndianCurrency(route.profit)}</span>
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>

        {/* Driver Leaderboard */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          glowColor="280 60 70"
          backgroundColor="#120F17"
          className="p-8 border-white/5 shadow-2xl h-full"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Pilot Ranking Archives</h3>
          </div>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div key={index} className="p-5 bg-black/20 border-white/5 shadow-inner hover:bg-white/5 transition-all group rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border-none flex items-center justify-center text-white font-black text-xs shadow-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">{driver.name}</h4>
                      <div className="flex items-center space-x-4 text-[11px] font-bold uppercase tracking-widest text-gray-600 mt-1">
                        <span className="tabular-nums font-sans not-italic">{driver.trips} Missions</span>
                        <span className="flex items-center text-blue-500 tabular-nums font-sans not-italic"><Activity className="w-3 h-3 mr-1" /> Score: {driver.score}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-lg font-black text-green-400 tabular-nums font-sans not-italic">
                    {driver.earnings !== null ? formatIndianCurrency(driver.earnings) : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Vehicle Health Summary */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          backgroundColor="#120F17"
          className="p-8 border-white/5 h-full"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Structural Health Summary</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { l: 'Nominal', v: 0, c: 'green' },
              { l: 'Alert', v: 0, c: 'yellow' },
              { l: 'Revised', v: 0, c: 'orange' },
              { l: 'Critical', v: 0, c: 'red' }
            ].map((stat, i) => (
              <div key={i} className={`clay-card p-4 bg-${stat.c}-500/5 border-${stat.c}-500/20 text-center group`}>
                <div className={`text-2xl font-black text-${stat.c}-500 tabular-nums font-sans not-italic group-hover:scale-110 transition-transform`}>{stat.v}</div>
                <div className={`text-[8px] font-black text-${stat.c}-500/60 uppercase tracking-widest mt-1 group-hover:text-${stat.c}-400 transition-colors`}>{stat.l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 px-2">
            {[
              { l: 'Fleet Efficiency Alpha', v: '0 km/l', p: 0 },
              { l: 'Operational Flux', v: '0%', p: 0 },
              { l: 'Mean Mission Distance', v: '0 km', p: 0 }
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  <span>{m.l}</span>
                  <span className="text-white tabular-nums font-sans not-italic">{m.v}</span>
                </div>
                <div className="bg-black/40 rounded-full h-2 p-0.5 shadow-inner border border-white/5">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.2)]" style={{ width: `${m.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>

        {/* Recent Alerts */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          glowColor="0 80 50"
          backgroundColor="#120F17"
          className="p-8 border-white/5 h-full"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">System Alerts</h3>
          </div>

          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="p-5 bg-black/20 border-white/5 border-l-4 border-l-red-600 shadow-inner group">
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
        </BorderGlow>
      </div>
    </div>
  );
}
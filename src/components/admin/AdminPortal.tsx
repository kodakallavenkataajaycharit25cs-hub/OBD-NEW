import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  LogOut,
  Users,
  Car,
  Cpu,
  Clock,
  ArrowLeft,
  PlusCircle,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BorderGlow from '../BorderGlow';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { fetchOwners, fetchPilots, fetchDevices, createOwner, createPilot, updateOwner, updatePilot, deleteOwner, deletePilot } from '../../services/obdApi';
import { CreateView, UpdateView, RemoveView } from './CrudViews';
import { formatCurrentDate, formatCurrentTime } from '../../utils/dateFormat';

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Mock Database states for administration
  const [owners, setOwners] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  // Boot simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateMockDB = async () => {
    try {
      const [ownersData, pilotsData, devicesData] = await Promise.all([
        fetchOwners(),
        fetchPilots(),
        fetchDevices()
      ]);
      setOwners(ownersData || []);
      setPilots(pilotsData || []);
      setDevices(devicesData || []);
    } catch (error) {
      console.error('Failed to update Admin DB:', error);
    }
  };

  useEffect(() => {
    if (isBooted) {
      updateMockDB();
      const interval = setInterval(updateMockDB, 15 * 60 * 1000); // Sync mock DB every 15 mins
      return () => clearInterval(interval);
    }
  }, [isBooted]);

  const navigation = [
    { name: 'Client Overview', href: '/admin-dashboard', icon: Building2 },
    { name: 'New Client', href: '/admin-dashboard/create', icon: PlusCircle },
    { name: 'Update Records', href: '/admin-dashboard/update', icon: Edit },
    { name: 'Remove Records', href: '/admin-dashboard/remove', icon: Trash2 },
  ];

  if (!isBooted) {
    return (
      <div className="fixed inset-0 bg-[#120F17] flex flex-col items-center justify-center font-sans z-[9999] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />

        <div className="text-center relative max-w-lg w-full px-8">
          <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border-2 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center mx-auto mb-8 animate-pulse">
            <ShieldCheck className="w-12 h-12 text-blue-400" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-2 font-sans">SUKRUTHA ADMIN CORE</h2>
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  // Dashboard Overview View
  const DashboardView = () => {

    // Generate real client stats from data
    const clientStats = owners.map((owner, idx) => {
      const ownerDevices = devices.filter(d => d.owner === owner.name || d.ownerId === owner.id);
      
      // Filter pilots if they were linked to owners (assuming name match for demo)
      const driverCount = pilots.filter(p => p.owner_id === owner.id).length || Math.floor((owner.fleetSize || 5) * 1.1);
      const deviceCount = ownerDevices.length;

      return {
        ...owner,
        driverCount,
        deviceCount
      };
    });

    const totalClients = owners.length;
    const totalDrivers = pilots.length;
    const totalDevices = devices.length;

    const selectedClient = selectedClientId ? clientStats.find(c => (c.id || c.name) === selectedClientId) : null;

    if (selectedClient) {
      // Get real drivers for this client
      const clientDrivers = pilots.filter(p => p.owner_id === selectedClient.id).map(p => ({
        id: p.id,
        name: p.name,
        status: p.availability || p.status || 'off-duty',
        rating: p.rating || 5.0
      }));

      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedClientId(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
            </button>
            <div className="text-right">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">{selectedClient.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Driver Roster</p>
            </div>
          </div>

          <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientDrivers.map(driver => (
                <div key={driver.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Car className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{driver.name}</h4>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{driver.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${driver.status === 'on-duty' ? 'text-green-400' : 'text-gray-500'}`}>
                      {driver.status}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-400">★ {driver.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Top Aggregated Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Clients', value: totalClients || 5, desc: 'Registered Orgs', icon: Building2, color: 'blue' },
            { label: 'Total Drivers', value: totalDrivers || 120, desc: 'Active Personnel', icon: Users, color: 'purple' },
            { label: 'Total Devices', value: totalDevices || 150, desc: 'Installed Units', icon: Cpu, color: 'green' },
          ].map((stat, i) => (
            <BorderGlow
              key={i}
              borderRadius={28}
              glowColor={stat.color === 'blue' ? '59 130 246' : stat.color === 'purple' ? '168 85 247' : '34 197 94'}
              glowRadius={30}
              glowIntensity={0.8}
              backgroundColor="#120F17"
              className="p-6 border-white/5 hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-[#120F17] border border-white/5 group-hover:border-blue-500/30 transition-colors`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                </div>
              </div>

              <div className="text-3xl font-black text-white tracking-tight mb-1 font-sans">{stat.value}</div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wide font-bold">{stat.desc}</p>
            </BorderGlow>
          ))}
        </div>

        {/* Client Breakdown Grid */}
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative shadow-xl">
          <div className="absolute top-0 left-0 w-32 h-[2px] bg-blue-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center font-sans">
            <Building2 className="w-4 h-4 text-blue-500 mr-2" /> Operations Breakdown by Client
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clientStats.map((client, index) => (
              <div 
                key={client.id || index} 
                onClick={() => setSelectedClientId(client.id || client.name)}
                className="p-5 bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all rounded-2xl flex flex-col gap-4 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-blue-400 transition-colors">{client.name}</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">ID: {client.id || `ORG-${index+1}`}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center justify-between hover:bg-purple-500/10 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Drivers</span>
                    </div>
                    <span className="text-sm font-black text-white">{client.driverCount}</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Devices</span>
                    </div>
                    <span className="text-sm font-black text-white">{client.deviceCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#120F17] text-gray-200 flex font-sans overflow-hidden selection:bg-blue-500/30 relative">

      {/* Laser HUD Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Cybernetic Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-500 p-4 flex flex-col z-20 relative`}>
        <div className="h-full flex flex-col bg-[#120F17]/80 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden rounded-2xl relative">

          <div className={`mb-8 flex ${sidebarOpen ? 'p-6' : 'p-4 justify-center'} items-center`}>
            {sidebarOpen ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Admin Core</span>
                </div>
                <h1 className="text-xl font-black tracking-tighter leading-none text-white uppercase font-sans">SUKRUTHA</h1>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mt-1">Operations Control</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            )}
          </div>

          <nav className={`flex-1 ${sidebarOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto custom-scrollbar`}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname === '/admin-dashboard' && item.href === '/admin-dashboard');

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${sidebarOpen ? 'px-4 justify-start' : 'justify-center'} py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive
                    ? 'bg-blue-600 border border-transparent text-white shadow-lg shadow-blue-900/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <div className={`p-2 rounded-xl transition-all shrink-0 ${isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5 group-hover:scale-110'}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {sidebarOpen && (
                    <span className="ml-4 text-xs font-bold uppercase tracking-widest leading-none relative z-10 font-sans">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Dynamic Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">

        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#120F17]/50 backdrop-blur-md">
          <div className="flex items-center space-x-6">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 leading-none mb-1.5 font-sans">Client Operations</h2>
              <span className="text-xl font-black text-white tracking-tighter uppercase font-sans">Admin Interface</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">ADMIN</span>
                <span className="text-xs font-black text-white uppercase tracking-tight">{user?.name}</span>
              </div>
              <ThemeToggle />
              <button
                onClick={() => logout()}
                className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center transition-all group"
              >
                <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Router view Rendering */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1 font-sans" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
                Client Operations Overview
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest font-sans">SUKRUTHA MOBILITY CONTROL CORE</p>
            </div>
            <div className="text-right font-sans">
              <div className="text-xl font-black text-blue-400 flex items-center justify-end space-x-2">
                <Clock className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{formatCurrentTime()}</span>
              </div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                {formatCurrentDate()}
              </div>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto font-sans">
            <Routes>
              <Route index element={<DashboardView />} />
              <Route path="create" element={<CreateView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="update" element={<UpdateView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="remove" element={<RemoveView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

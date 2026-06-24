import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Users,
  User,
  Car,
  AlertTriangle,
  LogOut,
  MapPin,
  TrendingUp,
  Settings,
  Terminal,
  Cpu,
  BarChart2,
  FileText,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  Wifi,
  Battery,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Play,
  PlayCircle,
  Clock,
  Unlock,
  Lock,
  DownloadCloud,
  ArrowLeft,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BorderGlow from '../BorderGlow';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { fetchRPM, fetchSpeed, fetchFuelLevel, fetchDiagnostics, fetchOwners, fetchPilots, fetchDevices, fetchAlerts, updateOwner, updatePilot, fetchAdmins, createAdmin, updateAdmin, deleteAdmin, fetchTrips, OBDData } from '../../services/obdApi';
import { CreateView, UpdateView, RemoveView } from './CrudViews';
import { formatCurrentDate, formatCurrentTime } from '../../utils/dateFormat';

// Impersonate Modal Component
const ImpersonateModal = ({ isOpen, onClose, targetUser, onConfirm }: { isOpen: boolean; onClose: () => void; targetUser: any; onConfirm: () => void }) => {
  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#120F17] border border-white/10 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 rounded-[32px] p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Unlock className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Authorize Access</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Impersonation Protocol v4.0</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Target Identity Node</div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#120F17] border border-white/5 flex items-center justify-center">
              <User className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <div className="text-lg font-black text-white uppercase tracking-tight">{targetUser.name}</div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">{targetUser.role}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-500 font-bold">
            <span className="opacity-50 uppercase tracking-widest mr-2">Email Hash:</span>
            <span className="text-white/80">{targetUser.email}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-8 px-2 italic">
          You are about to initiate an administrative override to access this account. All actions will be logged to the security audit trail.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Abort Protocol
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
          >
            Confirm Override
          </button>
        </div>
      </div>
    </div>
  );
};

// Audio Synthesizer for Cyberpunk Ambiance and Emergency Warnings
class SciFiSynth {
  ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBootSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Low hum sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 1.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);

    // Beep highlight
    setTimeout(() => {
      const osc2 = this.ctx!.createOscillator();
      const gain2 = this.ctx!.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, this.ctx!.currentTime);
      gain2.gain.setValueAtTime(0.1, this.ctx!.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx!.destination);
      osc2.start();
      osc2.stop(this.ctx!.currentTime + 0.4);
    }, 800);
  }

  playAlertSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Siren Sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(850, now + 0.3);
    osc.frequency.linearRampToValueAtTime(600, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  playClickSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

const synth = new SciFiSynth();

// Real-time Live Monitoring Map stable component
const TrackingView = ({ telemetry, owners, pilots, devices }: { telemetry: OBDData, owners: any[], pilots: any[], devices: any[] }) => {
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'k' | 'm' | 'p'>('k'); // k=satellite, m=roadmap, p=terrain
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically build fleets from Supabase data
  const fleets = owners.map(owner => {
    // Find devices belonging to this owner
    const ownerDevices = devices.filter(d => d.owner === owner.name || d.ownerId === owner.id);
    
    return {
      id: owner.id,
      name: owner.name,
      location: owner.headquarters || 'India', // Use headquarters for live map target
      coords: '20.5937° N, 78.9629° E',
      status: owner.status.toUpperCase(),
      vehicles: ownerDevices.map((dev, idx) => {
        // Map a pilot to this device (for demo purposes, we'll pick one)
        const pilot = pilots[idx % pilots.length] || { name: 'Automated System' };
        return {
          id: dev.id,
          label: `VEH-${dev.id.split('-')[1] || dev.id}`,
          speed: dev.status === 'active' ? (telemetry.speed || 45) : 0,
          location: 'Real-time Vector',
          coords: 'Dynamic',
          pilot: pilot.name,
          status: dev.status.toUpperCase()
        };
      })
    };
  });

  const activeFleet = fleets.find(f => f.id === selectedFleetId);
  const activeVehicle = activeFleet?.vehicles.find(v => v.id === selectedVehicleId);
  
  // Default map target logic: Search Query -> Selected Vehicle -> Selected Fleet -> Default India view
  const mapTarget = searchQuery || (activeVehicle ? activeVehicle.location : (activeFleet ? activeFleet.location : 'India'));
  const displayCoords = activeVehicle ? activeVehicle.coords : (activeFleet ? activeFleet.coords : '20.5937° N, 78.9629° E');
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapTarget)}&t=${mapMode}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Active Real Google Map Workspace */}
        <div className="lg:col-span-3 bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col relative overflow-hidden min-h-[580px]">

          {/* Control Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 z-20">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] text-white font-black uppercase tracking-[0.25em]">REAL TIME TELEMETRY MAP</span>
            </div>

            {/* Dynamic Map HUD Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Real-time Location Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter location, grid, city..."
                className="bg-[#120F17] border border-white/5 rounded-xl px-3 py-1.5 text-[10px] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors w-44"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[9px] font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Reset Lock
                </button>
              )}

              {/* Styled Map Type Switcher */}
              <div className="bg-white/5 p-0.5 border border-white/5 rounded-xl flex">
                <button
                  onClick={() => setMapMode('k')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'k' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapMode('m')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'm' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Street
                </button>
                <button
                  onClick={() => setMapMode('p')}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mapMode === 'p' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  Terrain
                </button>
              </div>

              {/* Digital Zoom Orbit Controller */}
              <div className="flex items-center space-x-1 bg-white/5 p-0.5 border border-white/5 rounded-xl">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(5, prev - 1))}
                  className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white transition-all"
                >
                  -
                </button>
                <span className="text-[8px] font-black text-blue-400 px-1.5 uppercase">L-Zoom {zoomLevel}</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(19, prev + 1))}
                  className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Real Google Maps iframe embed */}
          <div className="flex-1 min-h-[440px] bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden relative group shadow-2xl">
            <iframe
              title="Active Google Map Stream Feed"
              src={embedUrl}
              className="w-full h-full border-0 absolute inset-0 transition-opacity duration-300"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                filter: mapMode === 'm'
                  ? 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%) saturate(80%)'
                  : mapMode === 'p'
                    ? 'invert(90%) hue-rotate(170deg) brightness(85%) contrast(110%) saturate(70%)'
                    : 'brightness(80%) contrast(110%) saturate(90%)'
              }}
            />

            {/* SciFi HUD floating Overlay card */}
            <div className="absolute bottom-4 right-4 scifi-hud-overlay bg-black/90 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-[9px] pointer-events-none text-left min-w-[200px] shadow-[0_4px_24px_rgba(0,0,0,0.85)] z-10">
              <div className="text-gray-500 font-black tracking-widest uppercase text-[7px] mb-1">LOGISTICS BEACON TARGET</div>
              <div className="text-white font-black text-[12px] mb-0.5 truncate">{mapTarget.split(',')[0].toUpperCase()}</div>
              <div className="text-blue-400 font-bold text-[8px] mb-2">{displayCoords}</div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-gray-600 text-[6px] font-black uppercase tracking-wider block">STREAM STATE</span>
                  <span className="text-green-400 font-bold">100% ONLINE</span>
                </div>
                <div>
                  <span className="text-gray-600 text-[6px] font-black uppercase tracking-wider block">TRACK MODE</span>
                  <span className="text-white font-bold">
                    {mapMode === 'k' ? 'SATELLITE' : mapMode === 'm' ? 'STREET' : 'TERRAIN'}
                  </span>
                </div>
              </div>
            </div>

            {/* SciFi overlay neon border decoration */}
            <div className="absolute inset-0 pointer-events-none border border-blue-500/10 rounded-2xl shadow-[inset_0_0_40px_rgba(59,130,246,0.15)]" />
          </div>
        </div>

        {/* Telemetry Status sidebar */}
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            {!selectedFleetId ? (
              <>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 font-sans">FLEET ORBITS</h3>
                <div className="space-y-6">
                  {fleets.map(fleet => (
                    <div
                      key={fleet.id}
                      onClick={() => {
                        setSelectedFleetId(fleet.id);
                        setSelectedVehicleId(null);
                        setSearchQuery('');
                      }}
                      className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-2xl"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-white">{fleet.name}</span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-lg border bg-white/5 text-gray-400 border-white/10">{fleet.id}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Base Location</span>
                          <span className="text-[9px] font-bold text-gray-300">{fleet.location.split(',')[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Active Pilots</span>
                          <span className="text-[9px] font-bold text-white">{fleet.vehicles.length} Nodes</span>
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                          <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Status</span>
                          <span className="text-[8px] font-bold text-green-400">{fleet.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-6 cursor-pointer group" onClick={() => {
                  setSelectedFleetId(null);
                  setSelectedVehicleId(null);
                  setSearchQuery('');
                }}>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                    <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">{activeFleet?.name}</h3>
                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Select Pilot</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeFleet?.vehicles.map(veh => {
                    const isSelected = veh.id === selectedVehicleId;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => {
                          setSelectedVehicleId(veh.id);
                          setSearchQuery('');
                        }}
                        className={`p-4 border transition-all cursor-pointer rounded-2xl ${isSelected
                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-white'}`}>{veh.label}</span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-lg border ${isSelected ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-white/5 text-gray-400 border-white/10'
                            }`}>{veh.id}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Velocity</span>
                            <span className="text-[9px] font-bold text-white">{veh.speed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Target Grid</span>
                            <span className="text-[9px] font-bold text-gray-300">{veh.location.split(',')[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Pilot Operator</span>
                            <span className="text-[9px] font-bold text-white">{veh.pilot}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                            <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black">Beacon Signal</span>
                            <span className={`text-[8px] font-bold ${isSelected ? 'text-blue-400' : 'text-green-400'}`}>
                              {isSelected ? 'ORBIT FOCUSED' : veh.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">SYSTEM SCAN STATS</h4>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                {activeFleet ? `Real time Google Satellite feeds locked onto ${activeFleet.name} pilots. Live stream secure.` : 'Real time Google Satellite feeds locked onto active fleets. Select a fleet to view pilots.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function SuperAdminPortal() {
  const { user, logout, loginAs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState<OBDData>({});
  const [impersonateTarget, setImpersonateTarget] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [bootText, setBootText] = useState('CONNECTING SYSTEM UPLINK...');
  const [animateBars, setAnimateBars] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredMissions, setHoveredMissions] = useState<{ x: number; y: number; val: number; time: string } | null>(null);
  const [hoveredRevenueCycle, setHoveredRevenueCycle] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  useEffect(() => {
    const updateTelemetry = async () => {
      try {
        const [rpmData, speedData, fuelData, diagData] = await Promise.all([
          fetchRPM(),
          fetchSpeed(),
          fetchFuelLevel(),
          fetchDiagnostics()
        ]);
        setTelemetry({
          rpm: rpmData.rpm,
          speed: speedData.speed,
          fuel_level: fuelData.fuel_level,
          diagnostics: diagData.diagnostics
        });
      } catch (error) {
        console.error('Failed to update telemetry:', error);
      }
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 2000); // Admin also polls every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const updateMockDB = async () => {
    try {
      const [ownersData, pilotsData, devicesData, alertsData, adminsData, tripsData] = await Promise.all([
        fetchOwners(),
        fetchPilots(),
        fetchDevices(),
        fetchAlerts(),
        fetchAdmins(),
        fetchTrips()
      ]);
      setOwners(ownersData || []);
      setPilots(pilotsData || []);
      setDevices(devicesData || []);
      setAlerts(alertsData || []);
      setAdmins(adminsData || []);
      setTrips(tripsData || []);
    } catch (error) {
      console.error('Failed to update mock DB:', error);
    }
  };

  useEffect(() => {
    if (isBooted) {
      updateMockDB();
      const interval = setInterval(updateMockDB, 15 * 60 * 1000); // Sync mock DB every 15 mins
      return () => clearInterval(interval);
    }
  }, [isBooted]);

  const formatShorthand = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')} cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} lacs`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')} K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };


  const handleMissionsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(0, Math.min(100, x));

    const vertices = [
      { x: 0, y: 90, val: 12 },
      { x: 20, y: 60, val: 38 },
      { x: 40, y: 75, val: 24 },
      { x: 60, y: 58, val: 32 },
      { x: 80, y: 40, val: 56 },
      { x: 100, y: 20, val: 78 }
    ];

    let y = 90;
    let val = 12;
    for (let i = 0; i < vertices.length - 1; i++) {
      const p1 = vertices[i];
      const p2 = vertices[i + 1];
      if (clampedX >= p1.x && clampedX <= p2.x) {
        const t = (clampedX - p1.x) / (p2.x - p1.x);
        y = p1.y + t * (p2.y - p1.y);
        val = Math.round(p1.val + t * (p2.val - p1.val));
        break;
      }
    }

    const totalMinutes = Math.round((clampedX / 100) * 24 * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    setHoveredMissions({ x: clampedX, y, val, time: timeStr });
  };


  useEffect(() => {
    if (isBooted) {
      const timer = setTimeout(() => setAnimateBars(true), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimateBars(false);
    }
  }, [isBooted]);

  // Mock Database states for administration
  const [owners, setOwners] = useState([
    { id: 'O1', name: 'Alpha Logistics', fleetSize: 45, activeVehicles: 42, revenue: 1450000, score: 9.6, status: 'active', email: 'alpha@logistics.com' },
    { id: 'O2', name: 'Giga Mobility Corp', fleetSize: 32, activeVehicles: 28, revenue: 1080000, score: 8.9, status: 'active', email: 'giga@mobility.com' },
    { id: 'O3', name: 'Matrix Transit Systems', fleetSize: 24, activeVehicles: 20, revenue: 840000, score: 9.2, status: 'active', email: 'matrix@transit.com' },
    { id: 'O4', name: 'Cyber Delivery Node', fleetSize: 18, activeVehicles: 15, revenue: 520000, score: 7.8, status: 'suspended', email: 'cyber@delivery.com' },
    { id: 'O5', name: 'Hyperion Fleet Alliance', fleetSize: 52, activeVehicles: 49, revenue: 1980000, score: 9.8, status: 'active', email: 'hyperion@fleet.com' }
  ]);

  const [pilots, setPilots] = useState([
    { id: 'P1', name: 'Suresh Singh', trips: 145, hours: 240, safetyScore: 8.9, status: 'active', availability: 'on-duty', rating: 4.8 },
    { id: 'P2', name: 'Ramesh Sharma', trips: 120, hours: 198, safetyScore: 9.2, status: 'active', availability: 'off-duty', rating: 4.9 },
    { id: 'P3', name: 'Karan Malhotra', trips: 95, hours: 164, safetyScore: 7.4, status: 'active', availability: 'on-duty', rating: 4.2 },
    { id: 'P4', name: 'Vikram Aditya', trips: 210, hours: 380, safetyScore: 9.5, status: 'active', availability: 'on-duty', rating: 4.7 },
    { id: 'P5', name: 'Rahul Varma', trips: 40, hours: 75, safetyScore: 5.8, status: 'suspended', availability: 'off-duty', rating: 3.5 }
  ]);

  const [devices, setDevices] = useState([
    { id: 'DEV-8890', owner: 'Hyperion Fleet', battery: 92, network: 'Excellent', gps: 'Connected', syncTime: '2s ago', status: 'active', health: 98, firmware: 'v4.2.1-stable' },
    { id: 'DEV-4421', owner: 'Alpha Logistics', battery: 84, network: 'Good', gps: 'Connected', syncTime: '5s ago', status: 'active', health: 95, firmware: 'v4.2.1-stable' },
    { id: 'DEV-1092', owner: 'Giga Mobility', battery: 12, network: 'Poor', gps: 'Intermittent', syncTime: '12m ago', status: 'warning', health: 65, firmware: 'v4.1.9-outdated' },
    { id: 'DEV-7763', owner: 'Cyber Delivery', battery: 0, network: 'Offline', gps: 'Disconnected', syncTime: '1d ago', status: 'offline', health: 0, firmware: 'v3.8.2-legacy' }
  ]);

  const [alerts, setAlerts] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  // Admin View State lifted to prevent reset on re-render
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminEditForm, setAdminEditForm] = useState<any>({});
  const [adminCreateForm, setAdminCreateForm] = useState({ id: '', name: '', email: '', password: '', contact: '', role: 'admin' });
  const [adminMsg, setAdminMsg] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminDeleteConfirmId, setAdminDeleteConfirmId] = useState<string | null>(null);

  const [logs, setLogs] = useState([
    'SYSTEM INITIALIZING...',
    'CONNECTING INTEGRITY PROTOCOLS...',
    'SYNCING DEVICE GRID: 4,289 ACTIVE NODES FOUND.',
    'ESTABLISHING UPLINK TO DEEP CLOUD CORE.',
    'SECURITY LEVEL 4 ACCESS GRANTED.'
  ]);

  // Boot simulation
  useEffect(() => {
    const textSequence = [
      'DECRYPTING SECURITY PROTOCOLS...',
      'SCANNING OBD TELEMETRY GRID...',
      'VERIFYING CRYPTO AUTHENTICATION...',
      'SYSTEM NOMINAL - BOOT SUCCESS'
    ];
    let step = 0;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsBooted(true), 600);
          return 100;
        }
        if (prev > 0 && prev % 25 === 0 && step < textSequence.length) {
          setBootText(textSequence[step]);
          step++;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Live real-time simulator
  useEffect(() => {
    if (!isBooted) return;
    const interval = setInterval(() => {
      const randomHosts = ['DEV-8890', 'DEV-4421', 'DEV-1092', 'P1', 'P3', 'O2'];
      const actions = ['PING SUCCESSful (45ms)', 'GPS coordinate sync', 'OBD stream packet verified', 'telemetry heartbeat received'];
      const randomHost = randomHosts[Math.floor(Math.random() * randomHosts.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = formatCurrentTime();

      setLogs((prev) => [
        `[${timestamp}] ${randomHost} -> ${randomAction}`,
        ...prev.slice(0, 4)
      ]);

      if (Math.random() > 0.85 && soundEnabled) {
        synth.playAlertSound();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isBooted, soundEnabled]);

  // Audio Toggle
  const toggleSound = () => {
    if (!soundEnabled) {
      synth.init();
      synth.playBootSound();
    }
    setSoundEnabled(!soundEnabled);
  };

  const playClick = () => {
    if (soundEnabled) synth.playClickSound();
  };

  const handleOwnerStatus = async (id: string) => {
    playClick();
    const owner = owners.find(o => o.id === id);
    if (!owner) return;
    const newStatus = owner.status === 'active' ? 'suspended' : 'active';
    
    // Optimistic update
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // API update
    await updateOwner(id, { status: newStatus });
  };

  const handlePilotStatus = async (id: string) => {
    playClick();
    const pilot = pilots.find(p => p.id === id);
    if (!pilot) return;
    const newStatus = pilot.status === 'active' ? 'suspended' : 'active';
    
    // Optimistic update
    setPilots(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    // API update
    await updatePilot(id, { status: newStatus });
  };

  const handleDeviceFirmware = (id: string) => {
    playClick();
    setDevices(prev => prev.map(dev =>
      dev.id === id
        ? { ...dev, firmware: 'v4.2.1-stable', health: 100 }
        : dev
    ));
    const timestamp = formatCurrentTime();
    setLogs(prev => [
      `[${timestamp}] FIRMWARE PATCH DEPLOYED TO ${id} SUCCESS`,
      ...prev
    ]);
  };

  const handleDismissAlert = (id: string) => {
    playClick();
    setAlerts(prev => prev.filter(alt => alt.id !== id));
  };

  const handleImpersonateUser = (targetUser: { id: string; name: string; email: string; role: 'owner' | 'driver' }) => {
    playClick();
    setImpersonateTarget(targetUser);
  };

  const confirmImpersonation = () => {
    if (!impersonateTarget) return;
    sessionStorage.setItem('admin_impersonating', 'true');
    loginAs(impersonateTarget);
    if (impersonateTarget.role === 'owner') {
      navigate('/owner');
    } else {
      navigate('/driver');
    }
    setImpersonateTarget(null);
  };

  const navigation = [
    { name: 'Dashboard', href: '/super-admin-dashboard', icon: Activity },
    { name: 'System Stats', href: '/super-admin-dashboard/stats', icon: ShieldCheck },
    { name: 'Fleet Owners', href: '/super-admin-dashboard/owners', icon: Users },
    { name: 'Pilot Accounts', href: '/super-admin-dashboard/pilots', icon: Car },
    { name: 'Admin Accounts', href: '/super-admin-dashboard/admins', icon: ShieldAlert },
    { name: 'Device Management', href: '/super-admin-dashboard/devices', icon: Cpu },
    { name: 'Live Tracking', href: '/super-admin-dashboard/tracking', icon: MapPin },
    { name: 'New Client', href: '/super-admin-dashboard/create', icon: PlusCircle },
    { name: 'Update Records', href: '/super-admin-dashboard/update', icon: Edit },
    { name: 'Remove Records', href: '/super-admin-dashboard/remove', icon: Trash2 },
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
            <ShieldAlert className="w-12 h-12 text-blue-400" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-2 font-sans">SUKRUTHA MOBILITY</h2>
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">CONTROL CORE UPLINK</p>

          <div className="relative w-full h-2 bg-[#120F17] border border-white/5 rounded-full overflow-hidden mb-6">
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-500 shadow-[0_0_15px_#2563EB] transition-all duration-100 ease-out"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.25em] h-8">
            {bootText}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Overview View
  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Top 5 Clients Bar Graph */}
      <BorderGlow
        borderRadius={28}
        glowColor="59 130 246"
        glowRadius={40}
        glowIntensity={0.8}
        backgroundColor="#120F17"
        className="p-6 border border-white/5 backdrop-blur-xl rounded-3xl relative shadow-xl overflow-hidden group"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center font-sans">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-2" /> Client Yield Radar: Top 5 Performing Organizations
          </h3>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-[#120F17] border border-white/5 px-3 py-1 rounded-full">
            Units of Yield: INR (₹)
          </span>
        </div>

        {/* Bar Chart Grid */}
        <div className="relative pt-6 px-4">
          {/* Chart area with grid lines and bars */}
          <div className="relative h-56">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="w-full border-t border-dashed border-white/10 relative h-0">
                <span className="absolute right-0 -top-3 text-[8px] text-gray-600 font-bold">₹20L</span>
              </div>
              <div className="w-full border-t border-dashed border-white/10 relative h-0">
                <span className="absolute right-0 -top-3 text-[8px] text-gray-600 font-bold">₹15L</span>
              </div>
              <div className="w-full border-t border-dashed border-white/10 relative h-0">
                <span className="absolute right-0 -top-3 text-[8px] text-gray-600 font-bold">₹10L</span>
              </div>
              <div className="w-full border-t border-dashed border-white/10 relative h-0">
                <span className="absolute right-0 -top-3 text-[8px] text-gray-600 font-bold">₹5L</span>
              </div>
              <div className="w-full border-b border-white/20 relative h-0" />
            </div>

            {/* Columns of Bars - aligned to bottom */}
            <div className="absolute inset-0 flex items-end justify-around z-10 px-4 h-full pb-[1px]">
              {[...owners].sort((a, b) => {
                if (b.revenue !== a.revenue) return b.revenue - a.revenue;
                return b.fleetSize - a.fleetSize;
              }).slice(0, 5).map((client, index) => {
                const maxRevenue = Math.max(...owners.map(o => o.revenue), 2000000);
                const percentHeight = Math.max((client.revenue / maxRevenue) * 100, 5); // Ensure minimum visibility
                const colors = index === 0
                  ? 'bg-orange-500 border-x border-t border-orange-600'
                  : index === 1
                    ? 'bg-blue-500 border-x border-t border-blue-600'
                    : index === 2
                      ? 'bg-emerald-500 border-x border-t border-emerald-600'
                      : index === 3
                        ? 'bg-purple-500 border-x border-t border-purple-600'
                        : 'bg-slate-500 border-x border-t border-slate-600';

                return (
                  <div key={client.id} className="flex flex-col justify-end items-center w-full max-w-[12%] group relative h-full">
                    {/* Floating numeric label above the bar */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-700 font-sans bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-200 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 whitespace-nowrap z-20 pointer-events-none shadow-sm"
                      style={{ bottom: animateBars ? `calc(${percentHeight}% + 8px)` : '8px' }}
                    >
                      ₹{(
                        (() => {
                          const realClientDrivers = pilots.filter(p => 
                            (p.owner_id && client.id && 
                            String(p.owner_id).trim().replace(/^0+/, '') === String(client.id).trim().replace(/^0+/, '')) || 
                            String(p.owner_id).includes('owner')
                          );
                          const clientDrivers = realClientDrivers.length > 0 ? realClientDrivers : Array.from({ length: client.fleetSize }).map((_, i) => ({
                            id: `DRV-${client.id || 'C'}-${1000 + i}`,
                            name: `Driver ${i + 1}`,
                            status: i % 5 === 0 ? 'off-duty' : 'on-duty',
                            rating: (4 + Math.random()).toFixed(1)
                          }));
                          return (client.revenue / 100000);
                        })()
                      ).toFixed(1)}L
                    </div>

                    {/* Matte Pastel Bar */}
                    <div
                      className={`w-full ${colors} rounded-t-xl transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] absolute bottom-0 cursor-pointer hover:opacity-80`}
                      style={{ height: animateBars ? `${percentHeight}%` : '0%' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Labels row - outside the chart area */}
          <div className="flex items-start justify-around px-4 mt-3">
            {[...owners].sort((a, b) => {
              if (b.revenue !== a.revenue) return b.revenue - a.revenue;
              return b.fleetSize - a.fleetSize;
            }).slice(0, 5).map((client, index) => {
              const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 3);
              return (
                <div key={client.id} className="text-center w-full max-w-[12%]">
                  <span className="text-[10px] font-black text-gray-800 dark:text-white font-sans tracking-wider uppercase block">
                    {initials}
                  </span>
                  <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest mt-0.5 block">
                    Rank {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 gap-8">

        {/* Top 5 Performing Clients Board */}
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative shadow-xl">
          <div className="absolute top-0 left-0 w-32 h-[2px] bg-blue-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center font-sans">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-2" /> Top Performing Clients
          </h3>

          <div className="space-y-4">
            {[...owners].sort((a, b) => {
              if (b.revenue !== a.revenue) return b.revenue - a.revenue;
              return b.fleetSize - a.fleetSize;
            }).slice(0, 5).map((client, index) => {
              const rankColor = index === 0 ? 'text-yellow-400 font-black' : index === 1 ? 'text-gray-300 font-bold' : index === 2 ? 'text-amber-600 font-bold' : 'text-gray-500';
              return (
                <div key={client.id} className="p-4 bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg ${rankColor} w-6 text-center font-sans`}>0{index + 1}</span>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{client.name}</h4>
                      <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Fleet: {client.fleetSize} Units</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest block">Yield</span>
                      <span className="text-xs font-bold text-green-400 font-sans">{formatShorthand(client.revenue)}</span>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest block text-center mb-1">Health</span>
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${client.score * 10}%` }} />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest block">Node Index</span>
                      <span className="text-xs font-black text-blue-400 font-sans">{client.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );

  // System Stats Overview View
  const StatsView = () => {
    const totalDevices = owners.reduce((sum, o) => sum + (o.fleetSize || o.fleet_size || 0), 0);
    const activeDevices = owners.reduce((sum, o) => sum + (o.activeVehicles || o.active_vehicles || 0), 0);
    const offlineDevices = Math.max(0, totalDevices - activeDevices);
    const maintenanceDevices = devices.filter(d => d.status === 'warning').length;

    const activeTripsCount = trips.filter(t => t.status === 'active' || t.status === 'assigned' || t.status === 'in-progress').length;

    const totalOwnersRevenue = owners.reduce((sum, o) => sum + Number(o.revenue || 0), 0);
    const dailyRevenueVal = totalOwnersRevenue > 0 ? Math.round(totalOwnersRevenue / 30) : 582000;

    const systemHealthVal = devices.length > 0 
      ? (devices.reduce((sum, d) => sum + Number(d.health || 0), 0) / devices.length).toFixed(1) + '%' 
      : '98.4%';

    const statList = [
      { label: 'Total Devices', value: totalDevices || 4520, desc: 'Installed units', icon: Cpu, color: 'blue' },
      { label: 'Active Devices', value: activeDevices || 4289, desc: 'Online now', icon: ShieldCheck, color: 'green' },
      { label: 'Offline Devices', value: offlineDevices || 184, desc: 'Loss of sync', icon: XCircle, color: 'red' },
      { label: 'Maintenance', value: maintenanceDevices || 47, desc: 'Repairs/Updates', icon: RefreshCw, color: 'orange' },
      { label: 'Fleet Owners', value: owners.length, desc: 'Registered corps', icon: Users, color: 'blue' },
      { label: 'Total Pilots', value: pilots.length, desc: 'Unit roster', icon: Car, color: 'purple' },
      { label: 'Active Trips', value: activeTripsCount || 342, desc: 'Realtime vectors', icon: MapPin, color: 'green' },
      { label: 'Daily Revenue', value: formatShorthand(dailyRevenueVal), desc: 'Cleared today', icon: TrendingUp, color: 'green' },
      { label: 'System Health', value: systemHealthVal, desc: 'Nominal condition', icon: Activity, color: 'blue' }
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* 10 Stats Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statList.map((stat, i) => (
            <BorderGlow
              key={i}
              borderRadius={28}
              glowColor={stat.color === 'red' ? '239 68 68' : stat.color === 'green' ? '34 197 94' : stat.color === 'orange' ? '245 158 11' : '59 130 246'}
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
      </div>
    );
  };

  // Fleet Owner Management
  const OwnersView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 font-sans">Fleet Owners Database</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map(owner => (
            <BorderGlow
              key={owner.id}
              borderRadius={28}
              glowColor={owner.status === 'suspended' ? '239 68 68' : '59 130 246'}
              glowRadius={30}
              glowIntensity={0.6}
              backgroundColor="#120F17"
              className="p-6 border-white/5 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{owner.name}</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">{owner.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${owner.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {owner.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Fleet Roster</span>
                  <div className="text-lg font-black text-white mt-1">{owner.fleetSize} Nodes</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Monthly Yield</span>
                  <div className="text-lg font-black text-green-400 mt-1 font-sans">{formatShorthand(owner.revenue)}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleImpersonateUser({
                      id: owner.id,
                      name: owner.name,
                      email: owner.email || `${owner.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`,
                      role: 'owner'
                    })}
                    className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 animate-pulse flex-1"
                  >
                    Login As
                  </button>
                  <button
                    onClick={() => handleOwnerStatus(owner.id)}
                    className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex-1 ${owner.status === 'active'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                      }`}
                  >
                    {owner.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Index:</span>
                  <span className="text-xs font-black text-blue-400">{owner.score}/10</span>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </div>
  );

  // Pilot Account Management
  const PilotsView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 font-sans">Unit Pilots Directory</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilots.map(pilot => (
            <BorderGlow
              key={pilot.id}
              borderRadius={28}
              glowColor={pilot.status === 'suspended' ? '239 68 68' : '59 130 246'}
              glowRadius={30}
              glowIntensity={0.6}
              backgroundColor="#120F17"
              className="p-6 border-white/5 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{pilot.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{pilot.id.includes('_') ? pilot.id.split('_')[1] : pilot.id}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">{pilot.availability}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${pilot.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {pilot.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-2 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black block">Trips</span>
                  <div className="text-xs font-black text-white mt-1">{pilot.trips}</div>
                </div>
                <div className="p-2 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black block">Hours</span>
                  <div className="text-xs font-black text-white mt-1">{pilot.hours}h</div>
                </div>
                <div className="p-2 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <span className="text-[7px] text-gray-500 uppercase tracking-widest font-black block">Rating</span>
                  <div className="text-xs font-black text-yellow-400 mt-1">★ {pilot.rating}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      let email = 'driver1@demo.com';
                      if (pilot.name === 'Ramesh Sharma') email = 'driver2@demo.com';
                      else if (pilot.name !== 'Suresh Singh') {
                        email = `${pilot.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`;
                      }
                      handleImpersonateUser({
                        id: pilot.id,
                        name: pilot.name,
                        email: email,
                        role: 'driver'
                      });
                    }}
                    className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 animate-pulse flex-1"
                  >
                    Login As
                  </button>
                  <button
                    onClick={() => handlePilotStatus(pilot.id)}
                    className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex-1 ${pilot.status === 'active'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                      }`}
                  >
                    {pilot.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Safety Vector:</span>
                  <span className={`text-xs font-black ${pilot.safetyScore >= 8.5 ? 'text-green-400' : pilot.safetyScore >= 7.0 ? 'text-yellow-500' : 'text-red-500'}`}>{pilot.safetyScore}/10</span>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </div>
  );

  // Admin Account Management — full CRUD
  const AdminsView = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const flashMsg = (msg: string) => { setAdminMsg(msg); setTimeout(() => setAdminMsg(''), 3500); };
    const flashErr = (err: string) => { setAdminErr(err); setTimeout(() => setAdminErr(''), 4000); };

    // ── CREATE ────────────────────────────────────────────────────────────
    const handleCreateAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminLoading(true);
      setAdminErr('');
      if (admins.find((a: any) => a.id.toLowerCase() === adminCreateForm.id.toLowerCase())) {
        flashErr('An admin with this ID already exists.'); setAdminLoading(false); return;
      }
      if (admins.find((a: any) => a.email?.toLowerCase() === adminCreateForm.email.toLowerCase())) {
        flashErr('An admin with this email already exists.'); setAdminLoading(false); return;
      }
      if (adminCreateForm.email && !emailRegex.test(adminCreateForm.email)) {
        flashErr('Please enter a valid email address.'); setAdminLoading(false); return;
      }
      if (adminCreateForm.contact && adminCreateForm.contact.length !== 10) {
        flashErr('Phone number must be exactly 10 digits.'); setAdminLoading(false); return;
      }
      await createAdmin({ ...adminCreateForm, status: 'active' });
      setAdminCreateForm({ id: '', name: '', email: '', password: '', contact: '', role: 'admin' });
      setShowCreateAdminModal(false);
      updateMockDB();
      flashMsg('Admin account created successfully!');
      setAdminLoading(false);
    };

    // ── UPDATE ────────────────────────────────────────────────────────────
    const handleSaveEdit = async () => {
      if (adminEditForm.email && !emailRegex.test(adminEditForm.email)) { flashErr('Invalid email address.'); return; }
      if (adminEditForm.contact && adminEditForm.contact.length !== 10) { flashErr('Phone must be exactly 10 digits.'); return; }
      setAdminLoading(true);
      await updateAdmin(editingAdminId!, adminEditForm);
      setEditingAdminId(null);
      updateMockDB();
      flashMsg('Admin account updated successfully!');
      setAdminLoading(false);
    };

    // ── DELETE ────────────────────────────────────────────────────────────
    const handleDeleteAdmin = async (id: string) => {
      setAdminLoading(true);
      await deleteAdmin(id);
      setAdminDeleteConfirmId(null);
      updateMockDB();
      flashMsg('Admin account removed.');
      setAdminLoading(false);
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">

        {/* Flash messages */}
        {adminMsg && (
          <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-2xl font-bold text-xs uppercase tracking-widest animate-in fade-in">
            ✓ {adminMsg}
          </div>
        )}
        {adminErr && (
          <div className="p-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-2xl font-bold text-xs uppercase tracking-widest animate-in fade-in">
            ✕ {adminErr}
          </div>
        )}

        {/* Header row */}
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">Admin Accounts Directory</h3>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">{admins.filter((a: any) => a.role !== 'super_admin').length} registered admins</p>
            </div>
            <button
              onClick={() => { setShowCreateAdminModal(true); setAdminErr(''); }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-900/30"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              New Admin
            </button>
          </div>

          {admins.filter((a: any) => a.role !== 'super_admin').length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldAlert className="w-12 h-12 text-purple-500/20 mb-4" />
              <p className="text-sm font-black text-gray-500 uppercase tracking-widest">No Admin Accounts Found</p>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">Click "New Admin" to create the first one</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.filter((a: any) => a.role !== 'super_admin').map((admin: any) => (
                <BorderGlow
                  key={admin.id}
                  borderRadius={28}
                  glowColor={admin.status === 'suspended' ? '239 68 68' : '139 92 246'}
                  glowRadius={30}
                  glowIntensity={0.6}
                  backgroundColor="#120F17"
                  className="p-6 border-white/5 shadow-xl"
                >
                  {/* ── EDIT MODE ── */}
                  {editingAdminId === admin.id ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest">Editing {admin.id}</span>
                        <button onClick={() => setEditingAdminId(null)} className="text-gray-500 hover:text-white transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input value={adminEditForm.name || ''} onChange={e => setAdminEditForm({ ...adminEditForm, name: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input type="email" value={adminEditForm.email || ''} onChange={e => setAdminEditForm({ ...adminEditForm, email: e.target.value.toLowerCase() })} className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Phone</label>
                          <input value={adminEditForm.contact || ''} onChange={e => setAdminEditForm({ ...adminEditForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })} maxLength={10} className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none" placeholder="10 digits" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Role</label>
                          <select value={adminEditForm.role || 'admin'} onChange={e => setAdminEditForm({ ...adminEditForm, role: e.target.value })} className="w-full bg-[#120F17] border border-white/10 rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none [&>option]:bg-[#120F17]">
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="moderator">Moderator</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Password</label>
                        <input type="text" value={adminEditForm.password || ''} onChange={e => setAdminEditForm({ ...adminEditForm, password: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none" placeholder="Update password" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select value={adminEditForm.status} onChange={e => setAdminEditForm({ ...adminEditForm, status: e.target.value })} className="w-full bg-[#120F17] border border-white/10 rounded-lg p-2 text-white text-xs [&>option]:bg-[#120F17] outline-none">
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button onClick={handleSaveEdit} disabled={adminLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-1">
                          <Save className="w-3 h-3 mr-1" /> Save
                        </button>
                        <button onClick={() => setEditingAdminId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl py-2 text-[9px] font-black uppercase tracking-widest transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : adminDeleteConfirmId === admin.id ? (
                    /* ── DELETE CONFIRM ── */
                    <div className="flex flex-col items-center justify-center py-4 text-center space-y-4 animate-in fade-in duration-200">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">Delete {admin.name}?</p>
                        <p className="text-[9px] text-gray-500 mt-1">This action cannot be undone.</p>
                      </div>
                      <div className="flex w-full space-x-2">
                        <button onClick={() => handleDeleteAdmin(admin.id)} disabled={adminLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 text-[9px] font-black uppercase tracking-widest transition-all">
                          Confirm Delete
                        </button>
                        <button onClick={() => setAdminDeleteConfirmId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl py-2 text-[9px] font-black uppercase tracking-widest transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <>
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">{admin.name}</h4>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">{admin.email}</p>
                          {admin.contact && <p className="text-[9px] text-gray-600 font-bold mt-0.5">📞 {admin.contact}</p>}
                          {admin.role && (
                            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {admin.role}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            admin.status === 'active'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {admin.status}
                          </span>
                          {/* Edit & Delete icon buttons */}
                          <div className="flex space-x-1 mt-1">
                            <button
                              onClick={() => { setEditingAdminId(admin.id); setAdminEditForm({ ...admin }); setAdminErr(''); }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-gray-400 hover:text-purple-400 transition-all"
                              title="Edit Admin"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setAdminDeleteConfirmId(admin.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleImpersonateUser({
                              id: admin.id,
                              name: admin.name,
                              email: admin.email || `${String(admin.name).toLowerCase().replace(/[^a-z0-9]/g, '')}@admin.com`,
                              role: 'admin'
                            })}
                            className="px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1"
                          >
                            Login As
                          </button>
                          <button
                            onClick={async () => {
                              const newStatus = admin.status === 'active' ? 'suspended' : 'active';
                              await updateAdmin(admin.id, { ...admin, status: newStatus });
                              updateMockDB();
                            }}
                            className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex-1 ${
                              admin.status === 'active'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                            }`}
                          >
                            {admin.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">ID:</span>
                          <span className="text-[9px] font-black text-purple-400 font-mono">{admin.id}</span>
                        </div>
                      </div>
                    </>
                  )}
                </BorderGlow>
              ))}
            </div>
          )}
        </div>

        {/* ── CREATE ADMIN MODAL ───────────────────────────────────────── */}
        {showCreateAdminModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#120F17]/90 border border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.2)] rounded-3xl overflow-hidden">
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500" />

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-widest">New Admin Account</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Grant admin-level access to a new user</p>
                  </div>
                  <button onClick={() => { setShowCreateAdminModal(false); setAdminErr(''); }} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {adminErr && (
                  <div className="mb-4 p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl text-xs font-bold">✕ {adminErr}</div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="adminId" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Admin ID *</label>
                      <input
                        id="adminId"
                        name="adminId"
                        required
                        value={adminCreateForm.id}
                        onChange={e => setAdminCreateForm({ ...adminCreateForm, id: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none transition-colors"
                        placeholder="e.g. A04"
                      />
                    </div>
                    <div>
                      <label htmlFor="adminRole" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Role</label>
                      <select
                        id="adminRole"
                        name="adminRole"
                        value={adminCreateForm.role}
                        onChange={e => setAdminCreateForm({ ...adminCreateForm, role: e.target.value })}
                        className="w-full bg-[#120F17] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none [&>option]:bg-[#120F17]"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="adminName" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                    <input
                      id="adminName"
                      name="adminName"
                      required
                      value={adminCreateForm.name}
                      onChange={e => setAdminCreateForm({ ...adminCreateForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none transition-colors"
                      placeholder="e.g. Ravi Kumar"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="adminEmail" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email *</label>
                      <input
                        id="adminEmail"
                        name="adminEmail"
                        required
                        type="email"
                        value={adminCreateForm.email}
                        onChange={e => setAdminCreateForm({ ...adminCreateForm, email: e.target.value.toLowerCase() })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none transition-colors"
                        placeholder="admin@company.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="adminPhone" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input
                        id="adminPhone"
                        name="adminPhone"
                        value={adminCreateForm.contact}
                        onChange={e => setAdminCreateForm({ ...adminCreateForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        maxLength={10}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none transition-colors"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Password *</label>
                    <input
                      id="adminPassword"
                      name="adminPassword"
                      required
                      type="text"
                      value={adminCreateForm.password}
                      onChange={e => setAdminCreateForm({ ...adminCreateForm, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none transition-colors"
                      placeholder="Set a strong password"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-2xl transition-all shadow-lg shadow-purple-900/30 text-xs"
                    >
                      {adminLoading ? 'Creating...' : 'Create Admin Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCreateAdminModal(false); setAdminErr(''); }}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-black uppercase tracking-widest rounded-2xl transition-all text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  // Device Management View
  const DevicesView = () => {

    const filteredDevices = devices.filter(dev =>
      dev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">Telemetry Node Network</h3>
            <div className="flex items-center bg-[#120F17] border border-white/5 rounded-2xl px-4 py-2 w-full md:w-80">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Device / Owner..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold text-white placeholder-gray-500 w-full ml-2 uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] text-gray-500 uppercase tracking-widest font-black pb-4">
                  <th className="py-4">Node ID</th>
                  <th className="py-4">Assigned Host</th>
                  <th className="py-4">Battery</th>
                  <th className="py-4">Signal</th>
                  <th className="py-4">GPS Sync</th>
                  <th className="py-4">Firmware</th>
                  <th className="py-4">Integrity Index</th>
                  <th className="py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredDevices.map(dev => (
                  <tr key={dev.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 font-black text-white uppercase tracking-wider font-sans">{dev.id}</td>
                    <td className="py-4 text-gray-400 font-bold uppercase">{dev.owner}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Battery className={`w-4 h-4 ${dev.battery > 50 ? 'text-green-500' : dev.battery > 20 ? 'text-yellow-500' : 'text-red-500'}`} />
                        <span className="font-bold">{dev.battery}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4 text-blue-500" />
                        <span className="font-bold uppercase tracking-widest text-[9px]">{dev.network}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${dev.gps === 'Connected' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {dev.gps}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-gray-500 text-[10px]">{dev.firmware}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${dev.health > 80 ? 'bg-green-500' : dev.health > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${dev.health}%` }} />
                        </div>
                        <span className="font-black text-blue-400 font-sans">{dev.health}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { playClick(); setSelectedDevice(dev); }}
                          className="px-3 py-1 bg-[#120F17] border border-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          Ping Logs
                        </button>
                        {dev.firmware.includes('outdated') && (
                          <button
                            onClick={() => handleDeviceFirmware(dev.id)}
                            className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center"
                          >
                            <DownloadCloud className="w-2.5 h-2.5 mr-1" /> Patch OTA
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Sync Log / Ping Detail Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#120F17]/90 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)] rounded-3xl overflow-hidden p-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest font-display">SYNC HISTORY: <span className="font-sans font-bold">{selectedDevice.id}</span></h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Host Entity: {selectedDevice.owner}</p>
                </div>
                <button
                  onClick={() => { playClick(); setSelectedDevice(null); }}
                  className="p-1 rounded-lg bg-[#120F17] border border-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-[10px] bg-black/40 border border-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto custom-scrollbar text-blue-400">
                <div>[08:45:01] UPLINK ESTABLISHED... OK</div>
                <div>[08:45:02] INTEGRITY METRIC CHECK: {selectedDevice.health}%</div>
                <div>[08:45:03] GPS SEQUENCE SYNC... LAT: 18.9750, LNG: 72.8258</div>
                <div>[08:45:04] BATTERY VECTOR VERIFIED: {selectedDevice.battery}%</div>
                <div>[08:45:05] ACTIVE ROUTING STREAM ONLINE</div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => { playClick(); setSelectedDevice(null); }}
                  className="px-5 py-2.5 bg-[#120F17] border border-white/5 hover:bg-white/10 transition-colors text-[9px] font-black uppercase tracking-widest rounded-2xl"
                >
                  Close Terminal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };





  // Emergency SOS Console
  const AlertsView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">CRITICAL SOS MANAGEMENT</h3>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Real-time Emergency Events & Intercept Status</p>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${soundEnabled
              ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
              : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
              }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 mr-1.5" /> : <VolumeX className="w-4 h-4 mr-1.5" />}
            <span>{soundEnabled ? 'Synthesizer Active' : 'Muted'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map(alt => (
            <div
              key={alt.id}
              className="p-6 bg-red-950/15 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)] rounded-3xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_#EF4444]" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] text-red-500 font-black uppercase tracking-[0.2em]">{alt.severity}</span>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest font-sans">{alt.time}</span>
                </div>

                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2">{alt.type}</h4>
                <p className="text-xs font-bold text-red-400/80 mb-3">{alt.vehicle}</p>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{alt.description}</p>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDismissAlert(alt.id)}
                  className="px-5 py-2.5 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Acknowledge Intercept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-[#120F17] text-gray-200 flex font-sans overflow-hidden selection:bg-blue-500/30 relative">

      {/* Laser HUD Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {/* Soft Background Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Cybernetic Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-500 p-4 flex flex-col z-20 relative`}>
        <div className="h-full flex flex-col bg-[#120F17]/80 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden rounded-2xl relative">

          <div className={`mb-8 flex ${sidebarOpen ? 'p-6' : 'p-4 justify-center'} items-center`}>
            {sidebarOpen ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Core Active</span>
                </div>
                <h1 className="text-xl font-black tracking-tighter leading-none text-white uppercase font-sans">SUKRUTHA</h1>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mt-1">Mobility Control Core</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
              </div>
            )}
          </div>

          <nav className={`flex-1 ${sidebarOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto custom-scrollbar`}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname === '/super-admin-dashboard' && item.href === '/super-admin-dashboard');

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={playClick}
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 leading-none mb-1.5 font-sans">Operations Control Center</h2>
              <span className="text-xl font-black text-white tracking-tighter uppercase font-sans">Admin Core Interface</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">SUPER ADMIN</span>
                <span className="text-xs font-black text-white uppercase tracking-tight">{user?.name}</span>
              </div>
              <ThemeToggle />
              <button
                onClick={() => { playClick(); logout(); }}
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
                {location.pathname === '/super-admin-dashboard' ? 'Command Center Dashboard' :
                  location.pathname.includes('stats') ? 'System Telemetry Stats' :
                    location.pathname.includes('owners') ? 'Fleet Owner Accounts' :
                      location.pathname.includes('pilots') ? 'Pilot Network Node Access' :
                        location.pathname.includes('devices') ? 'Device Monitoring Panel' :
                          location.pathname.includes('tracking') ? 'Real-time Live Monitoring radar' :
                            location.pathname.includes('analytics') ? 'Real-time Analytics grid' :
                              location.pathname.includes('alerts') ? 'Emergency Alert Console' : 'Core Command Terminal'}
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
              <Route path="/stats" element={<StatsView />} />
              <Route path="/owners" element={<OwnersView />} />
              <Route path="/pilots" element={<PilotsView />} />
              <Route path="/admins" element={AdminsView()} />
              <Route path="/devices" element={<DevicesView />} />
              <Route path="/tracking" element={<TrackingView telemetry={telemetry} owners={owners} pilots={pilots} devices={devices} />} />
              <Route path="/alerts" element={<AlertsView />} />
              <Route path="/create" element={<CreateView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="/update" element={<UpdateView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="/remove" element={<RemoveView onRefresh={updateMockDB} owners={owners} pilots={pilots} />} />
              <Route path="*" element={<Navigate to="/super-admin-dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
      <ImpersonateModal
        isOpen={!!impersonateTarget}
        onClose={() => setImpersonateTarget(null)}
        targetUser={impersonateTarget}
        onConfirm={confirmImpersonation}
      />
    </div>
  );
}

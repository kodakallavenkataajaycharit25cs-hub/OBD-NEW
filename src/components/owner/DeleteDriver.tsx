import React, { useState, useEffect } from 'react';
import { fetchPilots, deletePilot } from '../../services/obdApi';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, Car, AlertTriangle, ArrowLeft } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function DeleteDriver() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const allPilots = await fetchPilots();
      const ownerId = user?.id || 'owner-default';
      const myDrivers = allPilots.filter((p: any) => p.owner_id === ownerId);
      setDrivers(myDrivers);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDrivers();
  }, [user]);

  const handleDeleteDriver = async (id: string) => {
    await deletePilot(id);
    setConfirmId(null);
    loadDrivers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl min-h-[500px]"
      >
        <div className="flex items-center mb-6">
          <Link to="/owner/drivers" className="mr-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
            <Trash2 className="w-6 h-6 mr-3 text-red-500" />
            Remove Driver
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : drivers.length === 0 ? (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-gray-400 font-bold">No drivers found in your fleet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver: any) => (
              <div 
                key={driver.id} 
                className={`p-5 border rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                  confirmId === driver.id 
                    ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:border-red-500/30 hover:bg-white/10'
                }`}
              >
                {/* Background Danger Pattern for Confirmation State */}
                {confirmId === driver.id && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)]" />
                )}

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      confirmId === driver.id 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-gray-500/10 border border-gray-500/20 text-gray-400 group-hover:text-red-400'
                    }`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">{driver.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: {driver.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 relative z-10">
                  <p className="text-xs text-gray-400">Phone: {driver.contact || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Email: {driver.email || 'N/A'}</p>
                </div>

                <div className="mt-auto relative z-10">
                  {confirmId === driver.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Confirm deletion? This cannot be undone.</span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDeleteDriver(driver.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button 
                          onClick={() => setConfirmId(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-2 text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmId(driver.id)}
                      className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl py-2.5 text-xs font-black uppercase tracking-widest transition-all opacity-80 group-hover:opacity-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Driver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </BorderGlow>
    </div>
  );
}

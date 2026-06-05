import React, { useState, useEffect } from 'react';
import { fetchPilots, updatePilot } from '../../services/obdApi';
import { useAuth } from '../../contexts/AuthContext';
import { Edit, Car, Save } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function UpdateDriver() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

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

  const handleEdit = (driver: any) => {
    setEditingId(driver.id);
    setEditForm({ ...driver });
  };

  const handleSaveDriver = async () => {
    if (!editingId) return;
    await updatePilot(editingId, editForm);
    setEditingId(null);
    loadDrivers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl min-h-[500px]"
      >
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <Edit className="w-6 h-6 mr-3 text-yellow-500" />
          Update Driver Details
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : drivers.length === 0 ? (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-gray-400 font-bold">No drivers found in your fleet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver: any) => (
              <div key={driver.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 group">
                {editingId === driver.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Name</label>
                      <input 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                        className="w-full bg-white/10 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-yellow-500 outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact</label>
                        <input 
                          value={editForm.contact || ''} 
                          onChange={e => setEditForm({...editForm, contact: e.target.value})} 
                          className="w-full bg-white/10 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-yellow-500 outline-none" 
                          placeholder="+91..." 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input 
                          type="email" 
                          value={editForm.email || ''} 
                          onChange={e => setEditForm({...editForm, email: e.target.value})} 
                          className="w-full bg-white/10 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-yellow-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
                      <select 
                        value={editForm.status} 
                        onChange={e => setEditForm({...editForm, status: e.target.value})} 
                        className="w-full bg-[#120F17] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-yellow-500 outline-none [&>option]:bg-[#120F17] [&>option]:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button 
                        onClick={handleSaveDriver} 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-widest flex items-center justify-center transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" /> Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between h-full flex-col">
                    <div className="w-full flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">{driver.name}</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: {driver.id}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleEdit(driver)} 
                        className="p-2 bg-white/5 hover:bg-yellow-500/20 border border-transparent hover:border-yellow-500/30 rounded-xl text-gray-400 hover:text-yellow-400 transition-all group-hover:bg-white/10"
                        title="Edit Driver"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5 w-full bg-black/20 rounded-xl p-3 border border-white/5">
                      {driver.contact && <p className="text-xs text-gray-400 flex items-center"><span className="w-4 mr-2 opacity-50">📞</span> {driver.contact}</p>}
                      {driver.email && <p className="text-xs text-gray-400 flex items-center"><span className="w-4 mr-2 opacity-50">✉</span> {driver.email}</p>}
                      <p className={`text-xs flex items-center mt-2 ${driver.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="w-4 mr-2 opacity-80">●</span> <span className="uppercase font-bold text-[10px] tracking-widest">{driver.status}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </BorderGlow>
    </div>
  );
}

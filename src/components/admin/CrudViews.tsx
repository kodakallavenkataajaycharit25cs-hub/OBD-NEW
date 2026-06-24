import React, { useState } from 'react';
import { createOwner, createPilot, updateOwner, updatePilot, deleteOwner, deletePilot } from '../../services/obdApi';
import { UserPlus, Building2, Car, Trash2, Edit, Save, X, ArrowLeft, PlusCircle } from 'lucide-react';

export const CreateView = ({ onRefresh, owners, pilots }: { onRefresh: () => void, owners: any[], pilots: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);

  // Form states
  const [ownerForm, setOwnerForm] = useState({ id: '', name: '', contact: '', email: '', password: '', fleetSize: 0, activeVehicles: 0, headquarters: '' });
  const [pilotForm, setPilotForm] = useState({ id: '', name: '', email: '', contact: '', password: '', owner_id: '', vehicleNumber: '', vehicleModel: '' });

  React.useEffect(() => {
    if (owners && owners.length > 0) {
      let maxNum = 0;
      owners.forEach((o: any) => {
        const match = String(o.id).match(/^(?:O|0)?(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      });
      const nextId = `O${String(maxNum + 1).padStart(2, '0')}`;
      setOwnerForm(prev => ({ ...prev, id: nextId }));
    } else {
      setOwnerForm(prev => ({ ...prev, id: 'O01' }));
    }
  }, [owners]);

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const duplicateId = owners.find(o => o.id.toLowerCase() === ownerForm.id.toLowerCase());
    const duplicateEmail = ownerForm.email && owners.find(o => o.email?.toLowerCase() === ownerForm.email.toLowerCase());
    const duplicatePhone = ownerForm.contact && owners.find(o => o.contact === ownerForm.contact);

    if (ownerForm.contact && ownerForm.contact.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (ownerForm.email && !emailRegex.test(ownerForm.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (duplicateId) {
      setError('A client with this ID already exists.');
      setLoading(false);
      return;
    }
    if (duplicateEmail) {
      setError('A client with this Email already exists.');
      setLoading(false);
      return;
    }
    if (duplicatePhone) {
      setError('A client with this Phone Number already exists.');
      setLoading(false);
      return;
    }

    await createOwner({ ...ownerForm, revenue: 0, score: 10, status: 'active' });
    setMessage('Client created successfully!');
    setOwnerForm({ id: '', name: '', contact: '', email: '', password: '', fleetSize: 0, activeVehicles: 0, headquarters: '' });
    onRefresh();
    setLoading(false);
  };

  const handleCreatePilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const duplicateId = pilots.find(p => 
      String(p.owner_id).trim().replace(/^0+/, '') === String(selectedFleetId).trim().replace(/^0+/, '') &&
      (p.id.toLowerCase() === pilotForm.id.toLowerCase() || 
       (p.id.includes('_') && p.id.split('_')[1].toLowerCase() === pilotForm.id.toLowerCase()))
    );
    const duplicateEmail = pilotForm.email && pilots.find(p => p.email?.toLowerCase() === pilotForm.email.toLowerCase());
    const duplicatePhone = pilotForm.contact && pilots.find(p => p.contact === pilotForm.contact);

    if (pilotForm.contact && pilotForm.contact.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (pilotForm.email && !emailRegex.test(pilotForm.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (duplicateId) {
      setError('A driver with this ID already exists.');
      setLoading(false);
      return;
    }
    if (duplicateEmail) {
      setError('A driver with this Email already exists.');
      setLoading(false);
      return;
    }
    if (duplicatePhone) {
      setError('A driver with this Phone Number already exists.');
      setLoading(false);
      return;
    }

    const selectedOwner = owners.find(o => o.id === selectedFleetId);
    const dbId = `${selectedFleetId}_${pilotForm.id}`;
    await createPilot({ ...pilotForm, id: dbId, owner_id: selectedFleetId, trips: 0, hours: 0, safetyScore: 10, status: 'active', availability: 'off-duty', rating: 5 });
    setMessage(`Driver added to ${selectedOwner?.name || 'fleet'} successfully!`);
    setPilotForm({ id: '', name: '', email: '', contact: '', password: '', owner_id: '', vehicleNumber: '', vehicleModel: '' });
    onRefresh();
    setLoading(false);
  };

  const selectedFleet = owners.find(o => o.id === selectedFleetId);
  const fleetDrivers = selectedFleetId ? (pilots || []).filter((p: any) => 
    p.owner_id && selectedFleetId && 
    String(p.owner_id).trim().replace(/^0+/, '') === String(selectedFleetId).trim().replace(/^0+/, '')
  ) : [];

  // If a fleet is selected, show the "Add Driver" form for that fleet
  if (selectedFleet) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <button onClick={() => { setSelectedFleetId(null); setMessage(''); setError(''); }} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
        </button>

        {message && <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl font-bold">{message}</div>}
        {error && <div className="p-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold">{error}</div>}

        <div className="flex items-center space-x-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">
            {selectedFleet.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider">{selectedFleet.name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Add a new driver to this fleet</p>
          </div>
        </div>

        {/* Existing drivers in this fleet */}
        {fleetDrivers.length > 0 && (
          <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
            <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Current Drivers ({fleetDrivers.length})</h5>
            <div className="flex flex-wrap gap-2">
              {fleetDrivers.map((d: any) => (
                <span key={d.id} className="px-3 py-1.5 bg-[#120F17] border border-white/5 rounded-lg text-xs font-bold text-gray-300">
                  <Car className="w-3 h-3 inline-block mr-1.5 text-purple-400" />{d.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl max-w-2xl">
          <form onSubmit={handleCreatePilot} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Driver ID</label>
              <input required value={pilotForm.id} onChange={e => setPilotForm({...pilotForm, id: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. P10" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
              <input required value={pilotForm.name} onChange={e => setPilotForm({...pilotForm, name: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contact (Phone)</label>
                <input type="text" value={pilotForm.contact} onChange={e => setPilotForm({...pilotForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10)})} maxLength={10} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input type="email" value={pilotForm.email} onChange={e => setPilotForm({...pilotForm, email: e.target.value.toLowerCase()})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="driver@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input type="text" value={pilotForm.password} onChange={e => setPilotForm({...pilotForm, password: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Create password" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Vehicle Number</label>
                <input type="text" value={pilotForm.vehicleNumber} onChange={e => setPilotForm({...pilotForm, vehicleNumber: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. MH-01-AB-1234" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Vehicle Model</label>
                <input type="text" value={pilotForm.vehicleModel} onChange={e => setPilotForm({...pilotForm, vehicleModel: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. Tata Ace" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all">
              {loading ? 'Processing...' : `Add Driver to ${selectedFleet.name}`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default: show New Client form + Fleet list to add drivers
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {message && <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl font-bold">{message}</div>}
      {error && <div className="p-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold">{error}</div>}

      {/* New Client Form */}
      <div>
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-500" /> New Client
        </h3>
        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl max-w-2xl">
          <form onSubmit={handleCreateOwner} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Client ID</label>
              <input required value={ownerForm.id} onChange={e => setOwnerForm({...ownerForm, id: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. O6" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Company Name</label>
              <input required value={ownerForm.name} onChange={e => setOwnerForm({...ownerForm, name: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. Delta Logistics" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Headquarters Location</label>
              <input required value={ownerForm.headquarters} onChange={e => setOwnerForm({...ownerForm, headquarters: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. Mumbai, India" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contact (Phone)</label>
                <input type="text" value={ownerForm.contact} onChange={e => setOwnerForm({...ownerForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10)})} maxLength={10} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input type="email" value={ownerForm.email} onChange={e => setOwnerForm({...ownerForm, email: e.target.value.toLowerCase()})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input type="text" value={ownerForm.password} onChange={e => setOwnerForm({...ownerForm, password: e.target.value})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Create password" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fleet Size</label>
                <input type="number" required value={ownerForm.fleetSize} onChange={e => setOwnerForm({...ownerForm, fleetSize: parseInt(e.target.value)})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Active Vehicles</label>
                <input type="number" required value={ownerForm.activeVehicles} onChange={e => setOwnerForm({...ownerForm, activeVehicles: parseInt(e.target.value)})} className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all">
              {loading ? 'Processing...' : 'Create Client'}
            </button>
          </form>
        </div>
      </div>

      {/* Fleet list - click to add driver */}
      <div>
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center">
          <UserPlus className="w-5 h-5 mr-2 text-purple-500" /> Add Driver to Fleet
        </h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Click on a fleet to add a new driver</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map(owner => {
            const driverCount = (pilots || []).filter((p: any) => 
              p.owner_id && owner.id && 
              String(p.owner_id).trim().replace(/^0+/, '') === String(owner.id).trim().replace(/^0+/, '')
            ).length;
            return (
              <div
                key={owner.id}
                onClick={() => setSelectedFleetId(owner.id)}
                className="p-5 bg-[#120F17]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-lg group-hover:bg-purple-500/20 transition-colors">
                    {owner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-purple-400 transition-colors">{owner.name}</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">ID: {owner.id} | Drivers: {driverCount}</p>
                  </div>
                  <PlusCircle className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const UpdateView = ({ onRefresh, owners, pilots }: { onRefresh: () => void, owners: any[], pilots: any[] }) => {
  const [tab, setTab] = useState<'client' | 'driver'>('client');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ ...item });
    setError('');
  };

  const handleSaveClient = async () => {
    setError('');
    if (editForm.contact && editForm.contact.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (editForm.email && !emailRegex.test(editForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      const confirmChange = window.confirm("Are you sure you want to change the password for this user?");
      if (!confirmChange) {
        return;
      }
    }

    const res = await updateOwner(editingId!, editForm);
    if (res && (res.error || res.success === false)) {
      setError(res.error || 'Failed to update client.');
      return;
    }
    setEditingId(null);
    onRefresh();
  };

  const handleSaveDriver = async () => {
    setError('');
    if (editForm.contact && editForm.contact.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (editForm.email && !emailRegex.test(editForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      const confirmChange = window.confirm("Are you sure you want to change the password for this user?");
      if (!confirmChange) {
        return;
      }
    }

    const res = await updatePilot(editingId!, editForm);
    if (res && (res.error || res.success === false)) {
      setError(res.error || 'Failed to update driver.');
      return;
    }
    setEditingId(null);
    onRefresh();
  };

  const selectedFleet = owners.find((o: any) => o.id === selectedFleetId);
  const fleetDrivers = selectedFleetId ? pilots.filter((p: any) => 
    p.owner_id && selectedFleetId && 
    String(p.owner_id).trim().replace(/^0+/, '') === String(selectedFleetId).trim().replace(/^0+/, '')
  ) : [];

  // Driver view: show drivers for the selected fleet
  if (tab === 'driver' && selectedFleet) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex space-x-4 mb-6">
          <button onClick={() => { setTab('client'); setSelectedFleetId(null); setEditingId(null); }} className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-white/5 text-gray-400 hover:text-white`}>
            <Building2 className="w-4 h-4 inline-block mr-2" /> Update Clients
          </button>
          <button className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-purple-600 text-white`}>
            <Car className="w-4 h-4 inline-block mr-2" /> Update Drivers
          </button>
        </div>

        <button onClick={() => { setSelectedFleetId(null); setEditingId(null); }} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Fleet List</span>
        </button>

        <div className="flex items-center space-x-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">
            {selectedFleet.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider">{selectedFleet.name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Drivers: {fleetDrivers.length}</p>
          </div>
        </div>

        {error && <div className="p-4 mb-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold">{error}</div>}

        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
          {fleetDrivers.length === 0 ? (
            <p className="text-xs text-gray-600 font-bold">No drivers assigned to this fleet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fleetDrivers.map((driver: any) => (
                <div key={driver.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  {editingId === driver.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Name</label>
                        <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Contact (Phone)</label>
                          <input value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10)})} maxLength={10} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="1234567890" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email</label>
                          <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value.toLowerCase()})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Password</label>
                          <input type="text" value={editForm.password || ''} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="Update password" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Vehicle Number</label>
                          <input type="text" value={editForm.vehicle_number || ''} onChange={e => setEditForm({...editForm, vehicleNumber: e.target.value, vehicle_number: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="Vehicle No" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Vehicle Model</label>
                          <input type="text" value={editForm.vehicle_model || ''} onChange={e => setEditForm({...editForm, vehicleModel: e.target.value, vehicle_model: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="Vehicle Model" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Status</label>
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full bg-[#120F17] border border-white/10 rounded-lg p-2 text-white text-sm [&>option]:bg-[#120F17] [&>option]:text-white">
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={handleSaveDriver} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 text-xs font-bold uppercase">Save</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-2 text-xs font-bold uppercase">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{driver.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">ID: {driver.id.includes('_') ? driver.id.split('_')[1] : driver.id}</p>
                        <div className="mt-2 space-y-0.5">
                          {driver.contact && <p className="text-xs text-gray-400">📞 {driver.contact}</p>}
                          {driver.email && <p className="text-xs text-gray-400">✉ {driver.email}</p>}
                          {driver.vehicle_number && <p className="text-xs text-gray-400">🚗 {driver.vehicle_number} {driver.vehicle_model ? `(${driver.vehicle_model})` : ''}</p>}
                          <p className={`text-xs mt-1 ${driver.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>● {driver.status}</p>
                        </div>
                      </div>
                      <button onClick={() => handleEdit(driver)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Driver tab: show fleet list to pick from
  if (tab === 'driver') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setTab('client')} className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-white/5 text-gray-400 hover:text-white`}>
            <Building2 className="w-4 h-4 inline-block mr-2" /> Update Clients
          </button>
          <button className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-purple-600 text-white`}>
            <Car className="w-4 h-4 inline-block mr-2" /> Update Drivers
          </button>
        </div>

        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Click on a fleet to view and update its drivers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map((owner: any) => {
            const driverCount = pilots.filter((p: any) => 
              p.owner_id && owner.id && 
              String(p.owner_id).trim().replace(/^0+/, '') === String(owner.id).trim().replace(/^0+/, '')
            ).length;
            return (
              <div
                key={owner.id}
                onClick={() => setSelectedFleetId(owner.id)}
                className="p-5 bg-[#120F17]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-lg group-hover:bg-purple-500/20 transition-colors">
                    {owner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-purple-400 transition-colors">{owner.name}</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">ID: {owner.id} | Drivers: {driverCount}</p>
                  </div>
                  <Edit className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Client tab: show client cards with inline editing (with contact & email)
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex space-x-4 mb-6">
        <button className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-blue-600 text-white`}>
          <Building2 className="w-4 h-4 inline-block mr-2" /> Update Clients
        </button>
        <button onClick={() => setTab('driver')} className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest bg-white/5 text-gray-400 hover:text-white`}>
          <Car className="w-4 h-4 inline-block mr-2" /> Update Drivers
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold">{error}</div>}

      <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map((item: any) => (
            <div key={item.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Contact</label>
                      <input value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10)})} maxLength={10} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="1234567890" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value.toLowerCase()})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Password</label>
                      <input type="text" value={editForm.password || ''} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="Update password" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Headquarters Location</label>
                    <input type="text" value={editForm.headquarters || ''} onChange={e => setEditForm({...editForm, headquarters: e.target.value})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" placeholder="e.g. Mumbai, India" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Fleet Size</label>
                    <input type="number" value={editForm.fleetSize || editForm.fleet_size} onChange={e => setEditForm({...editForm, fleetSize: parseInt(e.target.value)})} className="w-full bg-white/10 rounded-lg p-2 text-white text-sm" />
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={handleSaveClient} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 text-xs font-bold uppercase">Save</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-2 text-xs font-bold uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">ID: {item.id}</p>
                    <div className="mt-2 space-y-0.5">
                      {item.headquarters && <p className="text-xs text-gray-400">📍 {item.headquarters}</p>}
                      {item.contact && <p className="text-xs text-gray-400">📞 {item.contact}</p>}
                      {item.email && <p className="text-xs text-gray-400">✉ {item.email}</p>}
                      <p className="text-xs text-blue-400">Fleet: {item.fleetSize || item.fleet_size}</p>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RemoveView = ({ onRefresh, owners, pilots }: { onRefresh: () => void, owners: any[], pilots: any[] }) => {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const handleDeleteClient = async (id: string, name: string) => {
    if (confirm(`WARNING: Are you sure you want to permanently delete the client "${name}" AND all their assigned drivers?`)) {
      await deleteOwner(id);
      onRefresh();
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove driver "${name}"?`)) {
      await deletePilot(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center">
        <Trash2 className="w-6 h-6 mr-3 text-red-500" /> Remove Records
      </h3>
      <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">Select a client to expand their driver roster.</p>

      <div className="space-y-4">
        {owners.map(client => {
          const clientDrivers = pilots.filter(p => 
            p.owner_id && client.id && 
            String(p.owner_id).trim().replace(/^0+/, '') === String(client.id).trim().replace(/^0+/, '')
          );
          const isExpanded = expandedClient === client.id;

          return (
            <div key={client.id} className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all">
              <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5" onClick={() => setExpandedClient(isExpanded ? null : client.id)}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{client.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">ID: {client.id} | Drivers: {clientDrivers.length}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id, client.name); }}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  Delete Entire Client
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 bg-black/40 border-t border-white/5">
                  <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Assigned Drivers</h5>
                  {clientDrivers.length === 0 ? (
                    <p className="text-xs text-gray-600 font-bold">No drivers assigned to this client.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {clientDrivers.map(driver => (
                        <div key={driver.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-red-500/30 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Car className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                            <div>
                              <div className="text-xs font-bold text-white">{driver.name}</div>
                              <div className="text-[9px] text-gray-500 uppercase">{driver.id.includes('_') ? driver.id.split('_')[1] : driver.id}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteDriver(driver.id, driver.name)}
                            className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Driver"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

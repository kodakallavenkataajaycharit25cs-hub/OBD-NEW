import React, { useState, useEffect } from 'react';
import { createPilot, fetchPilots } from '../../services/obdApi';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function CreateDriver() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pilotForm, setPilotForm] = useState({ id: '', name: '', email: '', contact: '', password: '', vehicleNumber: '', vehicleModel: '' });
  const [existingPilots, setExistingPilots] = useState<any[]>([]);

  useEffect(() => {
    const loadPilots = async () => {
      const pilots = await fetchPilots();
      setExistingPilots(pilots);
    };
    loadPilots();
  }, []);

  const handleCreatePilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
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

    const duplicateId = existingPilots.find(p => p.id.toLowerCase() === pilotForm.id.toLowerCase());
    const duplicateEmail = pilotForm.email && existingPilots.find(p => p.email?.toLowerCase() === pilotForm.email.toLowerCase());
    const duplicatePhone = pilotForm.contact && existingPilots.find(p => p.contact === pilotForm.contact);

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
    
    // Fallback to a default owner ID if user.id is somehow missing
    const ownerId = user?.id || 'owner-default';
    
    await createPilot({ 
      ...pilotForm, 
      owner_id: ownerId, 
      trips: 0, 
      hours: 0, 
      safetyScore: 10, 
      status: 'active', 
      availability: 'off-duty', 
      rating: 5 
    });
    
    setMessage('Driver created successfully!');
    setPilotForm({ id: '', name: '', email: '', contact: '', password: '', vehicleNumber: '', vehicleModel: '' });
    setLoading(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <div className="flex items-center mb-6">
          <Link to="/owner/drivers" className="mr-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-3 text-blue-500" />
            Create New Driver
          </h2>
        </div>

        {message && (
          <div className="p-4 mb-6 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl font-bold">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 mb-6 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold">
            {error}
          </div>
        )}

        <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl max-w-2xl">
          <form onSubmit={handleCreatePilot} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Driver ID</label>
              <input 
                required 
                value={pilotForm.id} 
                onChange={e => setPilotForm({...pilotForm, id: e.target.value})} 
                className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                placeholder="e.g. D101" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
              <input 
                required 
                value={pilotForm.name} 
                onChange={e => setPilotForm({...pilotForm, name: e.target.value})} 
                className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                placeholder="e.g. John Doe" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contact (Phone)</label>
                <input 
                  type="text" 
                  value={pilotForm.contact} 
                  onChange={e => setPilotForm({...pilotForm, contact: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                  maxLength={10}
                  className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="1234567890" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={pilotForm.email} 
                  onChange={e => setPilotForm({...pilotForm, email: e.target.value})} 
                  className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="driver@example.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input 
                  type="text" 
                  value={pilotForm.password} 
                  onChange={e => setPilotForm({...pilotForm, password: e.target.value})} 
                  className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="Create password" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Vehicle Number</label>
                <input 
                  type="text" 
                  value={pilotForm.vehicleNumber} 
                  onChange={e => setPilotForm({...pilotForm, vehicleNumber: e.target.value})} 
                  className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="e.g. MH-01-AB-1234" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Vehicle Model</label>
                <input 
                  type="text" 
                  value={pilotForm.vehicleModel} 
                  onChange={e => setPilotForm({...pilotForm, vehicleModel: e.target.value})} 
                  className="w-full bg-[#120F17] border border-white/5 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="e.g. Tata Ace" 
                />
              </div>
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? 'Creating...' : 'Add Driver to Fleet'}
            </button>
          </form>
        </div>
      </BorderGlow>
    </div>
  );
}

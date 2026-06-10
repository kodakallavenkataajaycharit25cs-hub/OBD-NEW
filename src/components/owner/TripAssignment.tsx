import React, { useState, useEffect, useRef } from 'react';
import {
  Route as RouteIcon,
  Car,
  User,
  Phone,
  Mail,
  Users,
  IndianRupee,
  MapPin,
  Plus,
  CheckCircle,
  Trash2,
  Edit,
  X,
  Clock,
  ChevronDown
} from 'lucide-react';
import BorderGlow from '../BorderGlow';
import { fetchPilots } from '../../services/obdApi';

interface TripAssignment {
  id: string;
  driverName: string;
  vehicle: string;
  origin: string;
  destination: string;
  tripCost: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  numberOfPeople: number;
  status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

const initialTrips: TripAssignment[] = [
  {
    id: 'TRIP-001',
    driverName: 'Suresh Singh',
    vehicle: 'MH 02 AB 1234 - Innova Crysta',
    origin: 'Mumbai Airport',
    destination: 'Pune',
    tripCost: 5600,
    customerName: 'Rajesh Mehta',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rajesh.mehta@gmail.com',
    numberOfPeople: 4,
    status: 'in-progress',
    createdAt: '2025-01-15T10:30:00'
  },
  {
    id: 'TRIP-002',
    driverName: 'Ramesh Sharma',
    vehicle: 'DL 01 CD 5678 - Tempo Traveller',
    origin: 'Delhi',
    destination: 'Agra',
    tripCost: 8200,
    customerName: 'Priya Kapoor',
    customerPhone: '+91 87654 32109',
    customerEmail: 'priya.k@outlook.com',
    numberOfPeople: 8,
    status: 'assigned',
    createdAt: '2025-01-15T14:00:00'
  },
  {
    id: 'TRIP-003',
    driverName: 'Vikram Patel',
    vehicle: 'KA 05 EF 9012 - Force Traveller',
    origin: 'Bengaluru',
    destination: 'Mysuru',
    tripCost: 3800,
    customerName: 'Amit Joshi',
    customerPhone: '+91 76543 21098',
    customerEmail: 'amit.joshi@yahoo.com',
    numberOfPeople: 2,
    status: 'completed',
    createdAt: '2025-01-14T08:15:00'
  }
];

const availableDrivers = [
  'Suresh Singh',
  'Ramesh Sharma',
  'Vikram Patel',
  'Ajay Kumar',
  'Manoj Tiwari',
  'Deepak Yadav'
];

const availableVehicles = [
  'MH 02 AB 1234 - Innova Crysta',
  'DL 01 CD 5678 - Tempo Traveller',
  'KA 05 EF 9012 - Force Traveller',
  'RJ 14 KL 3456 - Ertiga',
  'TN 07 IJ 7890 - Corolla Altis',
  'GJ 06 MN 2345 - Swift Dzire'
];

const emptyForm = {
  driverName: '',
  vehicle: '',
  origin: '',
  destination: '',
  tripCost: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  numberOfPeople: ''
};

export default function TripAssignment() {
  const [trips, setTrips] = useState<TripAssignment[]>(initialTrips);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pilots, setPilots] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [viewTripId, setViewTripId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewTripId && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [viewTripId, editingId]);

  useEffect(() => {
    const loadPilots = async () => {
      try {
        const data = await fetchPilots();
        setPilots(data || []);
      } catch (err) {
        console.error('Failed to load pilots:', err);
      }
    };
    loadPilots();
  }, []);

  // Always derive the viewed trip from the live trips array so edits are reflected instantly
  const viewTrip = viewTripId ? trips.find(t => t.id === viewTripId) || null : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.driverName || !form.vehicle || !form.origin || !form.destination || !form.tripCost || !form.customerName || !form.customerPhone || !form.numberOfPeople) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (form.customerPhone && form.customerPhone.length !== 10) {
      showMessage('Phone number must be exactly 10 digits.', 'error');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (form.customerEmail && !emailRegex.test(form.customerEmail)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    if (editingId) {
      setTrips(prev => prev.map(t => t.id === editingId ? {
        ...t,
        driverName: form.driverName,
        vehicle: form.vehicle,
        origin: form.origin,
        destination: form.destination,
        tripCost: Number(form.tripCost),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        numberOfPeople: Number(form.numberOfPeople)
      } : t));
      showMessage(`Trip ${editingId} updated successfully!`);
      // Re-open the detail view with the updated trip
      setViewTripId(editingId);
      setEditingId(null);
    } else {
      const newTrip: TripAssignment = {
        id: `TRIP-${String(trips.length + 1).padStart(3, '0')}`,
        driverName: form.driverName,
        vehicle: form.vehicle,
        origin: form.origin,
        destination: form.destination,
        tripCost: Number(form.tripCost),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        numberOfPeople: Number(form.numberOfPeople),
        status: 'assigned',
        createdAt: new Date().toISOString()
      };
      setTrips(prev => [newTrip, ...prev]);
      showMessage(`Trip ${newTrip.id} created and assigned to ${form.driverName}!`);
      
      // WhatsApp Integration
      const pilot = pilots.find(p => p.name === form.driverName);
      let driverPhone = pilot?.contact ? pilot.contact.replace(/\D/g, '') : '9876543210';
      if (driverPhone.length === 10) driverPhone = '91' + driverPhone; // Default to India prefix for demo

      const googleMapsRoute = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.origin)}&destination=${encodeURIComponent(form.destination)}`;
      
      const waMessage = ` New trip assigned
---- Customer Details ----
Customer : ${form.customerName}
No.of people : ${form.numberOfPeople}
Phone : ${form.customerPhone}
Price : ${form.tripCost}

---- Trip Details ----
From : ${form.origin}
To : ${form.destination}
Route : ${googleMapsRoute}

Drive safe and please confirm receipt of this message!`;

      const whatsappUrl = `https://wa.me/${driverPhone}?text=${encodeURIComponent(waMessage)}`;
      window.open(whatsappUrl, '_blank');
    }

    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (trip: TripAssignment) => {
    setForm({
      driverName: trip.driverName,
      vehicle: trip.vehicle,
      origin: trip.origin,
      destination: trip.destination,
      tripCost: String(trip.tripCost),
      customerName: trip.customerName,
      customerPhone: trip.customerPhone,
      customerEmail: trip.customerEmail,
      numberOfPeople: String(trip.numberOfPeople)
    });
    setEditingId(trip.id);
    setShowForm(false);
    setViewTripId(trip.id);
  };

  const handleDelete = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    showMessage(`Trip ${id} removed.`);
    setViewTripId(null);
  };

  const handleStatusChange = (id: string, newStatus: TripAssignment['status']) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showMessage(`Trip ${id} marked as ${newStatus}.`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const inputClass = "w-full bg-[#120F17] border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors placeholder:text-gray-600";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";
  const selectClass = "w-full bg-[#120F17] border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
            <RouteIcon className="w-7 h-7 mr-3 text-emerald-500" />
            Trip Assignment
          </h2>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 ${showForm ? 'bg-white/5 text-red-400 border border-white/10 hover:bg-red-500/30' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'}`}
          >
            {showForm ? <><X className="w-4 h-4" /><span>Cancel</span></> : <><Plus className="w-4 h-4" /><span>Assign New Trip</span></>}
          </button>
        </div>
      </BorderGlow>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl font-bold border transition-all animate-in fade-in duration-300 ${messageType === 'success' ? 'bg-white/5 text-green-400 border border-white/10' : 'bg-white/5 text-red-400 border border-white/10'}`}>
          {message}
        </div>
      )}

      {/* Trip View Modal / Edit in place */}
      {viewTrip && (
        <div ref={detailsRef} className="scroll-mt-6">
          <BorderGlow
            borderRadius={24}
            backgroundColor="#120F17"
            className="p-6 border-white/5 shadow-2xl animate-in fade-in duration-300"
          >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
              {editingId ? <>Edit Trip — {viewTrip.id}</> : <>Trip Details — {viewTrip.id}</>}
            </h3>
            <button onClick={() => { setViewTripId(null); setEditingId(null); }} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {editingId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route & Driver */}
                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Route & Assignment</h4>
                  
                  <div className="relative">
                    <label className={labelClass}>Driver Name *</label>
                    <select
                      required
                      value={form.driverName}
                      onChange={e => setForm({ ...form, driverName: e.target.value })}
                      className={selectClass}
                    >
                      <option value="" className="bg-[#120F17]">Select a driver...</option>
                      {pilots.map(p => <option key={p.id} value={p.name} className="bg-[#120F17]">{p.name}</option>)}
                      {pilots.length === 0 && availableDrivers.map(d => <option key={d} value={d} className="bg-[#120F17]">{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Vehicle *</label>
                    <select
                      required
                      value={form.vehicle}
                      onChange={e => setForm({ ...form, vehicle: e.target.value })}
                      className={selectClass}
                    >
                      <option value="" className="bg-[#120F17]">Select a vehicle...</option>
                      {availableVehicles.map(v => <option key={v} value={v} className="bg-[#120F17]">{v}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>From (Origin) *</label>
                      <input
                        required
                        value={form.origin}
                        onChange={e => setForm({ ...form, origin: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Mumbai Airport"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>To (Destination) *</label>
                      <input
                        required
                        value={form.destination}
                        onChange={e => setForm({ ...form, destination: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Pune"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Trip Cost (₹) *</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.tripCost}
                      onChange={e => setForm({ ...form, tripCost: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. 5600"
                    />
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">Customer Information</h4>
                  
                  <div>
                    <label className={labelClass}>Customer Name *</label>
                    <input
                      required
                      value={form.customerName}
                      onChange={e => setForm({ ...form, customerName: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Rajesh Mehta"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={form.customerPhone}
                      onChange={e => setForm({ ...form, customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      maxLength={10}
                      className={inputClass}
                      placeholder="1234567890"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={e => setForm({ ...form, customerEmail: e.target.value })}
                      className={inputClass}
                      placeholder="customer@email.com"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>No. of People *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={form.numberOfPeople}
                      onChange={e => setForm({ ...form, numberOfPeople: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl transition-colors font-bold text-sm cursor-pointer"
                >
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl transition-colors font-bold text-sm cursor-pointer"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route & Driver */}
                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Route & Assignment</h4>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Driver</span>
                      <span className="text-white font-semibold">{viewTrip.driverName}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Vehicle</span>
                      <span className="text-white font-semibold">{viewTrip.vehicle}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Route</span>
                      <span className="text-white font-semibold">{viewTrip.origin} → {viewTrip.destination}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IndianRupee className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Trip Cost</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(viewTrip.tripCost)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Created</span>
                      <span className="text-gray-300 font-medium">{new Date(viewTrip.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">Customer Information</h4>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-white shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Name</span>
                      <span className="text-white font-semibold">{viewTrip.customerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Phone</span>
                      <span className="text-white font-semibold">{viewTrip.customerPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Email</span>
                      <span className="text-white font-semibold">{viewTrip.customerEmail || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Passengers</span>
                      <span className="text-white font-bold text-lg">{viewTrip.numberOfPeople}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <button onClick={() => handleEdit(viewTrip)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold text-sm">
                  <Edit className="w-4 h-4" /><span>Edit Trip</span>
                </button>
                {viewTrip.status === 'assigned' && (
                  <button onClick={() => handleStatusChange(viewTrip.id, 'in-progress')} className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold text-sm">
                    <RouteIcon className="w-4 h-4" /><span>Start Trip</span>
                  </button>
                )}
                {viewTrip.status === 'in-progress' && (
                  <button onClick={() => handleStatusChange(viewTrip.id, 'completed')} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold text-sm">
                    <CheckCircle className="w-4 h-4" /><span>Complete Trip</span>
                  </button>
                )}
                <button onClick={() => handleDelete(viewTrip.id)} className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2.5 rounded-xl transition-colors font-bold text-sm border border-red-500/30">
                  <Trash2 className="w-4 h-4" /><span>Delete</span>
                </button>
              </div>
            </>
          )}
          </BorderGlow>
        </div>
      )}

      {/* Assignment Form */}
      {showForm && (
        <BorderGlow
          borderRadius={24}
          backgroundColor="#120F17"
          className="p-6 border-white/5 shadow-2xl"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            {editingId ? <><Edit className="w-5 h-5 mr-2 text-blue-400" /> Edit Trip — {editingId}</> : <><Plus className="w-5 h-5 mr-2 text-emerald-400" /> New Trip Assignment</>}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver & Vehicle */}
            <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Driver & Vehicle Assignment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className={labelClass}>Driver Name *</label>
                  <select
                    required
                    value={form.driverName}
                    onChange={e => setForm({ ...form, driverName: e.target.value })}
                    className={selectClass}
                  >
                    <option value="" className="bg-[#120F17]">Select a driver...</option>
                    {pilots.map(p => <option key={p.id} value={p.name} className="bg-[#120F17]">{p.name}</option>)}
                    {pilots.length === 0 && availableDrivers.map(d => <option key={d} value={d} className="bg-[#120F17]">{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className={labelClass}>Vehicle *</label>
                  <select
                    required
                    value={form.vehicle}
                    onChange={e => setForm({ ...form, vehicle: e.target.value })}
                    className={selectClass}
                  >
                    <option value="" className="bg-[#120F17]">Select a vehicle...</option>
                    {availableVehicles.map(v => <option key={v} value={v} className="bg-[#120F17]">{v}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Route & Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>From (Origin) *</label>
                  <input
                    required
                    value={form.origin}
                    onChange={e => setForm({ ...form, origin: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Mumbai Airport"
                  />
                </div>
                <div>
                  <label className={labelClass}>To (Destination) *</label>
                  <input
                    required
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Pune"
                  />
                </div>
                <div>
                  <label className={labelClass}>Trip Cost (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.tripCost}
                    onChange={e => setForm({ ...form, tripCost: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. 5600"
                  />
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-4">Customer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Customer Name *</label>
                  <input
                    required
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Rajesh Mehta"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={form.customerPhone}
                    onChange={e => setForm({ ...form, customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    maxLength={10}
                    className={inputClass}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={e => setForm({ ...form, customerEmail: e.target.value })}
                    className={inputClass}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>No. of People *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.numberOfPeople}
                    onChange={e => setForm({ ...form, numberOfPeople: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
            >
              {editingId ? 'Update Trip Assignment' : 'Assign Trip to Driver'}
            </button>
          </form>
        </BorderGlow>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: trips.length, color: 'text-white' },
          { label: 'Assigned', value: trips.filter(t => t.status === 'assigned').length, color: 'text-blue-400' },
          { label: 'In Progress', value: trips.filter(t => t.status === 'in-progress').length, color: 'text-yellow-400' },
          { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, color: 'text-green-400' },
        ].map((stat, i) => (
          <BorderGlow
            key={i}
            borderRadius={20}
            backgroundColor="#120F17"
            className="p-5 border-white/5 shadow-2xl text-center"
          >
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{stat.label}</div>
          </BorderGlow>
        ))}
      </div>

      {/* Trip List */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">All Trip Assignments</h3>

        {trips.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <RouteIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold">No trips assigned yet</p>
            <p className="text-sm mt-1">Click "Assign New Trip" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map(trip => (
              <div
                key={trip.id}
                className="p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer"
                onClick={() => setViewTripId(trip.id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Trip info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">{trip.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                      {trip.origin} → {trip.destination}
                    </h4>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {trip.driverName}</span>
                      <span className="flex items-center"><Car className="w-3 h-3 mr-1" /> {trip.vehicle.split(' - ')[1]}</span>
                      <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {trip.numberOfPeople} pax</span>
                    </div>
                  </div>

                  {/* Right: Customer & cost */}
                  <div className="flex items-center space-x-6 shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Customer</div>
                      <div className="text-sm font-bold text-white">{trip.customerName}</div>
                      <div className="text-[10px] text-gray-500">{trip.customerPhone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Cost</div>
                      <div className="text-xl font-black text-white tracking-tight">{formatCurrency(trip.tripCost)}</div>
                    </div>
                    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(trip)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </BorderGlow>
    </div>
  );
}

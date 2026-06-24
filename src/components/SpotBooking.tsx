import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Car,
  CheckCircle,
  Clock,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import BorderGlow from './BorderGlow';
import { CustomDateInput, CustomTimeInput } from './ui/DateTimeInputs';

interface LocationAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}

function LocationAutocomplete({ value, onChange, placeholder, icon }: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const localDb = [
          { name: "RNSIT Entrance Location", type: "bookmark", desc: "Your list · 1 place" },
          { name: "RNSIT Entrance Saved", type: "bookmark", desc: "Saved in RNSIT Entrance Lo..." },
          { name: "RNS Institute of Technology (RNSIT)", type: "history", desc: "RNSIT College, Bangarappa Nagara, Bengaluru, Karnataka 560098" },
          { name: "RNSIT CSE Department", type: "pin", desc: "Uttarahalli Main Road, Bengaluru" },
          { name: "RNSIT College Bus Stand", type: "pin", desc: "23rd Cross Road, Dwaraka Nagar, Bengaluru" },
          { name: "MG Road, Bengaluru", type: "history", desc: "Mahatma Gandhi Road, Bengaluru, Karnataka 560001" },
          { name: "MG Road Metro Station", type: "pin", desc: "MG Road, Shivaji Nagar, Bengaluru, Karnataka" },
          { name: "Indiranagar, Bengaluru", type: "pin", desc: "Bengaluru, Karnataka 560038" },
          { name: "Koramangala, Bengaluru", type: "pin", desc: "Bengaluru, Karnataka" },
          { name: "Kempegowda International Airport (BLR)", type: "pin", desc: "Devenahalli, Bengaluru, Karnataka" },
          { name: "Majestic Railway Station", type: "history", desc: "Gubbi Thotadappa Road, Bengaluru" },
          { name: "Electronic City Phase 1", type: "pin", desc: "Hosur Road, Bengaluru, Karnataka" },
          { name: "Whitefield Inner Ring Road", type: "pin", desc: "Mahadevapura, Bengaluru" }
        ];

        const query = value.toLowerCase();
        // Support spelling variations like benguluru / bengaluru
        const queryNormalized = query.replace('benguluru', 'bengaluru');
        const localMatches = localDb.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.desc.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(queryNormalized) || 
          item.desc.toLowerCase().includes(queryNormalized)
        );

        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=in&limit=10`, {
          headers: { 'User-Agent': 'Sukrutha-Mobility-Client' }
        });
        const globalData = await response.json();
        const globalMatches = globalData.map((item: any) => ({
          name: item.name || item.display_name.split(',')[0],
          type: "pin",
          desc: item.display_name
        }));

        const combined = [
          ...localMatches,
          ...globalMatches.filter(g => !localMatches.some(l => l.name.toLowerCase() === g.name.toLowerCase()))
        ];

        setSuggestions(combined);
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (name: string) => {
    onChange(name);
    setShowDropdown(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-blue-500" />;
      case 'history':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      {icon}
      <input
        required
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner text-sm"
      />
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-[#120F17] rounded-2xl shadow-2xl z-50 border border-white/10 overflow-hidden divide-y divide-white/5 overflow-y-auto max-h-72">
          {suggestions.map((item, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleSelect(item.name)}
              className="w-full px-5 py-3 flex items-start space-x-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="mt-1 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-white truncate">{item.name}</span>
                <span className="block text-xs text-gray-500 truncate mt-0.5">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useAuth } from '../contexts/AuthContext';
import { createBooking, fetchPilots } from '../services/obdApi';

export default function SpotBooking() {
  const { user } = useAuth();
  const [booking, setBooking] = useState({
    departure: '',
    destination: '',
    passengers: '1',
    car: '',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    price: '',
    vehicleNumber: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fleetVehicles, setFleetVehicles] = useState<any[]>([]);

  const vehicles = [
    { id: 'innova', name: 'Innova Crysta', seats: 7 },
    { id: 'tempo', name: 'Tempo Traveller', seats: 12 },
    { id: 'force', name: 'Force Traveller', seats: 15 },
    { id: 'harrier', name: 'Tata Harrier', seats: 5 },
  ];

  React.useEffect(() => {
    const loadFleetVehicles = async () => {
      try {
        const allPilots = await fetchPilots();
        if (user && user.email) {
          const currentPilot = allPilots.find((p: any) => p.email?.toLowerCase() === user.email.toLowerCase());
          if (currentPilot && currentPilot.owner_id) {
            const sameFleetPilots = allPilots.filter((p: any) => 
              p.owner_id && 
              String(p.owner_id).trim().replace(/^0+/, '') === String(currentPilot.owner_id).trim().replace(/^0+/, '')
            );
            const vehiclesMap = new Map();
            sameFleetPilots.forEach((p: any) => {
              if (p.vehicle_number && p.vehicle_number.trim() && p.vehicle_model && p.vehicle_model.trim()) {
                vehiclesMap.set(p.vehicle_number.trim(), {
                  id: p.id,
                  name: p.vehicle_model,
                  number: p.vehicle_number,
                  seats: 5
                });
              }
            });
            setFleetVehicles(Array.from(vehiclesMap.values()));
          }
        }
      } catch (err) {
        console.error('Error loading fleet vehicles:', err);
      }
    };
    loadFleetVehicles();
  }, [user]);

  React.useEffect(() => {
    if (fleetVehicles.length > 0) {
      setBooking(prev => ({ ...prev, car: fleetVehicles[0].name, vehicleNumber: fleetVehicles[0].number }));
    } else {
      setBooking(prev => ({ ...prev, car: vehicles[0].id, vehicleNumber: '' }));
    }
  }, [fleetVehicles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = vehicles.find(v => v.id === booking.car);
    const bookingPayload = {
      ...booking,
      driverEmail: user?.email,
      driverName: user?.name,
      driverPhone: 'N/A',
      vehicleNumber: booking.vehicleNumber || 'N/A',
      car: vehicle ? vehicle.name : booking.car
    };
    setError(null);
    const response = await createBooking(bookingPayload);
    
    if (!response.success && response.error) {
      setError(response.error);
      return;
    }

    try {
      const stored = localStorage.getItem('sukrutha_assigned_trips');
      const allTrips = stored ? JSON.parse(stored) : [];
      const newTrip = {
        id: `TRIP-BOOK-${Date.now()}`,
        driverName: user?.name || 'Unknown',
        driverEmail: user?.email || '',
        vehicle: bookingPayload.vehicleNumber || 'N/A',
        origin: bookingPayload.departure,
        destination: bookingPayload.destination,
        tripDate: bookingPayload.date,
        startTime: bookingPayload.time,
        endTime: '',
        tripCost: Number(bookingPayload.price) || 0,
        customerName: bookingPayload.customerName,
        customerPhone: bookingPayload.customerPhone,
        customerEmail: user?.email || '',
        numberOfPeople: Number(bookingPayload.passengers) || 1,
        status: 'assigned',
        createdAt: new Date().toISOString()
      };
      allTrips.unshift(newTrip);
      localStorage.setItem('sukrutha_assigned_trips', JSON.stringify(allTrips));
    } catch (err) {
      console.error('Failed to sync booking to local trips:', err);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase clay-text-3d">Spot Registration</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Immediate Terminal Booking Node</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-xs font-black uppercase tracking-widest">{error}</span>
            </div>
          )}
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="p-8 border-white/5 shadow-2xl relative h-full"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Departure Point</label>
                  <LocationAutocomplete
                    value={booking.departure}
                    onChange={(val) => setBooking(prev => ({ ...prev, departure: val }))}
                    placeholder="Enter Pickup Location"
                    icon={<MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors" />}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Destination Vector</label>
                  <LocationAutocomplete
                    value={booking.destination}
                    onChange={(val) => setBooking(prev => ({ ...prev, destination: val }))}
                    placeholder="Enter Dropoff Location"
                    icon={<div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-gray-700 rounded-full" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Customer Name</label>
                  <div className="relative group">
                    <input
                      required
                      type="text"
                      value={booking.customerName}
                      onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter Customer Name"
                      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Customer Phone</label>
                  <div className="relative group">
                    <input
                      required
                      type="text"
                      value={booking.customerPhone}
                      onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="Enter Phone Number"
                      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Price (₹)</label>
                  <div className="relative group">
                    <input
                      required
                      type="number"
                      value={booking.price}
                      onChange={(e) => setBooking(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Estimated Price"
                      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Passenger Count</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      value={booking.passengers}
                      onChange={(e) => setBooking(prev => ({ ...prev, passengers: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 12, 15].map(num => (
                        <option key={num} value={num} className="bg-[#120F17]">{num} People</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mission Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors pointer-events-none z-20" />
                    <CustomDateInput
                      required
                      value={booking.date}
                      onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Launch Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors pointer-events-none z-20" />
                    <CustomTimeInput
                      required
                      value={booking.time}
                      onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Machine Allocation</label>
                <div className="relative group">
                  <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                  <select
                    value={booking.vehicleNumber ? `${booking.car}|${booking.vehicleNumber}` : booking.car}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes('|')) {
                        const [carName, plate] = val.split('|');
                        setBooking(prev => ({ ...prev, car: carName, vehicleNumber: plate }));
                      } else {
                        setBooking(prev => ({ ...prev, car: val, vehicleNumber: '' }));
                      }
                    }}
                    className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all cursor-pointer text-sm font-bold uppercase tracking-wider"
                  >
                    <option value="" disabled className="bg-[#120F17] text-gray-600">Select Vehicle</option>
                    {fleetVehicles.length > 0 ? (
                      fleetVehicles.map((v) => (
                        <option key={v.number} value={`${v.name}|${v.number}`} className="bg-[#120F17]">
                          {v.name.toUpperCase()} - {v.number}
                        </option>
                      ))
                    ) : (
                      vehicles.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[#120F17]">
                          {v.name.toUpperCase()} ({v.seats} SEATS)
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 ${submitted
                    ? 'bg-green-500/20 text-green-500 border border-green-500/20 cursor-default'
                    : 'clay-btn clay-btn-blue border-none shadow-blue-900/40 hover:scale-[1.02]'
                  }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Booking Synchronized</span>
                  </>
                ) : (
                  <>
                    <span>Execute Spot Booking</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </BorderGlow>
        </div>

        <div className="space-y-8">
          <BorderGlow
            borderRadius={28}
            glowColor="180 80 50"
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="p-8 border-none shadow-blue-900/50 relative overflow-hidden group h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            
            <div className="mb-10">
              <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">Instant Confirmation</h3>
              <p className="text-xs font-black text-blue-100/60 uppercase tracking-widest leading-relaxed mb-8">
                Spot bookings are processed with priority routing. Ensure all passenger documents are verified at the boarding station.
              </p>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Node Ready</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest italic clay-text-3d">Recent Registrations</h3>
              <div className="space-y-4">
                {[
                  { id: 'BK-501', route: 'Domestic Terminal → Bandra', time: '10:45 AM' },
                  { id: 'BK-498', route: 'Gateway → Colaba', time: '09:20 AM' },
                  { id: 'BK-492', route: 'BKC Node → Powai', time: '08:15 AM' }
                ].map((b, i) => (
                  <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5 shadow-inner flex items-center justify-between group">
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">{b.route}</div>
                      <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">{b.id} • {b.time}</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}

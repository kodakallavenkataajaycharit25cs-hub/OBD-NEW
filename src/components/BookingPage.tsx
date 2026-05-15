import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  ArrowRight, 
  Plus, 
  CreditCard,
  LogIn,
  Phone,
  Activity,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BorderGlow from './BorderGlow';

interface BookingPageProps {
  onLoginClick: () => void;
}

interface BookingForm {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  tripType: 'one-way' | 'round-trip' | 'hourly';
  passengers: number;
  vehicle: string;
  stops: string[];
}

export default function BookingPage({ onLoginClick }: BookingPageProps) {
  const [booking, setBooking] = useState<BookingForm>({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    tripType: 'one-way',
    passengers: 4,
    vehicle: '',
    stops: []
  });

  const [fareEstimate, setFareEstimate] = useState({
    distance: 0,
    baseFare: 0,
    fuelSurcharge: 0,
    driverAllowance: 0,
    tollsParking: 0,
    gst: 0,
    total: 0
  });

  const vehicles = [
    { id: 'innova', name: 'Innova Crysta', seats: 7, rate: 12, image: 'sedan' },
    { id: 'tempo', name: 'Tempo Traveller', seats: 12, rate: 15, image: 'suv' },
    { id: 'force', name: 'Force Traveller', seats: 15, rate: 18, image: 'van' },
    { id: 'harrier', name: 'Tata Harrier', seats: 5, rate: 14, image: 'suv' },
  ];

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', distance: '148 km', duration: '3h' },
    { from: 'Delhi', to: 'Agra', distance: '233 km', duration: '4h' },
    { from: 'Bengaluru', to: 'Coorg', distance: '236 km', duration: '5h' }
  ];

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateFare = () => {
    if (!booking.pickup || !booking.dropoff || !booking.vehicle) return;
    const distance = Math.floor(Math.random() * 300) + 50;
    const selectedVehicle = vehicles.find(v => v.id === booking.vehicle);
    if (!selectedVehicle) return;

    const baseFare = distance * selectedVehicle.rate;
    const fuelSurcharge = baseFare * 0.15;
    const driverAllowance = distance > 150 ? 500 : 0;
    const tollsParking = distance > 100 ? 200 : 0;
    const subtotal = baseFare + fuelSurcharge + driverAllowance + tollsParking;
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    setFareEstimate({
      distance,
      baseFare,
      fuelSurcharge,
      driverAllowance,
      tollsParking,
      gst,
      total
    });
  };

  const addStop = () => {
    setBooking(prev => ({
      ...prev,
      stops: [...prev.stops, '']
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-['Space_Grotesk'] overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-navbar border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-white text-black rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl transition-all group-hover:rotate-6">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none clay-text-3d uppercase">SUKRUTHA</span>
              <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-blue-500 mt-1">Mobility</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Return Home</Link>
            <button
              onClick={onLoginClick}
              className="clay-btn clay-btn-blue text-[10px] uppercase tracking-widest px-6"
            >
              Authorization
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic clay-text-3d uppercase text-white">
            Secure Your Voyage
          </h1>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] italic">
            Elite Chauffeur-Driven Network • Nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            <BorderGlow
              borderRadius={32}
              backgroundColor="#120F17"
              className="p-10 border-white/5 shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white">Route Parameters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Launch Point</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={booking.pickup}
                      onChange={(e) => setBooking(prev => ({ ...prev, pickup: e.target.value }))}
                      placeholder="Start Location"
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Destination Vector</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-gray-700 rounded-full" />
                    <input
                      type="text"
                      value={booking.dropoff}
                      onChange={(e) => setBooking(prev => ({ ...prev, dropoff: e.target.value }))}
                      placeholder="End Location"
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mission Date</label>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Payload Time</label>
                  <input
                    type="time"
                    value={booking.time}
                    onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Unit Occupants</label>
                  <select
                    value={booking.passengers}
                    onChange={(e) => setBooking(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 12, 15].map(num => (
                      <option key={num} value={num} className="bg-[#120F17]">{num} Pax</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 italic">Tactical Trip Profile</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'one-way', label: 'Infiltration' },
                    { value: 'round-trip', label: 'Cycle' },
                    { value: 'hourly', label: 'Standby' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBooking(prev => ({ ...prev, tripType: option.value as any }))}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${booking.tripType === option.value
                          ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white translate-y-[-2px]'
                          : 'bg-black/20 text-gray-600 hover:text-white hover:bg-white/5 border border-white/5 shadow-inner'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </BorderGlow>

            {/* Vehicle Selection */}
            <BorderGlow
              borderRadius={32}
              backgroundColor="#120F17"
              className="p-10 border-white/5 shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white">Machine Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setBooking(prev => ({ ...prev, vehicle: vehicle.id }))}
                    className={`text-left p-6 rounded-3xl transition-all border-none ${booking.vehicle === vehicle.id
                        ? 'clay-card bg-blue-600 text-white shadow-blue-900/40 scale-[1.02]'
                        : 'clay-card bg-white/5 text-gray-500 hover:bg-white/10 border-white/5 shadow-inner'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-sm uppercase tracking-tight">{vehicle.name}</h3>
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                        <Car className={`w-5 h-5 ${booking.vehicle === vehicle.id ? 'text-white' : 'text-gray-700'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <Users className="w-3 h-3" />
                        <span>{vehicle.seats} Units</span>
                      </div>
                      <span className={`text-sm font-black tracking-tighter ${booking.vehicle === vehicle.id ? 'text-white' : 'text-blue-500'}`}>₹{vehicle.rate}/km</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={calculateFare}
                className="w-full clay-btn clay-btn-blue mt-10 h-16 text-xs uppercase tracking-[0.4em]"
              >
                Execute Analysis
              </button>
            </BorderGlow>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Fare Estimate */}
            {fareEstimate.total > 0 ? (
              <BorderGlow
                borderRadius={32}
                backgroundColor="#120F17"
                className="p-10 border-none shadow-blue-900/50 sticky top-32"
              >
                <div className="absolute inset-0 bg-blue-600 opacity-90 z-[-1]" />
                <h3 className="text-xl font-black mb-8 text-white uppercase tracking-tighter italic shadow-sm">Credit Analysis</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-blue-100/60 pb-4 border-b border-white/10">
                    <span>Range Vector</span>
                    <span className="text-white text-xs">{fareEstimate.distance} km</span>
                  </div>
                  {[
                    { l: 'Base Credit', v: fareEstimate.baseFare },
                    { l: 'Fuel Energy', v: fareEstimate.fuelSurcharge },
                    { l: 'Pilot Allowance', v: fareEstimate.driverAllowance },
                    { l: 'Node Tolls', v: fareEstimate.tollsParking },
                    { l: 'Protocal Tax (5%)', v: fareEstimate.gst }
                  ].filter(x => x.v > 0).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-blue-100/40">
                      <span>{item.l}</span>
                      <span className="text-white opacity-80">{formatIndianCurrency(item.v)}</span>
                    </div>
                  ))}

                  <div className="pt-6 mt-4 border-t-2 border-dashed border-white/20">
                    <div className="flex justify-between items-end">
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-100/50 mb-1">Total Payload</div>
                      <div className="text-4xl font-black text-white tracking-tighter shadow-lg">
                        {formatIndianCurrency(fareEstimate.total)}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full clay-btn clay-btn-white mt-10 h-16 flex items-center justify-center space-x-3 text-xs">
                  <CreditCard className="w-5 h-5" />
                  <span>AUTHORIZE BOOKING</span>
                </button>
              </BorderGlow>
            ) : (
              <BorderGlow
                borderRadius={32}
                backgroundColor="#120F17"
                className="p-10 border-white/5 border-dashed flex flex-col items-center justify-center text-center opacity-40 py-20"
              >
                <Zap className="w-12 h-12 text-gray-700 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 leading-relaxed">
                  Complete parameters to<br />unlock credit analysis
                </p>
              </BorderGlow>
            )}

            {/* Popular Routes */}
            <BorderGlow
              borderRadius={32}
              backgroundColor="#120F17"
              className="p-10 border-white/5 shadow-2xl"
            >
              <h3 className="text-xl font-black mb-8 text-white uppercase tracking-tighter clay-text-3d italic">Standard Routes</h3>

              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setBooking(prev => ({ ...prev, pickup: route.from, dropoff: route.to }))}
                    className="w-full p-5 bg-black/20 border-white/5 hover:bg-white/5 transition-all text-left flex items-center justify-between group shadow-inner rounded-2xl"
                  >
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                        {route.from} → {route.to}
                      </div>
                      <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                        {route.distance} • {route.duration} Cycle
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </BorderGlow>

            {/* Support */}
            <BorderGlow
              borderRadius={32}
              backgroundColor="#120F17"
              className="p-10 border-white/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:scale-150" />
              <h3 className="text-xl font-black mb-4 text-white uppercase tracking-tighter clay-text-3d italic leading-none">Inquiry Node</h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-8 leading-relaxed italic">
                Our operations team is available<br />24/7 for strategic support
              </p>
              <button className="w-full clay-btn bg-white/5 hover:bg-white/10 text-white flex items-center justify-center space-x-3 p-4 rounded-2xl border border-white/5">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Ops</span>
              </button>
            </BorderGlow>
          </div>
        </div>
      </div>
    </div>
  );
}
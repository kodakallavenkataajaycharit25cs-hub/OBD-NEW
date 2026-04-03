import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function SpotBooking() {
  const [booking, setBooking] = useState({
    departure: '',
    destination: '',
    passengers: '1',
    car: '',
    date: '',
    time: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const vehicles = [
    { id: 'innova', name: 'Innova Crysta', seats: 7 },
    { id: 'tempo', name: 'Tempo Traveller', seats: 12 },
    { id: 'force', name: 'Force Traveller', seats: 15 },
    { id: 'harrier', name: 'Tata Harrier', seats: 5 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Spot Booking Submitted:', booking);
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
          <div className="clay-card p-8 bg-zinc-900 border-white/5 shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Departure Point</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      required
                      type="text"
                      value={booking.departure}
                      onChange={(e) => setBooking(prev => ({ ...prev, departure: e.target.value }))}
                      placeholder="Enter Pickup Location"
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Destination Vector</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-gray-700 rounded-full" />
                    <input
                      required
                      type="text"
                      value={booking.destination}
                      onChange={(e) => setBooking(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Enter Dropoff Location"
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 shadow-inner"
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
                        <option key={num} value={num} className="bg-zinc-900">{num} People</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mission Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <input
                      required
                      type="date"
                      value={booking.date}
                      onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Launch Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <input
                      required
                      type="time"
                      value={booking.time}
                      onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Machine Allocation</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setBooking(prev => ({ ...prev, car: v.id }))}
                      className={`p-4 rounded-2xl text-center transition-all group ${
                        booking.car === v.id
                          ? 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white'
                          : 'bg-black/20 text-gray-600 hover:text-white hover:bg-white/5 border border-white/5 shadow-inner'
                      }`}
                    >
                      <Car className={`w-6 h-6 mx-auto mb-2 ${booking.car === v.id ? 'text-white' : 'text-gray-700 group-hover:text-blue-500/50'}`} />
                      <div className="text-[10px] font-black uppercase tracking-tighter leading-none">{v.name}</div>
                      <div className="text-[8px] font-bold opacity-40 mt-1 uppercase">{v.seats} Seats</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 ${
                  submitted 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/20 cursor-default'
                    : 'clay-card bg-blue-600 border-none shadow-blue-900/40 text-white hover:scale-[1.02] active:scale-95'
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
          </div>
        </div>

        <div className="space-y-8">
          <div className="clay-card p-8 bg-blue-600 border-none shadow-blue-900/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
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

          <div className="clay-card p-8 bg-zinc-900 border-white/5 shadow-2xl">
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
        </div>
      </div>
    </div>
  );
}

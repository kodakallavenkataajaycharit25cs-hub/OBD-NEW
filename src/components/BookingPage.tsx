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
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    { id: 'innova', name: 'Toyota Innova Crysta', seats: 7, rate: 12, image: 'sedan' },
    { id: 'tempo', name: 'Tempo Traveller', seats: 12, rate: 15, image: 'suv' },
    { id: 'force', name: 'Force Traveller', seats: 15, rate: 18, image: 'van' },
    { id: 'harrier', name: 'Tata Harrier', seats: 5, rate: 14, image: 'suv' },
    { id: 'bolero', name: 'Mahindra Bolero', seats: 8, rate: 10, image: 'suv' },
    { id: 'ertiga', name: 'Maruti Ertiga', seats: 7, rate: 9, image: 'mpv' }
  ];

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', distance: '148 km', duration: '3h' },
    { from: 'Delhi', to: 'Agra', distance: '233 km', duration: '4h' },
    { from: 'Manali', to: 'Leh', distance: '474 km', duration: '12h' },
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

    // Mock calculation based on distance and vehicle type
    const distance = Math.floor(Math.random() * 300) + 50; // 50-350 km
    const selectedVehicle = vehicles.find(v => v.id === booking.vehicle);
    if (!selectedVehicle) return;

    const baseFare = distance * selectedVehicle.rate;
    const fuelSurcharge = baseFare * 0.15;
    const driverAllowance = distance > 150 ? 500 : 0;
    const tollsParking = distance > 100 ? 200 : 0;
    const subtotal = baseFare + fuelSurcharge + driverAllowance + tollsParking;
    const gst = subtotal * 0.05; // 5% GST
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

  const updateStop = (index: number, value: string) => {
    setBooking(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => i === index ? value : stop)
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">Sukrutha Mobility</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Book Your Premium Journey
          </h1>
          <p className="text-xl text-gray-400">
            Professional chauffeur-driven vehicles across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                Trip Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location</label>
                  <input
                    type="text"
                    value={booking.pickup}
                    onChange={(e) => setBooking(prev => ({ ...prev, pickup: e.target.value }))}
                    placeholder="Enter pickup address"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Drop-off Location</label>
                  <input
                    type="text"
                    value={booking.dropoff}
                    onChange={(e) => setBooking(prev => ({ ...prev, dropoff: e.target.value }))}
                    placeholder="Enter destination address"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Additional Stops */}
              {booking.stops.map((stop, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stop {index + 1}
                  </label>
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => updateStop(index, e.target.value)}
                    placeholder="Enter stop location"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <button
                onClick={addStop}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium mb-6"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stop</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={booking.time}
                    onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Passengers</label>
                  <select
                    value={booking.passengers}
                    onChange={(e) => setBooking(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(num => (
                      <option key={num} value={num} className="bg-gray-800">{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Trip Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'one-way', label: 'One Way' },
                    { value: 'round-trip', label: 'Round Trip' },
                    { value: 'hourly', label: 'Hourly' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBooking(prev => ({ ...prev, tripType: option.value as any }))}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        booking.tripType === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Car className="w-6 h-6 mr-2 text-blue-500" />
                Choose Vehicle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setBooking(prev => ({ ...prev, vehicle: vehicle.id }))}
                    className={`cursor-pointer border rounded-lg p-4 transition-all hover:scale-105 ${
                      booking.vehicle === vehicle.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{vehicle.name}</h3>
                      <span className="text-blue-400 font-bold">₹{vehicle.rate}/km</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{vehicle.seats} seats</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculateFare}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-6 transition-colors"
              >
                Calculate Fare
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fare Estimate */}
            {fareEstimate.total > 0 && (
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Fare Estimate</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Distance: {fareEstimate.distance} km</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Base Fare</span>
                    <span>{formatIndianCurrency(fareEstimate.baseFare)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Fuel Surcharge</span>
                    <span>{formatIndianCurrency(fareEstimate.fuelSurcharge)}</span>
                  </div>
                  {fareEstimate.driverAllowance > 0 && (
                    <div className="flex justify-between text-gray-300">
                      <span>Driver Allowance</span>
                      <span>{formatIndianCurrency(fareEstimate.driverAllowance)}</span>
                    </div>
                  )}
                  {fareEstimate.tollsParking > 0 && (
                    <div className="flex justify-between text-gray-300">
                      <span>Tolls & Parking</span>
                      <span>{formatIndianCurrency(fareEstimate.tollsParking)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>GST (5%)</span>
                    <span>{formatIndianCurrency(fareEstimate.gst)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span>{formatIndianCurrency(fareEstimate.total)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-6 flex items-center justify-center space-x-2 transition-colors">
                  <CreditCard className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
              </div>
            )}

            {/* Popular Routes */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Popular Routes</h3>
              
              <div className="space-y-3">
                {popularRoutes.map((route, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setBooking(prev => ({
                        ...prev,
                        pickup: route.from,
                        dropoff: route.to
                      }));
                    }}
                    className="cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          {route.from} → {route.to}
                        </div>
                        <div className="text-sm text-gray-400">
                          {route.distance} • {route.duration}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Need Help?</h3>
              <p className="text-gray-400 mb-4">
                Our travel experts are here to assist you 24/7
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                <Phone className="w-5 h-5" />
                <span>Call Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
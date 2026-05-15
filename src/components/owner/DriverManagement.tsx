import React, { useState } from 'react';
import {
  Users,
  Star,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Car
} from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function DriverManagement() {
  const [selectedDriver, setSelectedDriver] = useState('driver-1');

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const drivers = [
    {
      id: 'driver-1',
      name: 'Suresh Singh',
      phone: '+91 98765 43210',
      email: 'suresh@luxfleet.com',
      license: 'MH123456789',
      experience: '8 years',
      assignedVehicle: 'MH 02 AB 1234 - Toyota Innova Crysta',
      status: 'active',
      location: 'En route to Pune',
      rating: 4.8,
      totalTrips: 156,
      totalDistance: 24680,
      monthlyEarnings: 48600,
      scores: {
        safety: 9.2,
        acceleration: 8.7,
        braking: 9.1,
        speed: 8.9,
        idling: 8.5,
        efficiency: 9.0
      },
      badges: ['Safe Driver', 'Eco Warrior', 'Customer Favorite'],
      violations: 2,
      documents: {
        license: { status: 'valid', expiry: '2026-03-15' },
        permit: { status: 'valid', expiry: '2025-08-20' },
        medical: { status: 'expiring', expiry: '2025-02-10' }
      }
    },
    {
      id: 'driver-2',
      name: 'Ramesh Sharma',
      phone: '+91 87654 32109',
      email: 'ramesh@luxfleet.com',
      license: 'DL987654321',
      experience: '6 years',
      assignedVehicle: 'DL 01 CD 5678 - Tempo Traveller',
      status: 'active',
      location: 'Mumbai Depot',
      rating: 4.6,
      totalTrips: 134,
      totalDistance: 21450,
      monthlyEarnings: 42800,
      scores: {
        safety: 8.9,
        acceleration: 8.2,
        braking: 8.8,
        speed: 8.4,
        idling: 7.9,
        efficiency: 8.3
      },
      badges: ['Safe Driver', 'Distance Master'],
      violations: 4,
      documents: {
        license: { status: 'valid', expiry: '2025-11-30' },
        permit: { status: 'valid', expiry: '2026-01-15' },
        medical: { status: 'valid', expiry: '2025-09-05' }
      }
    },
    {
      id: 'driver-3',
      name: 'Vikram Patel',
      phone: '+91 76543 21098',
      email: 'vikram@luxfleet.com',
      license: 'GJ456789123',
      experience: '10 years',
      assignedVehicle: 'KA 05 EF 9012 - Force Traveller',
      status: 'inactive',
      location: 'Off Duty',
      rating: 4.9,
      totalTrips: 203,
      totalDistance: 32870,
      monthlyEarnings: 52400,
      scores: {
        safety: 9.5,
        acceleration: 9.2,
        braking: 9.4,
        speed: 9.3,
        idling: 9.1,
        efficiency: 9.6
      },
      badges: ['Safe Driver', 'Eco Warrior', 'Customer Favorite', 'Route Expert'],
      violations: 0,
      documents: {
        license: { status: 'valid', expiry: '2027-05-20' },
        permit: { status: 'valid', expiry: '2025-12-10' },
        medical: { status: 'valid', expiry: '2025-07-15' }
      }
    }
  ];

  const selectedDriverData = drivers.find(d => d.id === selectedDriver) || drivers[0];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'green';
    if (score >= 8) return 'yellow';
    if (score >= 7) return 'orange';
    return 'red';
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'valid': return { color: 'green', icon: CheckCircle };
      case 'expiring': return { color: 'yellow', icon: AlertTriangle };
      case 'expired': return { color: 'red', icon: AlertTriangle };
      default: return { color: 'gray', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4">Driver Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">42</div>
            <div className="text-sm text-blue-300">Total Drivers</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">38</div>
            <div className="text-sm text-green-300">Active Today</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">8.7</div>
            <div className="text-sm text-yellow-300">Avg Score</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">4.7</div>
            <div className="text-sm text-purple-300">Avg Rating</div>
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver List */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="#120F17"
          className="p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Driver Roster
          </h3>

          <div className="space-y-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver.id)}
                className={`cursor-pointer border rounded-lg p-4 transition-all hover:bg-white/10 ${selectedDriver === driver.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">{driver.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${driver.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                        <span>{driver.status}</span>
                        <span>•</span>
                        <span>{driver.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{driver.rating}</span>
                    </div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">{driver.totalTrips} trips</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="text-white ml-1">{driver.scores.safety}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Vehicle:</span>
                    <span className="text-white ml-1">{driver.assignedVehicle.split(' - ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Earnings:</span>
                    <span className="text-white ml-1">{formatIndianCurrency(driver.monthlyEarnings)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>

        {/* Driver Details */}
        <div className="space-y-6">
          {/* Profile Info */}
          <BorderGlow
            borderRadius={24}
            backgroundColor="#120F17"
            className="p-6 border-white/5 shadow-2xl h-full"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Driver Profile</h3>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">{selectedDriverData.name}</h4>
                <p className="text-gray-400">{selectedDriverData.experience} experience</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${selectedDriverData.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{selectedDriverData.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData.assignedVehicle}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData.location}</span>
              </div>
            </div>
          </BorderGlow>



        </div>
      </div>

      {/* Document Status */}
      <BorderGlow
        borderRadius={32}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl h-full"
      >
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Document Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Driving License', key: 'license' },
            { name: 'Commercial Permit', key: 'permit' },
            { name: 'Medical Certificate', key: 'medical' }
          ].map((doc, index) => {
            const docData = selectedDriverData.documents[doc.key as keyof typeof selectedDriverData.documents];
            const status = getDocumentStatus(docData.status);

            return (
              <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-black text-white uppercase tracking-tight">{doc.name}</h4>
                  <status.icon className={`w-5 h-5 text-${status.color}-400`} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`text-${status.color}-400 font-medium capitalize`}>
                      {docData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-gray-300">
                      {new Date(docData.expiry).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BorderGlow>
    </div>
  );
}
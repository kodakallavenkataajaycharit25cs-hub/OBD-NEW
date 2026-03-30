import React, { useState } from 'react';
import { 
  Car, 
  Thermometer, 
  Fuel, 
  Gauge, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function VehicleHealth() {
  const [selectedVehicle, setSelectedVehicle] = useState('MH-02-AB-1234');

  const vehicles = [
    {
      id: 'MH-02-AB-1234',
      model: 'Toyota Innova Crysta',
      driver: 'Suresh Singh',
      status: 'good',
      rpm: 2450,
      coolantTemp: 87,
      fuelEfficiency: 14.8,
      tyrePressure: { fl: 32, fr: 32, rl: 30, rr: 31 },
      engineCodes: [],
      lastService: '2024-12-15',
      nextService: '2025-03-15',
      mileage: 45680,
      location: 'En route to Pune'
    },
    {
      id: 'DL-01-CD-5678',
      model: 'Tempo Traveller',
      driver: 'Ramesh Sharma',
      status: 'warning',
      rpm: 2800,
      coolantTemp: 95,
      fuelEfficiency: 11.2,
      tyrePressure: { fl: 35, fr: 34, rl: 28, rr: 29 },
      engineCodes: ['P0128'],
      lastService: '2024-11-20',
      nextService: '2025-02-20',
      mileage: 67432,
      location: 'Mumbai Depot'
    },
    {
      id: 'KA-05-EF-9012',
      model: 'Force Traveller',
      driver: 'Vikram Patel',
      status: 'critical',
      rpm: 3200,
      coolantTemp: 103,
      fuelEfficiency: 9.8,
      tyrePressure: { fl: 30, fr: 32, rl: 25, rr: 26 },
      engineCodes: ['P0300', 'P0171'],
      lastService: '2024-10-05',
      nextService: '2025-01-05',
      mileage: 89123,
      location: 'Service Center'
    }
  ];

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle) || vehicles[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'green';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Settings;
    }
  };

  const obdMetrics = [
    {
      name: 'Engine RPM',
      value: selectedVehicleData.rpm,
      unit: 'RPM',
      status: selectedVehicleData.rpm > 3000 ? 'critical' : selectedVehicleData.rpm > 2500 ? 'warning' : 'good',
      icon: Gauge
    },
    {
      name: 'Coolant Temperature',
      value: selectedVehicleData.coolantTemp,
      unit: '°C',
      status: selectedVehicleData.coolantTemp > 100 ? 'critical' : selectedVehicleData.coolantTemp > 90 ? 'warning' : 'good',
      icon: Thermometer
    },
    {
      name: 'Fuel Efficiency',
      value: selectedVehicleData.fuelEfficiency,
      unit: 'km/l',
      status: selectedVehicleData.fuelEfficiency < 10 ? 'critical' : selectedVehicleData.fuelEfficiency < 12 ? 'warning' : 'good',
      icon: Fuel
    }
  ];

  const engineCodes = {
    'P0128': 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)',
    'P0300': 'Random/Multiple Cylinder Misfire Detected',
    'P0171': 'System Too Lean (Bank 1)'
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Selector */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Vehicle Health Monitoring</h2>
        <div className="flex flex-wrap gap-3">
          {vehicles.map((vehicle) => {
            const StatusIcon = getStatusIcon(vehicle.status);
            const statusColor = getStatusColor(vehicle.status);
            
            return (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  selectedVehicle === vehicle.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <StatusIcon className={`w-5 h-5 text-${statusColor}-400`} />
                <div className="text-left">
                  <div className="font-semibold text-white">{vehicle.id}</div>
                  <div className="text-xs text-gray-400">{vehicle.model}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vehicle Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* OBD Metrics */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2 text-blue-500" />
              Real-time OBD Data - {selectedVehicleData.id}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {obdMetrics.map((metric, index) => {
                const statusColor = getStatusColor(metric.status);
                
                return (
                  <div
                    key={index}
                    className={`bg-${statusColor}-500/20 border border-${statusColor}-500/50 rounded-lg p-4 text-center`}
                  >
                    <div className={`w-12 h-12 bg-${statusColor}-500/30 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <metric.icon className={`w-6 h-6 text-${statusColor}-400`} />
                    </div>
                    <div className={`text-2xl font-bold text-${statusColor}-400 mb-1`}>
                      {metric.value} {metric.unit}
                    </div>
                    <div className="text-sm text-gray-300">{metric.name}</div>
                  </div>
                );
              })}
            </div>

            {/* Tyre Pressure */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Tyre Pressure (PSI)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Front Left', value: selectedVehicleData.tyrePressure.fl, position: 'fl' },
                  { label: 'Front Right', value: selectedVehicleData.tyrePressure.fr, position: 'fr' },
                  { label: 'Rear Left', value: selectedVehicleData.tyrePressure.rl, position: 'rl' },
                  { label: 'Rear Right', value: selectedVehicleData.tyrePressure.rr, position: 'rr' }
                ].map((tyre, index) => {
                  const isLow = tyre.value < 30;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center ${
                        isLow ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'
                      }`}
                    >
                      <div className={`text-lg font-bold ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                        {tyre.value} PSI
                      </div>
                      <div className="text-xs text-gray-400">{tyre.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Engine Diagnostic Codes */}
          {selectedVehicleData.engineCodes.length > 0 && (
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Engine Diagnostic Codes
              </h3>
              <div className="space-y-3">
                {selectedVehicleData.engineCodes.map((code, index) => (
                  <div key={index} className="bg-red-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-red-400">{code}</span>
                      <span className="text-xs text-red-300">ACTIVE</span>
                    </div>
                    <p className="text-sm text-red-200">{engineCodes[code as keyof typeof engineCodes]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speed & Geofence Violations */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Recent Violations</h3>
            
            <div className="space-y-4">
              {[
                { type: 'Speed', location: 'Mumbai-Pune Highway', time: '2 hours ago', severity: 'high' },
                { type: 'Geofence', location: 'Unauthorized route deviation', time: '1 day ago', severity: 'medium' },
                { type: 'Idle', location: 'Extended idling at toll plaza', time: '2 days ago', severity: 'low' }
              ].map((violation, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      violation.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      violation.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {violation.type}
                    </span>
                    <span className="text-xs text-gray-400">{violation.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{violation.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Details Sidebar */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Vehicle Details</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 text-sm">Model</span>
                <p className="text-white font-semibold">{selectedVehicleData.model}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Driver</span>
                <p className="text-white font-semibold">{selectedVehicleData.driver}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Current Location</span>
                <p className="text-white font-semibold">{selectedVehicleData.location}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Mileage</span>
                <p className="text-white font-semibold">{selectedVehicleData.mileage.toLocaleString('en-IN')} km</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedVehicleData.status);
                    const statusColor = getStatusColor(selectedVehicleData.status);
                    
                    return (
                      <>
                        <StatusIcon className={`w-5 h-5 text-${statusColor}-400`} />
                        <span className={`text-${statusColor}-400 font-semibold capitalize`}>
                          {selectedVehicleData.status}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Info */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Maintenance Schedule</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 text-sm">Last Service</span>
                <p className="text-white font-semibold">
                  {new Date(selectedVehicleData.lastService).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Next Service Due</span>
                <p className="text-white font-semibold">
                  {new Date(selectedVehicleData.nextService).toLocaleDateString('en-IN')}
                </p>
              </div>
              
              <div className="mt-4">
                {new Date(selectedVehicleData.nextService) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <span className="text-yellow-400 text-sm font-medium">Service Due Soon</span>
                  </div>
                ) : (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <span className="text-green-400 text-sm font-medium">Service Up to Date</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Efficiency Trends */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Efficiency Trends</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Fuel Efficiency</span>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-semibold">-5.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engine Performance</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">+2.1%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Overall Health</span>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">-1.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
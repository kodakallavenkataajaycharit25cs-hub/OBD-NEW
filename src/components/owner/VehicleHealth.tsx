import React, { useState, useEffect } from 'react';
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
  TrendingDown,
  Activity
} from 'lucide-react';
import BorderGlow from '../BorderGlow';
import { fetchRPM, fetchSpeed, fetchFuelLevel, fetchDiagnostics, OBDData } from '../../services/obdApi';

export default function VehicleHealth() {
  const [selectedVehicle, setSelectedVehicle] = useState('MH-02-AB-1234');
  const [telemetry, setTelemetry] = useState<OBDData>({});

  useEffect(() => {
    // Only poll if the selected vehicle is the one we have OBD data for
    if (selectedVehicle === 'MH-02-AB-1234') {
      const updateTelemetry = async () => {
        try {
          const [rpmData, speedData, fuelData, diagData] = await Promise.all([
            fetchRPM(),
            fetchSpeed(),
            fetchFuelLevel(),
            fetchDiagnostics()
          ]);
          setTelemetry({
            rpm: rpmData.rpm,
            speed: speedData.speed,
            fuel_level: fuelData.fuel_level,
            diagnostics: diagData
          });
        } catch (error) {
          console.error('Failed to update telemetry:', error);
        }
      };

      updateTelemetry();
      const interval = setInterval(updateTelemetry, 10000);
      return () => clearInterval(interval);
    } else {
      setTelemetry({});
    }
  }, [selectedVehicle]);

  const vehicles = [
    {
      id: 'MH-02-AB-1234',
      model: 'Toyota Innova Crysta',
      driver: 'Suresh Singh',
      status: telemetry.diagnostics?.mil_status === 'ON' ? 'critical' : 'good',
      rpm: telemetry.rpm || 2450,
      coolantTemp: telemetry.diagnostics?.coolant_temp ? parseInt(telemetry.diagnostics.coolant_temp) : 87,
      fuelEfficiency: 14.8,
      tyrePressure: { fl: 32, fr: 32, rl: 30, rr: 31 },
      engineCodes: telemetry.diagnostics?.dtc || [],
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
      <BorderGlow
        borderRadius={28}
        backgroundColor="#120F17"
        glowRadius={40}
        glowIntensity={1}
        className="clay-card p-6 border-white/5 shadow-2xl"
      >
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4">Vehicle Health Monitoring</h2>
        <div className="flex flex-wrap gap-3">
          {vehicles.map((vehicle) => {
            const StatusIcon = getStatusIcon(vehicle.status);
            const statusColor = getStatusColor(vehicle.status);

            return (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${selectedVehicle === vehicle.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <StatusIcon className={`w-5 h-5 text-${statusColor}-400`} />
                <div className="text-left">
                  <div className="font-black text-white uppercase tracking-tight">{vehicle.id}</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">{vehicle.model}</div>
                </div>
              </button>
            );
          })}
        </div>
      </BorderGlow>

      {/* Selected Vehicle Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="clay-card p-6 border-white/5 shadow-2xl"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2 text-blue-500" />
              Real-time OBD Data - {selectedVehicleData.id}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {obdMetrics.map((metric, index) => {
                const statusColor = getStatusColor(metric.status);

                return (
                  <BorderGlow
                    key={index}
                    borderRadius={28}
                    glowRadius={40}
                    glowIntensity={1}
                    backgroundColor="#120F17"
                    className={`clay-card clay-card-hover group bg-${statusColor}-500/20 border border-${statusColor}-500/50 p-4 text-center transition-all h-full`}
                  >
                    <div className={`w-12 h-12 bg-${statusColor}-500/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                      <metric.icon className={`w-6 h-6 text-${statusColor}-400`} />
                    </div>
                    <div className={`text-2xl font-bold text-${statusColor}-400 mb-1 group-hover:text-${statusColor}-300 transition-colors`}>
                      {metric.value} {metric.unit}
                    </div>
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{metric.name}</div>
                  </BorderGlow>
                );
              })}
            </div>
          </BorderGlow>

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
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="clay-card p-6 border-white/5 shadow-2xl"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Recent Violations</h3>

            <div className="space-y-4">
              {[
                { type: 'Speed', location: 'Mumbai-Pune Highway', time: '2 hours ago', severity: 'high' },
                { type: 'Geofence', location: 'Unauthorized route deviation', time: '1 day ago', severity: 'medium' },
                { type: 'Idle', location: 'Extended idling at toll plaza', time: '2 days ago', severity: 'low' }
              ].map((violation, index) => (
                <div key={index} className="clay-card clay-card-hover p-4 bg-black/20 border-white/5 shadow-inner border-l-4 border-l-orange-500 group transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${violation.severity === 'high' ? 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30' :
                        violation.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30'
                      }`}>
                      {violation.type}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{violation.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{violation.location}</p>
                </div>
              ))}
            </div>
          </BorderGlow>
        </div>

        {/* Vehicle Details Sidebar */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="clay-card p-6 border-white/5 shadow-2xl"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4">Vehicle Details</h3>

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
          </BorderGlow>

          {/* Maintenance Info */}
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="clay-card p-6 border-white/5 shadow-2xl"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4">Maintenance Schedule</h3>

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
          </BorderGlow>

          {/* Efficiency Trends */}
          <BorderGlow
            borderRadius={28}
            backgroundColor="#120F17"
            glowRadius={40}
            glowIntensity={1}
            className="clay-card p-6 border-white/5 shadow-2xl"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4">Efficiency Trends</h3>

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
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}
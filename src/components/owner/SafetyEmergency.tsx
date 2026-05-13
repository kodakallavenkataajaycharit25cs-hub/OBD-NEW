import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Car,
  Activity,
  Zap,
  PhoneCall,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function SafetyEmergency() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const emergencyContacts = [
    { name: 'Emergency Helpline', number: '100', type: 'police' },
    { name: 'Medical Emergency', number: '108', type: 'medical' },
    { name: 'Fire Emergency', number: '101', type: 'fire' },
    { name: 'Fleet Manager', number: '+91 98765 43210', type: 'internal' }
  ];

  const recentIncidents = [
    {
      id: 'INC-2025-0089',
      type: 'SOS Alert',
      vehicle: 'MH 02 AB 1234',
      driver: 'Suresh Singh',
      timestamp: '2025-01-15 14:30:25',
      location: 'Mumbai-Pune Highway, KM 65',
      status: 'resolved',
      severity: 'high',
      description: 'Driver pressed SOS button due to vehicle breakdown',
      responseTime: '8 minutes',
      actions: ['Emergency services contacted', 'Backup vehicle dispatched', 'Driver safe']
    },
    {
      id: 'INC-2025-0088',
      type: 'Crash Detection',
      vehicle: 'DL 01 CD 5678',
      driver: 'Ramesh Sharma',
      timestamp: '2025-01-14 09:15:42',
      location: 'Delhi-Agra Highway, Near Faridabad',
      status: 'investigating',
      severity: 'critical',
      description: 'Sudden deceleration detected - possible collision',
      responseTime: '5 minutes',
      actions: ['Emergency services dispatched', 'Driver contacted', 'Under investigation']
    },
    {
      id: 'INC-2025-0087',
      type: 'Speed Violation',
      vehicle: 'KA 05 EF 9012',
      driver: 'Vikram Patel',
      timestamp: '2025-01-13 16:45:18',
      location: 'Bengaluru-Mysore Road',
      status: 'closed',
      severity: 'medium',
      description: 'Vehicle exceeded speed limit (85 km/h in 60 km/h zone)',
      responseTime: '2 minutes',
      actions: ['Driver warned', 'Speed coaching scheduled']
    }
  ];

  const liveAlerts = [
    {
      id: 'ALT-001',
      vehicle: 'TN 07 IJ 7890',
      driver: 'Arjun Kumar',
      type: 'Engine Temperature High',
      severity: 'high',
      location: 'Chennai-Pondicherry Highway',
      duration: '5 minutes ago'
    },
    {
      id: 'ALT-002',
      vehicle: 'RJ 14 KL 3456',
      driver: 'Ravi Gupta',
      type: 'Geofence Violation',
      severity: 'medium',
      location: 'Unauthorized Route Deviation',
      duration: '12 minutes ago'
    },
    {
      id: 'ALT-003',
      vehicle: 'UP 16 MN 5678',
      driver: 'Deepak Singh',
      type: 'Extended Idling',
      severity: 'low',
      location: 'Delhi Toll Plaza',
      duration: '25 minutes ago'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'green';
      case 'investigating': return 'yellow';
      case 'active': return 'red';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const selectedIncidentData = recentIncidents.find(i => i.id === selectedIncident);

  return (
    <div className="space-y-4">
      {/* Header with Emergency Stats */}
      <BorderGlow
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        backgroundColor="#120F17"
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/50 p-6"
      >
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-red-400" />
          Safety & Emergency Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-500/30 border border-red-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-sm text-red-300">Active Alerts</div>
          </div>
          <div className="bg-green-500/30 border border-green-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">98.7%</div>
            <div className="text-sm text-green-300">Safety Score</div>
          </div>
          <div className="bg-blue-500/30 border border-blue-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">4.2 min</div>
            <div className="text-sm text-blue-300">Avg Response Time</div>
          </div>
          <div className="bg-yellow-500/30 border border-yellow-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">15</div>
            <div className="text-sm text-yellow-300">Incidents This Month</div>
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Alerts */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          backgroundColor="#120F17"
          className="clay-card p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
            Live Alerts
          </h3>

          <div className="space-y-4">
            {liveAlerts.map((alert) => {
              const severityColor = getSeverityColor(alert.severity);

              return (
                <div
                  key={alert.id}
                  className={`bg-${severityColor}-500/20 border border-${severityColor}-500/50 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Activity className={`w-5 h-5 text-${severityColor}-400`} />
                      <div>
                        <h4 className="font-black text-white uppercase tracking-tight">{alert.type}</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">{alert.vehicle} - {alert.driver}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severityColor}-500/30 text-${severityColor}-300 uppercase`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{alert.duration}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                      Investigate
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </BorderGlow>

        {/* Recent Incidents */}
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          backgroundColor="#120F17"
          className="clay-card p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-500" />
            Recent Safety Incidents
          </h3>

          <div className="space-y-4">
            {recentIncidents.map((incident) => {
              const severityColor = getSeverityColor(incident.severity);
              const statusColor = getStatusColor(incident.status);

              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident.id)}
                  className={`cursor-pointer border rounded-2xl p-6 transition-all hover:bg-white/10 ${selectedIncident === incident.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5'
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight text-sm leading-none">{incident.type}</h4>
                      <p className="text-xs uppercase font-black tracking-widest text-gray-500 mt-2 font-bold">{incident.id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black bg-${severityColor}-500/30 text-${severityColor}-300 uppercase tracking-widest`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-widest leading-none">
                    <div className="truncate flex items-center">
                      <span className="text-gray-600">Veh:</span>
                      <span className="text-white ml-2">{incident.vehicle}</span>
                    </div>
                    <div className="truncate flex items-center">
                      <span className="text-gray-600">Dr:</span>
                      <span className="text-white ml-2">{incident.driver}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BorderGlow>
      </div>

      {/* Incident Details Section (Conditional) */}
      {selectedIncidentData && (
        <BorderGlow
          borderRadius={28}
          glowRadius={40}
          glowIntensity={1}
          backgroundColor="#120F17"
          className="clay-card p-6 border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4"
        >
          <h4 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Incident Dossier: {selectedIncidentData.id}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phenomenon Type</span>
                <p className="text-white font-black text-lg uppercase tracking-tight">{selectedIncidentData.type}</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Chronological Timestamp</span>
                <p className="text-white font-bold">{new Date(selectedIncidentData.timestamp).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex space-x-3 pt-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">View Analytics</button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Export Report</button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Geospatial Vector</span>
                <div className="flex items-center space-x-3 mt-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold">{selectedIncidentData.location}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Situation Narrative</span>
                <p className="text-gray-300 text-sm leading-relaxed mt-2 italic">"{selectedIncidentData.description}"</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Countermeasures Deployed</span>
              <ul className="space-y-3">
                {selectedIncidentData.actions.map((action, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white text-xs font-bold uppercase tracking-tight">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BorderGlow>
      )}


    </div>
  );
}
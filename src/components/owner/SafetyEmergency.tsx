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
    <div className="space-y-6">
      {/* Header with Emergency Stats */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Alerts */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
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
                        <h4 className="font-semibold text-white">{alert.type}</h4>
                        <p className="text-sm text-gray-400">{alert.vehicle} - {alert.driver}</p>
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
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Phone className="w-6 h-6 mr-2 text-green-500" />
            Emergency Contacts
          </h3>

          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => {
              const getContactColor = (type: string) => {
                switch (type) {
                  case 'police': return 'blue';
                  case 'medical': return 'red';
                  case 'fire': return 'orange';
                  case 'internal': return 'purple';
                  default: return 'gray';
                }
              };

              const color = getContactColor(contact.type);
              
              return (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${color}-500/20 rounded-full flex items-center justify-center`}>
                      <PhoneCall className={`w-6 h-6 text-${color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{contact.name}</h4>
                      <p className="text-gray-400">{contact.number}</p>
                    </div>
                  </div>
                  <button className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-lg transition-colors`}>
                    Call
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <h4 className="font-semibold text-red-400 mb-2">Emergency Protocol</h4>
            <ol className="text-sm text-red-200 space-y-1">
              <li>1. Assess situation severity</li>
              <li>2. Contact emergency services if needed</li>
              <li>3. Notify fleet manager</li>
              <li>4. Dispatch backup support</li>
              <li>5. Document incident</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-500" />
          Recent Safety Incidents
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incidents List */}
          <div className="space-y-4">
            {recentIncidents.map((incident) => {
              const severityColor = getSeverityColor(incident.severity);
              const statusColor = getStatusColor(incident.status);
              
              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident.id)}
                  className={`cursor-pointer border rounded-lg p-4 transition-all hover:bg-white/10 ${
                    selectedIncident === incident.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{incident.type}</h4>
                      <p className="text-sm text-gray-400">{incident.id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severityColor}-500/30 text-${severityColor}-300`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Vehicle:</span>
                      <span className="text-white ml-1">{incident.vehicle}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Driver:</span>
                      <span className="text-white ml-1">{incident.driver}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-1">
                        {new Date(incident.timestamp).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Response:</span>
                      <span className="text-white ml-1">{incident.responseTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Incident Details */}
          {selectedIncidentData && (
            <div className="bg-white/5 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">Incident Details</h4>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Incident ID</span>
                  <p className="text-white font-semibold">{selectedIncidentData.id}</p>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Description</span>
                  <p className="text-white">{selectedIncidentData.description}</p>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Location</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{selectedIncidentData.location}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Timestamp</span>
                  <p className="text-white">
                    {new Date(selectedIncidentData.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Actions Taken</span>
                  <ul className="mt-2 space-y-1">
                    {selectedIncidentData.actions.map((action, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>View Timeline</span>
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Crash Detection Settings */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Crash Detection & SOS Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Detection Sensitivity</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sudden Deceleration Threshold</span>
                <span className="text-white font-semibold">-8 m/s²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Impact Force Threshold</span>
                <span className="text-white font-semibold">12 G-force</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">SOS Response Time</span>
                <span className="text-white font-semibold">30 seconds</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Escalation Rules</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-gray-300">Immediate driver contact</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-gray-300">Fleet manager notification (if no response)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-gray-300">Emergency services (100/108)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <span className="text-gray-300">GPS location shared with responders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
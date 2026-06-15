import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  User,
  Truck,
  BarChart3,
  Plus,
  Filter,
  X
} from 'lucide-react';
import BorderGlow from '../BorderGlow';
import { formatDate } from '../../utils/dateFormat';
import { useAuth } from '../../contexts/AuthContext';
import { fetchDevices, fetchOwners } from '../../services/obdApi';

export default function Maintenance() {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'schedule' | 'analytics'>('schedule');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<Record<string, boolean>>({});

  // Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [formVehicle, setFormVehicle] = useState('');
  const [customVehicle, setCustomVehicle] = useState('');
  const [formType, setFormType] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formPriority, setFormPriority] = useState('medium');
  const [formCost, setFormCost] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Fetch Owner's Vehicles
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const [owners, devices] = await Promise.all([
          fetchOwners(),
          fetchDevices()
        ]);
        const currentOwner = owners.find(
          (o: any) => o.email?.toLowerCase() === user?.email?.toLowerCase()
        );
        let myDevices = [];
        if (currentOwner) {
          myDevices = devices.filter(
            (d: any) =>
              d.ownerId === currentOwner.id ||
              d.owner_id === currentOwner.id ||
              (d.owner && d.owner.toLowerCase() === currentOwner.name?.toLowerCase())
          );
        }
        if (myDevices.length === 0) {
          // Fallback to all devices if filtered is empty
          setVehicles(devices.length > 0 ? devices : [
            { id: 'v1', vehicle_number: 'MH-AB-273B', vehicle_model: 'BMW M4' },
            { id: 'v2', vehicle_number: 'MH-02-XY-9876', vehicle_model: 'Tata Ace' },
            { id: 'v3', vehicle_number: 'KA-05-EF-9012', vehicle_model: 'Mahindra Bolero' }
          ]);
        } else {
          setVehicles(myDevices);
        }
      } catch (err) {
        console.error('Failed to load vehicles for maintenance', err);
        setVehicles([
          { id: 'v1', vehicle_number: 'MH-AB-273B', vehicle_model: 'BMW M4' },
          { id: 'v2', vehicle_number: 'MH-02-XY-9876', vehicle_model: 'Tata Ace' },
          { id: 'v3', vehicle_number: 'KA-05-EF-9012', vehicle_model: 'Mahindra Bolero' }
        ]);
      }
    };
    loadVehicles();
  }, [user]);

  // Load from LocalStorage
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<any[]>(() => {
    const stored = localStorage.getItem('upcoming_maintenance');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    // Default mock data
    return [
      {
        id: 'm1',
        vehicle: 'MH-AB-273B',
        model: 'BMW M4',
        priority: 'high',
        type: 'Engine Diagnostics & Tuning',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: 12500,
        description: 'Scheduled engine diagnostics, ECU tuning, and spark plug replacement.'
      },
      {
        id: 'm2',
        vehicle: 'MH-02-XY-9876',
        model: 'Tata Ace',
        priority: 'medium',
        type: 'Brake System Overhaul',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: 4500,
        description: 'Replacing front brake pads, checking rear drums, and flushing brake fluid.'
      }
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('upcoming_maintenance', JSON.stringify(upcomingMaintenance));
  }, [upcomingMaintenance]);

  const formatIndianCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')} cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} lacs`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')} K`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maintenanceMetrics = [
    { title: 'Monthly Cost', value: formatIndianCurrency(upcomingMaintenance.filter(m => !scheduledJobs[m.id]).reduce((sum, m) => sum + (Number(m.estimatedCost) || 0), 0)), change: '+4.2%' },
    { title: 'Scheduled Jobs', value: upcomingMaintenance.filter(m => !scheduledJobs[m.id]).length.toString(), change: '+1' },
    { title: 'Critical Items', value: upcomingMaintenance.filter(m => !scheduledJobs[m.id] && (m.priority === 'critical' || m.priority === 'high')).length.toString(), change: 'Live' },
    { title: 'Predicted ROI', value: '1.8x', change: '+0.2%' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVehicle || !formType || !formDate) return;

    const newJob = {
      id: `m_${Date.now()}`,
      vehicle: formVehicle,
      model: customVehicle || 'Unknown Model',
      priority: formPriority,
      type: formType,
      dueDate: formDate,
      estimatedCost: Number(formCost) || 0,
      description: formDescription
    };

    setUpcomingMaintenance(prev => [newJob, ...prev]);
    setShowScheduleModal(false);

    // Reset Form
    setFormVehicle('');
    setCustomVehicle('');
    setFormType('');
    setFormDate('');
    setFormPriority('medium');
    setFormCost('');
    setFormDescription('');
  };

  const ScheduleView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Maintenance Schedule</h3>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcomingMaintenance.filter((maintenance) => !scheduledJobs[maintenance.id]).map((maintenance) => {
          const priorityColor = getPriorityColor(maintenance.priority);
          const daysUntilDue = Math.ceil((new Date(maintenance.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <BorderGlow
              key={maintenance.id}
              borderRadius={16}
              glowRadius={30}
              backgroundColor={`#18181b`}
              className={`clay-card p-6 border border-${priorityColor}-500/50 h-full`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-sans font-black text-white uppercase tracking-tight">{maintenance.vehicle}</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">{maintenance.model}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${priorityColor}-500/30 text-${priorityColor}-300 uppercase`}>
                  {maintenance.priority}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Wrench className={`w-4 h-4 text-${priorityColor}-400`} />
                  <span className="text-white font-medium">{maintenance.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Due: {formatDate(maintenance.dueDate)}</span>
                  <span className={`ml-2 text-sm ${daysUntilDue <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                    ({daysUntilDue} days)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Est. Cost: {formatIndianCurrency(maintenance.estimatedCost)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4">{maintenance.description}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setScheduledJobs(prev => ({ ...prev, [maintenance.id]: true }))}
                  disabled={scheduledJobs[maintenance.id]}
                  className={`flex-1 ${scheduledJobs[maintenance.id] ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg font-medium transition-colors`}
                >
                  {scheduledJobs[maintenance.id] ? 'Completed ✓' : 'Complete'}
                </button>
                <button
                  onClick={() => alert(`Details:\n\nVehicle: ${maintenance.vehicle}\nType: ${maintenance.type}\nDate: ${maintenance.dueDate}\nPriority: ${maintenance.priority}\nCost: ₹${maintenance.estimatedCost}\nDescription: ${maintenance.description}`)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </BorderGlow>
          );
        })}
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Predictive Maintenance Insights</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {upcomingMaintenance.filter(m => !scheduledJobs[m.id]).length}
            </div>
            <div className="text-sm text-blue-300">Vehicles Due Soon</div>
          </div>
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {upcomingMaintenance.filter(m => !scheduledJobs[m.id] && (m.priority === 'critical' || m.priority === 'high')).length}
            </div>
            <div className="text-sm text-orange-300">Anomalies Detected</div>
          </div>
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {formatIndianCurrency(upcomingMaintenance.filter(m => !scheduledJobs[m.id]).reduce((sum, m) => sum + (Number(m.estimatedCost) || 0), 0) * 0.15)}
            </div>
            <div className="text-sm text-green-300">Cost Savings (Predicted)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Maintenance Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {maintenanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <div className="text-lg font-black tracking-tight uppercase text-white mb-1">{metric.value}</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">{metric.title}</div>
            <div className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg p-6">
        <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Maintenance ROI Analysis</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {formatIndianCurrency(upcomingMaintenance.reduce((sum, m) => sum + (Number(m.estimatedCost) || 0), 0) * 0.25)}
            </div>
            <div className="text-sm text-green-300">Preventive Maintenance Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">35%</div>
            <div className="text-sm text-blue-300">Reduction in Breakdowns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">1.8x</div>
            <div className="text-sm text-purple-300">Return on Investment</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <Wrench className="w-8 h-8 mr-3 text-orange-500" />
          Maintenance Lifecycle Management
        </h2>

        <div className="flex space-x-4">
          {[
            { key: 'schedule', label: 'Schedule', icon: Calendar },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedView(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </BorderGlow>

      {selectedView === 'schedule' && <ScheduleView />}
      {selectedView === 'analytics' && <AnalyticsView />}

      {/* Schedule Service Modal Form */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-lg">
            <BorderGlow
              borderRadius={24}
              backgroundColor="#120F17"
              className="p-8 border border-white/10 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-500" />
                Schedule Fleet Service
              </h3>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Car Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH-AB-273B"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Car Name (Model)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BMW M4"
                      value={customVehicle}
                      onChange={(e) => setCustomVehicle(e.target.value)}
                      className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Service Details (Type)</label>
                  <input
                    type="text"
                    required
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    placeholder="e.g. Engine Oil Change, Brake Inspection"
                    className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Service Date</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="low" className="bg-[#120F17]">Low</option>
                      <option value="medium" className="bg-[#120F17]">Medium</option>
                      <option value="high" className="bg-[#120F17]">High</option>
                      <option value="critical" className="bg-[#120F17]">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Estimated Cost (₹)</label>
                    <input
                      type="number"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Details of the service job..."
                    rows={3}
                    className="w-full bg-[#120F17] border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Schedule Service Job
                </button>
              </form>
            </BorderGlow>
          </div>
        </div>
      )}
    </div>
  );
}
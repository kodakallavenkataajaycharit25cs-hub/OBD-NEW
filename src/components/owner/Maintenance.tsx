import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function Maintenance() {
  const [selectedView, setSelectedView] = useState<'schedule' | 'jobs' | 'analytics'>('schedule');
  const [activeJobsFilter, setActiveJobsFilter] = useState<'progress' | 'cost' | 'startDate'>('startDate');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const upcomingMaintenance = [
    {
      id: 'MAINT-001',
      vehicle: 'MH 02 AB 1234',
      model: 'Toyota Innova Crysta',
      type: 'Scheduled Service',
      dueDate: '2025-01-20',
      mileage: 45680,
      nextServiceMileage: 50000,
      priority: 'high',
      estimatedCost: 8500,
      description: 'Oil change, filter replacement, brake inspection'
    },
    {
      id: 'MAINT-002',
      vehicle: 'DL 01 CD 5678',
      model: 'Tempo Traveller',
      type: 'Predictive',
      dueDate: '2025-01-18',
      mileage: 67432,
      nextServiceMileage: 70000,
      priority: 'critical',
      estimatedCost: 15200,
      description: 'Coolant system repair - high temperature detected'
    },
    {
      id: 'MAINT-003',
      vehicle: 'KA 05 EF 9012',
      model: 'Force Traveller',
      type: 'Breakdown',
      dueDate: '2025-01-16',
      mileage: 89123,
      nextServiceMileage: 90000,
      priority: 'critical',
      estimatedCost: 22800,
      description: 'Engine diagnostic codes P0300, P0171 - immediate attention required'
    }
  ];

  const activeJobs = [
    {
      id: 'JOB-2025-0045',
      vehicle: 'RJ 14 KL 3456',
      vendor: 'Mumbai Auto Service Center',
      technician: 'Ramesh Mechanic',
      startDate: '2025-01-15',
      estimatedCompletion: '2025-01-17',
      status: 'in-progress',
      type: 'Scheduled Service',
      cost: 12400,
      progress: 65,
      tasks: [
        { name: 'Oil & Filter Change', status: 'completed' },
        { name: 'Brake Inspection', status: 'completed' },
        { name: 'Transmission Check', status: 'in-progress' },
        { name: 'AC Service', status: 'pending' }
      ]
    },
    {
      id: 'JOB-2025-0044',
      vehicle: 'TN 07 IJ 7890',
      vendor: 'Chennai Motors',
      technician: 'Kumar Technician',
      startDate: '2025-01-14',
      estimatedCompletion: '2025-01-16',
      status: 'delayed',
      type: 'Repair',
      cost: 18600,
      progress: 40,
      tasks: [
        { name: 'Engine Diagnosis', status: 'completed' },
        { name: 'Parts Procurement', status: 'in-progress' },
        { name: 'Repair Work', status: 'pending' },
        { name: 'Testing', status: 'pending' }
      ]
    }
  ];

  const vendors = [
    { name: 'Mumbai Auto Service Center', rating: 4.8, jobs: 23, avgCost: 11200 },
    { name: 'Delhi Motor Works', rating: 4.6, jobs: 18, avgCost: 13500 },
    { name: 'Bengaluru Car Care', rating: 4.9, jobs: 31, avgCost: 9800 },
    { name: 'Chennai Motors', rating: 4.5, jobs: 15, avgCost: 12800 }
  ];

  const maintenanceMetrics = [
    { title: 'Monthly Cost', value: formatIndianCurrency(148600), change: '-8.5%' },
    { title: 'Avg Downtime', value: '2.3 days', change: '-12%' },
    { title: 'Cost per KM', value: '₹4.20', change: '-5.2%' },
    { title: 'ROI', value: '3.2x', change: '+15%' }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'delayed': return 'red';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };

  const filteredJobs = [...activeJobs].sort((a, b) => {
    if (activeJobsFilter === 'progress') return b.progress - a.progress;
    if (activeJobsFilter === 'cost') return b.cost - a.cost;
    if (activeJobsFilter === 'startDate') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    return 0;
  });

  const ScheduleView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Maintenance Schedule</h3>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Schedule Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcomingMaintenance.map((maintenance) => {
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
                  <h4 className="font-black text-white uppercase tracking-tight">{maintenance.vehicle}</h4>
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
                  <span className="text-gray-300">Due: {new Date(maintenance.dueDate).toLocaleDateString('en-IN')}</span>
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
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Schedule Now
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors">
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
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">7</div>
            <div className="text-sm text-blue-300">Vehicles Due Soon</div>
          </div>
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">3</div>
            <div className="text-sm text-orange-300">Anomalies Detected</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">₹2.4L</div>
            <div className="text-sm text-green-300">Cost Savings (Predicted)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const JobsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Active Maintenance Jobs</h3>
        <div className="flex space-x-3 relative">
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${showFilterMenu ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>{activeJobsFilter === 'startDate' ? 'Started Date' : activeJobsFilter.charAt(0).toUpperCase() + activeJobsFilter.slice(1)}</span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#120F17] border-white/10 shadow-2xl z-50 p-2 space-y-1">
                {[
                  { key: 'progress', label: 'Progress' },
                  { key: 'cost', label: 'Cost' },
                  { key: 'startDate', label: 'Started Date' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setActiveJobsFilter(option.key as any);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeJobsFilter === option.key
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-500 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white">
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredJobs.map((job) => {
          const statusColor = getStatusColor(job.status);

          return (
            <BorderGlow
              key={job.id}
              borderRadius={24}
              backgroundColor="#120F17"
              className="p-6 border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black tracking-tight uppercase text-white">{job.id}</h4>
                  <p className="text-gray-400">{job.vehicle} - {job.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Vendor: {job.vendor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Technician: {job.technician}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Started: {new Date(job.startDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Due: {new Date(job.estimatedCompletion).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white font-semibold">{job.progress}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-${statusColor}-500 h-2 rounded-full`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cost</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(job.cost)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-white uppercase tracking-tight">Task Progress</h5>
                {job.tasks.map((task, index) => {
                  const taskStatusColor = getStatusColor(task.status);
                  const TaskIcon = task.status === 'completed' ? CheckCircle :
                    task.status === 'in-progress' ? Clock : Wrench;

                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <TaskIcon className={`w-5 h-5 text-${taskStatusColor}-400`} />
                      <span className="text-gray-300 flex-1">{task.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${taskStatusColor}-500/30 text-${taskStatusColor}-300`}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </BorderGlow>
          );
        })}
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
            <div className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Vendor Performance</h4>

          <div className="space-y-4">
            {vendors.map((vendor, index) => (
              <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-black text-white uppercase tracking-tight">{vendor.name}</h5>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                        >★</div>
                      ))}
                    </div>
                    <span className="text-white text-sm">{vendor.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Jobs:</span>
                    <span className="text-white ml-1">{vendor.jobs}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Avg Cost:</span>
                    <span className="text-white ml-1">{formatIndianCurrency(vendor.avgCost)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Cost Breakdown</h4>

          <div className="space-y-4">
            {[
              { category: 'Labor Cost', amount: 84600, percentage: 57 },
              { category: 'Parts & Components', amount: 42800, percentage: 29 },
              { category: 'Consumables', amount: 15400, percentage: 10 },
              { category: 'External Services', amount: 5800, percentage: 4 }
            ].map((cost, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{cost.category}</span>
                  <span className="text-white font-semibold">{formatIndianCurrency(cost.amount)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${cost.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm">{cost.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg p-6">
        <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Maintenance ROI Analysis</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">₹5.2L</div>
            <div className="text-sm text-green-300">Preventive Maintenance Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">42%</div>
            <div className="text-sm text-blue-300">Reduction in Breakdowns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">3.2x</div>
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
            { key: 'jobs', label: 'Active Jobs', icon: Truck },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedView(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedView === tab.key
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
      {selectedView === 'jobs' && <JobsView />}
      {selectedView === 'analytics' && <AnalyticsView />}
    </div>
  );
}
import React from 'react';
import { 
  TrendingUp, 
  Car, 
  Users, 
  AlertTriangle, 
  DollarSign,
  MapPin,
  Fuel,
  Clock
} from 'lucide-react';

export default function FleetOverview() {
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const kpiData = [
    { 
      title: 'Total Fleet Revenue', 
      value: formatIndianCurrency(2847600), 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'green' 
    },
    { 
      title: 'Active Vehicles', 
      value: '34/38', 
      change: '+2', 
      icon: Car, 
      color: 'blue' 
    },
    { 
      title: 'Total Drivers', 
      value: '42', 
      change: '+3', 
      icon: Users, 
      color: 'purple' 
    },
    { 
      title: 'Active Alerts', 
      value: '7', 
      change: '-2', 
      icon: AlertTriangle, 
      color: 'red' 
    }
  ];

  const topRoutes = [
    { route: 'Mumbai → Pune', trips: 47, profit: 142800, margin: '23.4%' },
    { route: 'Delhi → Agra', trips: 32, profit: 98600, margin: '21.8%' },
    { route: 'Bengaluru → Coorg', trips: 28, profit: 87400, margin: '19.6%' },
    { route: 'Mumbai → Goa', trips: 24, profit: 156000, margin: '28.7%' },
    { route: 'Chennai → Pondicherry', trips: 19, profit: 54200, margin: '18.9%' }
  ];

  const topDrivers = [
    { name: 'Suresh Singh', score: 9.2, trips: 34, earnings: 48600 },
    { name: 'Ramesh Sharma', score: 9.0, trips: 31, earnings: 44200 },
    { name: 'Vikram Patel', score: 8.8, trips: 29, earnings: 42800 },
    { name: 'Arjun Kumar', score: 8.6, trips: 27, earnings: 39400 },
    { name: 'Ravi Gupta', score: 8.4, trips: 25, earnings: 36800 }
  ];

  const recentAlerts = [
    { type: 'Maintenance', message: 'MH 02 AB 1234 due for service', time: '2 hours ago', severity: 'medium' },
    { type: 'Fuel', message: 'DL 01 CD 5678 - Low fuel efficiency detected', time: '4 hours ago', severity: 'high' },
    { type: 'Speed', message: 'GJ 03 EF 9012 exceeded speed limit', time: '6 hours ago', severity: 'high' },
    { type: 'Route', message: 'KA 05 GH 3456 deviated from planned route', time: '8 hours ago', severity: 'low' },
    { type: 'Health', message: 'TN 07 IJ 7890 engine temperature high', time: '12 hours ago', severity: 'high' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${kpi.color}-500/20 rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} />
              </div>
              <span className={`text-sm font-medium ${
                kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
            <p className="text-gray-400 text-sm">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Profitability */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-500" />
            Top Profitable Routes
          </h3>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{route.route}</h4>
                  <span className="text-green-400 font-bold">{route.margin}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{route.trips} trips</span>
                  <span>{formatIndianCurrency(route.profit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Leaderboard */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-500" />
            Driver Leaderboard
          </h3>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{driver.name}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{driver.trips} trips</span>
                        <span>Score: {driver.score}/10</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold">
                    {formatIndianCurrency(driver.earnings)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Health Summary */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Car className="w-6 h-6 mr-2 text-blue-500" />
            Fleet Health Overview
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">28</div>
              <div className="text-sm text-green-300">Excellent</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">6</div>
              <div className="text-sm text-yellow-300">Needs Attention</div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">3</div>
              <div className="text-sm text-orange-300">Maintenance Due</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">1</div>
              <div className="text-sm text-red-300">Critical</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average Fuel Efficiency</span>
              <span className="text-white font-semibold">14.2 km/l</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Fleet Utilization</span>
              <span className="text-white font-semibold">89.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average Trip Distance</span>
              <span className="text-white font-semibold">167 km</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
            Recent Alerts
          </h3>
          
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-300">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City Performance Heatmap */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">City Performance Heatmap</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { city: 'Mumbai', trips: 89, revenue: 284600, growth: '+15%' },
            { city: 'Delhi', trips: 76, revenue: 245800, growth: '+8%' },
            { city: 'Bengaluru', trips: 64, revenue: 198400, growth: '+22%' },
            { city: 'Chennai', trips: 52, revenue: 164200, growth: '+11%' },
            { city: 'Hyderabad', trips: 43, revenue: 135700, growth: '+18%' },
            { city: 'Pune', trips: 38, revenue: 118900, growth: '+14%' }
          ].map((city, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-white mb-2">{city.city}</h4>
              <div className="text-lg font-bold text-blue-400 mb-1">
                {formatIndianCurrency(city.revenue)}
              </div>
              <div className="text-sm text-gray-400 mb-2">{city.trips} trips</div>
              <div className="text-xs text-green-400">{city.growth}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
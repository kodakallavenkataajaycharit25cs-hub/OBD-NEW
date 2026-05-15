import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  MapPin, 
  Fuel, 
  Users,
  Route,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const mlInsights = [
    {
      title: 'Route Optimization',
      description: 'AI-recommended route changes could save ₹45,600/month',
      impact: 'High',
      savings: 45600,
      icon: Route,
      color: 'blue'
    },
    {
      title: 'Fuel Anomaly Detection',
      description: '3 vehicles showing unusual fuel consumption patterns',
      impact: 'Medium',
      savings: 23400,
      icon: Fuel,
      color: 'red'
    },
    {
      title: 'Driver Performance Optimization',
      description: 'Personalized coaching could improve efficiency by 12%',
      impact: 'High',
      savings: 34800,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Predictive Maintenance',
      description: '2 vehicles likely to need service within 7 days',
      impact: 'Critical',
      savings: 18200,
      icon: AlertTriangle,
      color: 'yellow'
    }
  ];

  const demandForecast = [
    { route: 'Mumbai → Pune', currentDemand: 78, forecastedDemand: 92, change: '+18%' },
    { route: 'Delhi → Agra', currentDemand: 65, forecastedDemand: 71, change: '+9%' },
    { route: 'Bengaluru → Coorg', currentDemand: 54, forecastedDemand: 48, change: '-11%' },
    { route: 'Chennai → Pondicherry', currentDemand: 43, forecastedDemand: 56, change: '+30%' }
  ];

  const hotspotData = [
    { city: 'Mumbai', bookings: 234, revenue: 567800, growth: '+15%', lat: 19.0760, lng: 72.8777 },
    { city: 'Delhi', bookings: 187, revenue: 445600, growth: '+8%', lat: 28.7041, lng: 77.1025 },
    { city: 'Bengaluru', bookings: 156, revenue: 387400, growth: '+22%', lat: 12.9716, lng: 77.5946 },
    { city: 'Chennai', bookings: 134, revenue: 289200, growth: '+11%', lat: 13.0827, lng: 80.2707 },
    { city: 'Hyderabad', bookings: 98, revenue: 234500, growth: '+18%', lat: 17.3850, lng: 78.4867 },
    { city: 'Pune', bookings: 89, revenue: 198700, growth: '+14%', lat: 18.5204, lng: 73.8567 }
  ];

  const vehiclePerformanceData = [
    {
      vehicle: 'MH 02 AB 1234',
      model: 'Toyota Innova Crysta',
      performance: 8.7,
      efficiency: 14.2,
      utilization: 89,
      resaleValue: 12.8,
      trend: 'improving'
    },
    {
      vehicle: 'DL 01 CD 5678',
      model: 'Tempo Traveller',
      performance: 7.4,
      efficiency: 11.8,
      utilization: 76,
      resaleValue: 9.2,
      trend: 'declining'
    },
    {
      vehicle: 'KA 05 EF 9012',
      model: 'Force Traveller',
      performance: 6.8,
      efficiency: 10.4,
      utilization: 68,
      resaleValue: 7.8,
      trend: 'stable'
    }
  ];

  const driverClusters = [
    {
      cluster: 'Elite Performers',
      count: 8,
      avgScore: 9.2,
      characteristics: ['Excellent safety', 'High efficiency', 'Customer satisfaction'],
      color: 'green'
    },
    {
      cluster: 'Solid Operators',
      count: 24,
      avgScore: 7.8,
      characteristics: ['Good performance', 'Reliable', 'Room for improvement'],
      color: 'blue'
    },
    {
      cluster: 'Development Needed',
      count: 6,
      avgScore: 6.4,
      characteristics: ['Safety concerns', 'Training required', 'Coaching priority'],
      color: 'orange'
    },
    {
      cluster: 'At Risk',
      count: 4,
      avgScore: 5.2,
      characteristics: ['Multiple violations', 'Low efficiency', 'Immediate action needed'],
      color: 'red'
    }
  ];

  const anomalies = [
    {
      id: 'ANOM-001',
      type: 'Fuel Theft Suspected',
      vehicle: 'RJ 14 KL 3456',
      detected: '2025-01-15 14:30',
      confidence: 87,
      description: 'Fuel level dropped 15L without corresponding mileage',
      severity: 'high'
    },
    {
      id: 'ANOM-002',
      type: 'Route Deviation Pattern',
      vehicle: 'UP 16 MN 7890',
      detected: '2025-01-15 09:20',
      confidence: 92,
      description: 'Consistent unauthorized route deviations detected',
      severity: 'medium'
    },
    {
      id: 'ANOM-003',
      type: 'Extended Idle Time',
      vehicle: 'MP 09 PQ 2345',
      detected: '2025-01-14 16:45',
      confidence: 78,
      description: 'Vehicle idle for 3+ hours during trip',
      severity: 'low'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'yellow';
      case 'Low': return 'blue';
      default: return 'gray';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'green';
      case 'declining': return 'red';
      case 'stable': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BorderGlow
        borderRadius={32}
        backgroundColor="#120F17"
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            Analytics & Machine Learning Insights
          </h2>

          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d" className="bg-black/20 shadow-inner">Last 7 Days</option>
              <option value="30d" className="bg-black/20 shadow-inner">Last 30 Days</option>
              <option value="90d" className="bg-black/20 shadow-inner">Last 3 Months</option>
              <option value="1y" className="bg-black/20 shadow-inner">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">₹1.2L</div>
            <div className="text-sm text-purple-300">ML-Driven Savings</div>
          </div>
          <div className="bg-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">94%</div>
            <div className="text-sm text-blue-300">Prediction Accuracy</div>
          </div>
          <div className="bg-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">7</div>
            <div className="text-sm text-green-300">Anomalies Detected</div>
          </div>
          <div className="bg-yellow-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">18%</div>
            <div className="text-sm text-yellow-300">Efficiency Improvement</div>
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Insights */}
        <BorderGlow
          borderRadius={32}
          backgroundColor="#120F17"
          className="p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            AI-Powered Insights
          </h3>

          <div className="space-y-4">
            {mlInsights.map((insight, index) => {
              const impactColor = getImpactColor(insight.impact);
              const colorMaps: Record<string, string> = {
                blue: 'bg-blue-600 hover:bg-blue-700',
                red: 'bg-red-600 hover:bg-red-700',
                green: 'bg-green-600 hover:bg-green-700',
                yellow: 'bg-yellow-600 hover:bg-yellow-700',
              };
              const cardColorMaps: Record<string, string> = {
                blue: 'bg-blue-500/20 border-blue-500/50',
                red: 'bg-red-500/20 border-red-500/50',
                green: 'bg-green-500/20 border-green-500/50',
                yellow: 'bg-yellow-500/20 border-yellow-500/50',
              };
              const iconColorMaps: Record<string, string> = {
                blue: 'bg-blue-500/30 text-blue-400',
                red: 'bg-red-500/30 text-red-400',
                green: 'bg-green-500/30 text-green-400',
                yellow: 'bg-yellow-500/30 text-yellow-400',
              };

              const btnColor = colorMaps[insight.color] || 'bg-gray-600';
              const cardColor = cardColorMaps[insight.color] || 'bg-gray-500/20 border-gray-500/50';
              const iconColor = iconColorMaps[insight.color] || 'bg-gray-500/30 text-gray-400';

              return (
                <div
                  key={index}
                  className={`${cardColor} border rounded-lg p-4`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${iconColor.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                      <insight.icon className={`w-6 h-6 ${iconColor.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-white uppercase tracking-tight">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${impactColor}-500/30 text-${impactColor}-300 uppercase`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-semibold">
                          Potential Savings: {formatIndianCurrency(insight.savings)}/month
                        </span>
                        <button className={`${btnColor} text-white px-4 py-1 rounded text-sm transition-colors`}>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BorderGlow>

        {/* Demand Forecasting */}
        <BorderGlow
          borderRadius={32}
          backgroundColor="#120F17"
          className="p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
            Demand Forecasting
          </h3>

          <div className="space-y-4">
            {demandForecast.map((forecast, index) => (
              <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-black text-white uppercase tracking-tight">{forecast.route}</h4>
                  <span className={`font-bold ${forecast.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {forecast.change}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current Demand:</span>
                    <p className="text-white font-semibold">{forecast.currentDemand} trips/week</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Forecasted:</span>
                    <p className="text-white font-semibold">{forecast.forecastedDemand} trips/week</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(forecast.forecastedDemand / 100) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">{forecast.forecastedDemand}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>
      </div>

      {/* Hotspot Mapping */}
      <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-red-500" />
          Demand Hotspot Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotspotData.map((hotspot, index) => (
            <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner hover:bg-white/10 transition-colors rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-black text-white uppercase tracking-tight">{hotspot.city}</h4>
                <span className="text-green-400 font-bold">{hotspot.growth}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bookings:</span>
                  <span className="text-white font-semibold">{hotspot.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="text-white font-semibold">{formatIndianCurrency(hotspot.revenue)}</span>
                </div>
              </div>
              
              <div className="mt-3 h-16 bg-gradient-to-t from-red-500/20 to-transparent rounded flex items-end justify-center">
                <div 
                  className="w-4 bg-red-500 rounded-t"
                  style={{ height: `${(hotspot.bookings / 250) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Clustering */}
        <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-500" />
            Driver Performance Clustering
          </h3>

          <div className="space-y-4">
            {driverClusters.map((cluster, index) => (
              <div key={index} className={`bg-${cluster.color}-500/20 border border-${cluster.color}-500/50 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight">{cluster.cluster}</h4>
                    <p className="text-gray-400 text-sm">{cluster.count} drivers</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold text-${cluster.color}-400`}>{cluster.avgScore}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Avg Score</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {cluster.characteristics.map((char, charIndex) => (
                    <div key={charIndex} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${cluster.color}-400 rounded-full`} />
                      <span className="text-gray-300 text-sm">{char}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Performance Analytics */}
        <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
            Vehicle Performance & Resale Analysis
          </h3>

          <div className="space-y-4">
            {vehiclePerformanceData.map((vehicle, index) => {
              const trendColor = getTrendColor(vehicle.trend);
              
              return (
                <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">{vehicle.vehicle}</h4>
                      <p className="text-gray-400 text-sm">{vehicle.model}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${trendColor}-500/30 text-${trendColor}-300`}>
                      {vehicle.trend}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Performance Score:</span>
                      <p className="text-white font-semibold">{vehicle.performance}/10</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Efficiency:</span>
                      <p className="text-white font-semibold">{vehicle.efficiency} km/l</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Utilization:</span>
                      <p className="text-white font-semibold">{vehicle.utilization}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Resale Value:</span>
                      <p className="text-white font-semibold">₹{vehicle.resaleValue}L</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-red-500" />
          Real-time Anomaly Detection
        </h3>

        <div className="space-y-4">
          {anomalies.map((anomaly, index) => {
            const severityColor = anomaly.severity === 'high' ? 'red' : 
                                 anomaly.severity === 'medium' ? 'yellow' : 'blue';
            
            return (
              <div key={index} className={`bg-${severityColor}-500/20 border border-${severityColor}-500/50 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 text-${severityColor}-400`} />
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">{anomaly.type}</h4>
                      <p className="text-gray-400 text-sm">{anomaly.vehicle} • {anomaly.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severityColor}-500/30 text-${severityColor}-300 uppercase`}>
                      {anomaly.severity}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">{anomaly.confidence}% confidence</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{anomaly.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    Detected: {new Date(anomaly.detected).toLocaleString('en-IN')}
                  </span>
                  <button className={`bg-${severityColor}-600 hover:bg-${severityColor}-700 text-white px-4 py-1 rounded text-sm transition-colors`}>
                    Investigate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
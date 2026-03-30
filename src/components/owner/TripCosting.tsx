import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  MapPin, 
  Clock,
  User,
  Wrench,
  Receipt,
  BarChart3,
  Filter
} from 'lucide-react';

export default function TripCosting() {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d');

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const trips = [
    {
      id: 'TRP-2025-0158',
      route: 'Mumbai → Pune',
      vehicle: 'MH 02 AB 1234',
      driver: 'Suresh Singh',
      date: '2025-01-15',
      distance: 148,
      duration: '3h 15m',
      customerPaid: 3200,
      costs: {
        fuel: 890,
        driverPay: 480,
        tolls: 160,
        parking: 50,
        cleaning: 25,
        maintenance: 75,
        tax: 128
      },
      netProfit: 1392,
      margin: 43.5
    },
    {
      id: 'TRP-2025-0157',
      route: 'Delhi → Agra',
      vehicle: 'DL 01 CD 5678',
      driver: 'Ramesh Sharma',
      date: '2025-01-14',
      distance: 233,
      duration: '4h 20m',
      customerPaid: 4800,
      costs: {
        fuel: 1340,
        driverPay: 700,
        tolls: 280,
        parking: 80,
        cleaning: 30,
        maintenance: 140,
        tax: 192
      },
      netProfit: 2038,
      margin: 42.5
    },
    {
      id: 'TRP-2025-0156',
      route: 'Bengaluru → Coorg',
      vehicle: 'KA 05 EF 9012',
      driver: 'Vikram Patel',
      date: '2025-01-13',
      distance: 236,
      duration: '5h 10m',
      customerPaid: 5200,
      costs: {
        fuel: 1450,
        driverPay: 780,
        tolls: 200,
        parking: 60,
        cleaning: 40,
        maintenance: 160,
        tax: 208
      },
      netProfit: 2302,
      margin: 44.3
    }
  ];

  const costBreakdown = [
    { category: 'Fuel Cost', amount: 145680, percentage: 42.5, icon: Fuel, color: 'red' },
    { category: 'Driver Pay', amount: 98450, percentage: 28.7, icon: User, color: 'blue' },
    { category: 'Tolls & Parking', amount: 34200, percentage: 10.0, icon: MapPin, color: 'yellow' },
    { category: 'Maintenance', amount: 28500, percentage: 8.3, icon: Wrench, color: 'green' },
    { category: 'Cleaning & Misc', amount: 18900, percentage: 5.5, icon: Receipt, color: 'purple' },
    { category: 'Tax & Fees', amount: 17270, percentage: 5.0, icon: Receipt, color: 'orange' }
  ];

  const profitabilityMetrics = [
    { title: 'Total Revenue', value: formatIndianCurrency(847600), change: '+15.2%' },
    { title: 'Total Costs', value: formatIndianCurrency(343000), change: '+8.7%' },
    { title: 'Net Profit', value: formatIndianCurrency(504600), change: '+22.8%' },
    { title: 'Avg Margin', value: '42.8%', change: '+3.2%' }
  ];

  const selectedTripData = trips.find(t => t.id === selectedTrip);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Trip Costing Analysis</h2>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d" className="bg-gray-800">Last 7 Days</option>
              <option value="30d" className="bg-gray-800">Last 30 Days</option>
              <option value="90d" className="bg-gray-800">Last 3 Months</option>
            </select>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Profitability Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profitabilityMetrics.map((metric, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400 mb-2">{metric.title}</div>
              <div className={`text-xs font-medium ${
                metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-500" />
            Recent Trips
          </h3>

          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
                className={`cursor-pointer border rounded-lg p-4 transition-all hover:bg-white/10 ${
                  selectedTrip === trip.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{trip.route}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{trip.vehicle}</span>
                      <span>{trip.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {formatIndianCurrency(trip.netProfit)}
                    </div>
                    <div className="text-sm text-gray-400">{trip.margin}% margin</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-white ml-1">{trip.distance} km</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-1">{trip.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-white ml-1">{formatIndianCurrency(trip.customerPaid)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
            Cost Breakdown Analysis
          </h3>

          <div className="space-y-4">
            {costBreakdown.map((cost, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <cost.icon className={`w-5 h-5 text-${cost.color}-400`} />
                    <span className="text-white font-medium">{cost.category}</span>
                  </div>
                  <span className="text-white font-bold">{formatIndianCurrency(cost.amount)}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-${cost.color}-500 h-2 rounded-full`}
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

      {/* Selected Trip Details */}
      {selectedTripData && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Receipt className="w-6 h-6 mr-2 text-blue-500" />
            Trip Cost Analysis - {selectedTripData.id}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Info */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-4">Trip Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Route:</span>
                    <p className="text-white font-medium">{selectedTripData.route}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Vehicle:</span>
                    <p className="text-white font-medium">{selectedTripData.vehicle}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Driver:</span>
                    <p className="text-white font-medium">{selectedTripData.driver}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white font-medium">{selectedTripData.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Distance:</span>
                    <p className="text-white font-medium">{selectedTripData.distance} km</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <p className="text-white font-medium">{selectedTripData.duration}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-4">Profitability Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Customer Payment:</span>
                    <span className="text-white font-bold">{formatIndianCurrency(selectedTripData.customerPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Costs:</span>
                    <span className="text-red-400 font-bold">
                      -{formatIndianCurrency(Object.values(selectedTripData.costs).reduce((a, b) => a + b, 0))}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Net Profit:</span>
                      <span className="text-green-400 font-bold text-lg">
                        {formatIndianCurrency(selectedTripData.netProfit)}
                      </span>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-green-400 text-sm font-medium">
                        {selectedTripData.margin}% margin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Detailed Cost Breakdown</h4>
              
              {[
                { label: 'Fuel Cost', amount: selectedTripData.costs.fuel, icon: Fuel, color: 'red' },
                { label: 'Driver Payment', amount: selectedTripData.costs.driverPay, icon: User, color: 'blue' },
                { label: 'Tolls', amount: selectedTripData.costs.tolls, icon: MapPin, color: 'yellow' },
                { label: 'Parking', amount: selectedTripData.costs.parking, icon: Clock, color: 'purple' },
                { label: 'Cleaning', amount: selectedTripData.costs.cleaning, icon: Receipt, color: 'green' },
                { label: 'Maintenance', amount: selectedTripData.costs.maintenance, icon: Wrench, color: 'orange' },
                { label: 'Tax & Fees', amount: selectedTripData.costs.tax, icon: DollarSign, color: 'gray' }
              ].map((cost, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <cost.icon className={`w-5 h-5 text-${cost.color}-400`} />
                    <span className="text-white">{cost.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{formatIndianCurrency(cost.amount)}</div>
                    <div className="text-gray-400 text-sm">
                      {((cost.amount / selectedTripData.customerPaid) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
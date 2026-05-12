import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Download,
  TrendingUp,
  Users,
  FileText,
  IndianRupee,
  Calendar,
  Filter,
  Search,
  Plus
} from 'lucide-react';

export default function BillingFinance() {
  const [selectedTab, setSelectedTab] = useState<'invoices' | 'pricing' | 'payroll' | 'reports'>('invoices');

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const financialMetrics = [
    { title: 'Monthly Revenue', value: formatIndianCurrency(2847600), change: '+15.2%' },
    { title: 'Outstanding Amount', value: formatIndianCurrency(456800), change: '-8.7%' },
    { title: 'Driver Payroll', value: formatIndianCurrency(1245600), change: '+12.1%' },
    { title: 'Net Profit', value: formatIndianCurrency(1151200), change: '+18.5%' }
  ];

  const recentInvoices = [
    {
      id: 'INV-2025-0234',
      customer: 'Reliance Industries Ltd.',
      amount: 145600,
      gstAmount: 21840,
      totalAmount: 167440,
      date: '2025-01-15',
      dueDate: '2025-02-14',
      status: 'paid',
      trips: 23,
      hsnSac: '996511'
    },
    {
      id: 'INV-2025-0235',
      customer: 'Tata Consultancy Services',
      amount: 98400,
      gstAmount: 14760,
      totalAmount: 113160,
      date: '2025-01-14',
      dueDate: '2025-02-13',
      status: 'pending',
      trips: 16,
      hsnSac: '996511'
    },
    {
      id: 'INV-2025-0236',
      customer: 'Infosys Limited',
      amount: 234800,
      gstAmount: 35220,
      totalAmount: 270020,
      date: '2025-01-13',
      dueDate: '2025-02-12',
      status: 'overdue',
      trips: 38,
      hsnSac: '996511'
    }
  ];

  const pricingModels = [
    {
      id: 'PM-001',
      name: 'Corporate - Premium',
      type: 'Fixed + Per KM',
      baseRate: 500,
      perKmRate: 15,
      minimumKm: 80,
      applicableVehicles: ['Innova Crysta', 'Corolla Altis'],
      surgeMultiplier: 1.2,
      gstRate: 5
    },
    {
      id: 'PM-002',
      name: 'Tourism - Standard',
      type: 'Package',
      dailyRate: 2500,
      perKmRate: 12,
      driverAllowance: 500,
      applicableVehicles: ['Tempo Traveller', 'Force Traveller'],
      surgeMultiplier: 1.5,
      gstRate: 5
    },
    {
      id: 'PM-003',
      name: 'Airport Transfer',
      type: 'Fixed',
      fixedRate: 800,
      waitingCharges: 50,
      cancellationFee: 200,
      applicableVehicles: ['All'],
      surgeMultiplier: 2.0,
      gstRate: 5
    }
  ];

  const driverPayroll = [
    {
      id: 'PAY-001',
      driverName: 'Suresh Singh',
      vehicle: 'MH 02 AB 1234',
      basicSalary: 25000,
      incentives: 8400,
      fuelBonus: 1200,
      deductions: 2100,
      grossPay: 32500,
      netPay: 30400,
      status: 'processed',
      payDate: '2025-01-15'
    },
    {
      id: 'PAY-002',
      driverName: 'Ramesh Sharma',
      vehicle: 'DL 01 CD 5678',
      basicSalary: 23000,
      incentives: 6800,
      fuelBonus: 900,
      deductions: 1850,
      grossPay: 28850,
      netPay: 27000,
      status: 'processed',
      payDate: '2025-01-15'
    },
    {
      id: 'PAY-003',
      driverName: 'Vikram Patel',
      vehicle: 'KA 05 EF 9012',
      basicSalary: 28000,
      incentives: 9600,
      fuelBonus: 1400,
      deductions: 2300,
      grossPay: 36700,
      netPay: 34400,
      status: 'pending',
      payDate: '2025-01-16'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      case 'processed': return 'green';
      default: return 'gray';
    }
  };

  const InvoicesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Invoice Management</h3>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {recentInvoices.map((invoice) => {
          const statusColor = getStatusColor(invoice.status);
          const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';

          return (
            <div key={invoice.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold uppercase text-white">{invoice.id}</h4>
                  <p className="text-gray-400">{invoice.customer}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-500/30 text-${statusColor}-300 ${isOverdue ? 'animate-pulse' : ''
                    }`}>
                    {invoice.status}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{formatIndianCurrency(invoice.totalAmount)}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Inc. GST</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-gray-400 text-sm">Invoice Date</span>
                  <p className="text-white font-medium">{new Date(invoice.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Due Date</span>
                  <p className={`font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                    {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Trips</span>
                  <p className="text-white font-medium">{invoice.trips}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">HSN/SAC</span>
                  <p className="text-white font-medium">{invoice.hsnSac}</p>
                </div>
              </div>

              <div className="clay-card p-4 bg-black/20 border-white/5 shadow-inner mb-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Amount:</span>
                    <span className="text-white">{formatIndianCurrency(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GST (15%):</span>
                    <span className="text-white">{formatIndianCurrency(invoice.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white">{formatIndianCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                {invoice.status === 'pending' && (
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span>Send Reminder</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PricingView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Pricing Models</h3>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Pricing Model</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pricingModels.map((model) => (
          <div key={model.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-black tracking-tight uppercase text-white">{model.name}</h4>
                <span className="px-2 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
                  {model.type}
                </span>
              </div>
              <button className="text-gray-400 hover:text-white">
                <FileText className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {model.type === 'Fixed + Per KM' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Rate:</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(model.baseRate || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Per KM Rate:</span>
                    <span className="text-white font-semibold">₹{model.perKmRate}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum KM:</span>
                    <span className="text-white font-semibold">{model.minimumKm} km</span>
                  </div>
                </>
              )}

              {model.type === 'Package' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Rate:</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(model.dailyRate || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Per KM Rate:</span>
                    <span className="text-white font-semibold">₹{model.perKmRate}/km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Driver Allowance:</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(model.driverAllowance || 0)}</span>
                  </div>
                </>
              )}

              {model.type === 'Fixed' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Rate:</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(model.fixedRate || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Waiting Charges:</span>
                    <span className="text-white font-semibold">₹{model.waitingCharges}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cancellation Fee:</span>
                    <span className="text-white font-semibold">{formatIndianCurrency(model.cancellationFee || 0)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Surge Multiplier:</span>
                <span className="text-white font-semibold">{model.surgeMultiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GST Rate:</span>
                <span className="text-white font-semibold">{model.gstRate}%</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-gray-400 text-sm">Applicable Vehicles:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {model.applicableVehicles.map((vehicle, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                    {vehicle}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                Edit
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors">
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PayrollView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Driver Payroll & Commissions</h3>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {driverPayroll.map((payroll) => {
          const statusColor = getStatusColor(payroll.status);

          return (
            <div key={payroll.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight uppercase text-white">{payroll.driverName}</h4>
                    <p className="text-gray-400">{payroll.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                    {payroll.status}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{formatIndianCurrency(payroll.netPay)}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Net Pay</div>
                  </div>
                </div>
              </div>

              <div className="clay-card p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <span className="text-gray-400">Basic Salary</span>
                    <p className="text-white font-semibold">{formatIndianCurrency(payroll.basicSalary)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Incentives</span>
                    <p className="text-green-400 font-semibold">+{formatIndianCurrency(payroll.incentives)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Fuel Bonus</span>
                    <p className="text-green-400 font-semibold">+{formatIndianCurrency(payroll.fuelBonus)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Deductions</span>
                    <p className="text-red-400 font-semibold">-{formatIndianCurrency(payroll.deductions)}</p>
                  </div>
                  <div className="text-center border-l border-white/20 pl-4">
                    <span className="text-gray-400">Pay Date</span>
                    <p className="text-white font-semibold">
                      {new Date(payroll.payDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>View Slip</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                {payroll.status === 'pending' && (
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span>Process</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Financial Reports</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Monthly P&L Statement', description: 'Comprehensive profit and loss analysis', icon: TrendingUp, color: 'blue' },
          { name: 'GST Returns', description: 'GST compliance reports and filings', icon: Receipt, color: 'green' },
          { name: 'Driver Payroll Summary', description: 'Detailed payroll and commission reports', icon: Users, color: 'purple' },
          { name: 'Invoice Aging Report', description: 'Outstanding payments and collections', icon: Calendar, color: 'yellow' },
          { name: 'Tax Summary', description: 'Consolidated tax calculations and payments', icon: FileText, color: 'orange' },
          { name: 'Cash Flow Statement', description: 'Monthly cash flow analysis', icon: IndianRupee, color: 'red' }
        ].map((report, index) => {
          const cardColorMaps: Record<string, string> = {
            blue: 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30',
            green: 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30',
            purple: 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30',
            yellow: 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30',
            orange: 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30',
            red: 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30',
          };
          const iconColorMaps: Record<string, string> = {
            blue: 'bg-blue-500/30 text-blue-400',
            green: 'bg-green-500/30 text-green-400',
            purple: 'bg-purple-500/30 text-purple-400',
            yellow: 'bg-yellow-500/30 text-yellow-400',
            orange: 'bg-orange-500/30 text-orange-400',
            red: 'bg-red-500/30 text-red-400',
          };
          const btnColorMaps: Record<string, string> = {
            blue: 'bg-blue-600 hover:bg-blue-700',
            green: 'bg-green-600 hover:bg-green-700',
            purple: 'bg-purple-600 hover:bg-purple-700',
            yellow: 'bg-yellow-600 hover:bg-yellow-700',
            orange: 'bg-orange-600 hover:bg-orange-700',
            red: 'bg-red-600 hover:bg-red-700',
          };

          const cardStyle = cardColorMaps[report.color] || 'bg-gray-500/20 border-gray-500/50';
          const iconStyle = iconColorMaps[report.color] || 'bg-gray-500/30 text-gray-400';
          const btnStyle = btnColorMaps[report.color] || 'bg-gray-600 hover:bg-gray-700';

          return (
            <div key={index} className={`${cardStyle} rounded-lg p-6 transition-colors cursor-pointer group`}>
              <div className={`w-12 h-12 ${iconStyle.split(' ')[0]} rounded-lg flex items-center justify-center mb-4`}>
                <report.icon className={`w-6 h-6 ${iconStyle.split(' ')[1]}`} />
              </div>
              <h4 className="font-black text-white uppercase tracking-tight mb-2">{report.name}</h4>
              <p className="text-gray-300 text-sm mb-4">{report.description}</p>
              <button className={`w-full ${btnStyle} text-white py-2 rounded-lg transition-colors`}>
                Generate Report
              </button>
            </div>
          );
        })}
      </div>

      {/* Integration Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h4 className="text-lg font-black tracking-tight uppercase text-white mb-4">Accounting Software Integration</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Tally Prime', status: 'connected', lastSync: '2025-01-15 10:30 AM' },
            { name: 'Zoho Books', status: 'disconnected', lastSync: 'Never' },
            { name: 'QuickBooks', status: 'pending', lastSync: '2025-01-14 05:45 PM' }
          ].map((integration, index) => {
            const statusColor = integration.status === 'connected' ? 'green' :
              integration.status === 'pending' ? 'yellow' : 'red';

            return (
              <div key={index} className="clay-card p-4 bg-black/20 border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-black text-white uppercase tracking-tight">{integration.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Last sync: {integration.lastSync}</p>
                <button className={`w-full py-2 rounded-lg font-medium transition-colors ${integration.status === 'connected'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}>
                  {integration.status === 'connected' ? 'Sync Now' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Financial Overview */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6">
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
          <CreditCard className="w-8 h-8 mr-3 text-green-400" />
          Billing & Finance Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {financialMetrics.map((metric, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-300 mb-2">{metric.title}</div>
              <div className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex space-x-4">
          {[
            { key: 'invoices', label: 'Invoices & GST', icon: Receipt },
            { key: 'pricing', label: 'Pricing Models', icon: IndianRupee },
            { key: 'payroll', label: 'Payroll', icon: Users },
            { key: 'reports', label: 'Reports', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'invoices' && <InvoicesView />}
      {selectedTab === 'pricing' && <PricingView />}
      {selectedTab === 'payroll' && <PayrollView />}
      {selectedTab === 'reports' && <ReportsView />}
    </div>
  );
}
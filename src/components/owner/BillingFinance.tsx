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
import { triggerDownload } from '../../utils/download';
import { useAuth } from '../../contexts/AuthContext';
import { recordTransaction } from '../../services/obdApi';
import BorderGlow from '../BorderGlow';

export default function BillingFinance() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'invoices' | 'pricing' | 'payroll' | 'reports'>('invoices');

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

  const financialMetrics = [
    { title: 'Monthly Revenue', value: '₹0', change: '0%' },
    { title: 'Outstanding Amount', value: '₹0', change: '0%' },
    { title: 'Driver Payroll', value: '₹0', change: '0%' },
    { title: 'Net Profit', value: '₹0', change: '0%' }
  ];

  const initialInvoices: any[] = [];
  const [invoices, setInvoices] = useState(initialInvoices);

  const pricingModels: any[] = [];

  const initialDriverPayroll: any[] = [];
  const [payroll, setPayroll] = useState(initialDriverPayroll);

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
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => alert('Opening invoice generation form')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => {
          const statusColor = getStatusColor(invoice.status);
          const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';

          return (
            <BorderGlow
              key={invoice.id}
              borderRadius={24}
              backgroundColor="#120F17"
              className="p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold uppercase text-white font-sans tracking-widest">{invoice.id}</h4>
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

              <div className="p-4 bg-black/20 border-white/5 shadow-inner mb-4 rounded-2xl">
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
                <button 
                  onClick={() => alert(`VIEW INVOICE\n\nID: ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: ₹${invoice.amount}\nStatus: ${invoice.status.toUpperCase()}`)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => {
                    const content = `INVOICE: ${invoice.id}\nCustomer: ${invoice.customer}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nStatus: ${invoice.status.toUpperCase()}\n\n-- BILLING DETAILS --\nTrips: ${invoice.trips}\nHSN/SAC: ${invoice.hsnSac}\n\nBase Amount: ₹${invoice.amount}\nGST (15%): ₹${invoice.gstAmount}\n------------------\nTOTAL: ₹${invoice.totalAmount}`;
                    triggerDownload(`${invoice.id}.txt`, content, 'text/plain');
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Details</span>
                </button>
                {invoice.status !== 'paid' && (
                  <button 
                    onClick={async () => {
                      if (user && user.email) {
                        await recordTransaction(invoice.totalAmount, 'credit', user.email, user.role);
                      }
                      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: 'paid' } : inv));
                    }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    <span>Mark Paid & Credit</span>
                  </button>
                )}
              </div>
            </BorderGlow>
          );
        })}
      </div>
    </div>
  );

  const PricingView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Pricing Models</h3>
        <button 
          onClick={() => alert('Opening form to add new pricing model')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
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
              <button 
                onClick={() => alert(`Editing pricing model: ${model.name}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => alert(`Cloning pricing model: ${model.name}`)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
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
          <button 
            onClick={() => {
              const headers = 'Driver Name,Vehicle,Basic Salary,Incentives,Fuel Bonus,Deductions,Gross Pay,Net Pay,Status,Pay Date\n';
              const rows = driverPayroll.map(p => `${p.driverName},${p.vehicle},${p.basicSalary},${p.incentives},${p.fuelBonus},${p.deductions},${p.grossPay},${p.netPay},${p.status},${p.payDate}`).join('\n');
              triggerDownload('payroll_export.csv', headers + rows, 'text/csv');
            }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => alert('Initiating bulk payroll processing')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {payroll.map((payrollItem) => {
          const statusColor = getStatusColor(payrollItem.status);

          return (
            <BorderGlow
              key={payrollItem.id}
              borderRadius={24}
              backgroundColor="#120F17"
              className="p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight uppercase text-white">{payrollItem.driverName}</h4>
                    <p className="text-gray-400">{payrollItem.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                    {payrollItem.status}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{formatIndianCurrency(payrollItem.netPay)}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Net Pay</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <span className="text-gray-400">Basic Salary</span>
                    <p className="text-white font-semibold">{formatIndianCurrency(payrollItem.basicSalary)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Incentives</span>
                    <p className="text-green-400 font-semibold">+{formatIndianCurrency(payrollItem.incentives)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Fuel Bonus</span>
                    <p className="text-green-400 font-semibold">+{formatIndianCurrency(payrollItem.fuelBonus)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">Deductions</span>
                    <p className="text-red-400 font-semibold">-{formatIndianCurrency(payrollItem.deductions)}</p>
                  </div>
                  <div className="text-center border-l border-white/20 pl-4">
                    <span className="text-gray-400">Pay Date</span>
                    <p className="text-white font-semibold">
                      {new Date(payrollItem.payDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button 
                  onClick={() => alert(`VIEW PAYSLIP\n\nDriver: ${payrollItem.driverName}\nVehicle: ${payrollItem.vehicle}\nNet Pay: ₹${payrollItem.netPay}\nStatus: ${payrollItem.status.toUpperCase()}`)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Slip</span>
                </button>
                <button 
                  onClick={() => {
                    const content = `PAYSLIP FOR: ${payrollItem.driverName}\nVehicle: ${payrollItem.vehicle}\nPay Date: ${payrollItem.payDate}\nStatus: ${payrollItem.status.toUpperCase()}\n\n-- EARNINGS --\nBasic Salary: ₹${payrollItem.basicSalary}\nIncentives: ₹${payrollItem.incentives}\nFuel Bonus: ₹${payrollItem.fuelBonus}\n\n-- DEDUCTIONS --\nDeductions: ₹${payrollItem.deductions}\n\n------------------\nGross Pay: ₹${payrollItem.grossPay}\nNET PAY: ₹${payrollItem.netPay}`;
                    triggerDownload(`${payrollItem.id}_payslip.txt`, content, 'text/plain');
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip</span>
                </button>
                {payrollItem.status === 'pending' && (
                  <button 
                    onClick={async () => {
                      if (user && user.email) {
                        await recordTransaction(payrollItem.netPay, 'debit', user.email, user.role);
                      }
                      setPayroll(prev => prev.map(p => p.id === payrollItem.id ? { ...p, status: 'processed' } : p));
                    }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Process & Pay</span>
                  </button>
                )}
              </div>
            </BorderGlow>
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
              <button 
                onClick={() => {
                  let content = '';
                  if (report.name === 'Monthly P&L Statement') {
                    content = 'Category,Value\nRevenue,2847600\nOperational Cost,1245600\nNet Profit,1151200';
                  } else if (report.name === 'Invoice Aging Report') {
                    content = 'Invoice ID,Customer,Amount,Due Date,Status\n' + recentInvoices.map(inv => `${inv.id},${inv.customer},${inv.totalAmount},${inv.dueDate},${inv.status}`).join('\n');
                  } else {
                    content = `Report Name: ${report.name}\nDescription: ${report.description}\nGenerated on: ${new Date().toISOString()}`;
                  }
                  triggerDownload(`${report.name.replace(/\s+/g, '_')}.csv`, content, 'text/csv');
                }}
                className={`w-full ${btnStyle} text-white py-2 rounded-lg transition-colors`}
              >
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
              <div key={index} className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-black text-white uppercase tracking-tight">{integration.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-500/30 text-${statusColor}-300`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">Last sync: {integration.lastSync}</p>
                <button 
                  onClick={() => alert(integration.status === 'connected' ? `Syncing data with ${integration.name}` : `Connecting to ${integration.name}`)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${integration.status === 'connected'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
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
      <BorderGlow
        borderRadius={32}
        backgroundColor="#120F17"
        className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/50 p-6"
      >
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
      </BorderGlow>

      {/* Navigation Tabs */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/10 shadow-2xl"
      >
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${selectedTab === tab.key
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

      {/* Content based on selected tab */}
      {selectedTab === 'invoices' && <InvoicesView />}
      {selectedTab === 'pricing' && <PricingView />}
      {selectedTab === 'payroll' && <PayrollView />}
      {selectedTab === 'reports' && <ReportsView />}
    </div>
  );
}
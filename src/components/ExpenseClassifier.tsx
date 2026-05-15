import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  Download,
  Tag,
  Receipt,
  Fuel,
  Wrench,
  MapPin,
  Car
} from 'lucide-react';

interface ExpenseClassifierProps {
  userRole: 'owner' | 'driver';
}

interface ClassifiedExpense {
  id: string;
  fileName: string;
  category: 'fuel' | 'maintenance' | 'tolls' | 'parking' | 'other';
  amount: number;
  date: string;
  vendor: string;
  confidence: number;
  status: 'processing' | 'classified' | 'verified';
  ocrText?: string;
}

export default function ExpenseClassifier({ userRole }: ExpenseClassifierProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [classifiedExpenses, setClassifiedExpenses] = useState<ClassifiedExpense[]>([
    {
      id: 'EXP-001',
      fileName: 'fuel_receipt_mumbai.jpg',
      category: 'fuel',
      amount: 2450,
      date: '2025-01-15',
      vendor: 'Indian Oil Petrol Pump',
      confidence: 94,
      status: 'classified',
      ocrText: 'INDIAN OIL CORPORATION LTD\nPetrol - 35.5L @ ₹69.00/L\nTotal: ₹2,449.50'
    },
    {
      id: 'EXP-002',
      fileName: 'toll_receipt_expressway.jpg',
      category: 'tolls',
      amount: 180,
      date: '2025-01-14',
      vendor: 'Mumbai-Pune Expressway',
      confidence: 98,
      status: 'verified',
      ocrText: 'MSRDC TOLL PLAZA\nCar/Jeep/Van - Single Journey\nAmount: ₹180.00'
    },
    {
      id: 'EXP-003',
      fileName: 'service_bill_garage.pdf',
      category: 'maintenance',
      amount: 8500,
      date: '2025-01-12',
      vendor: 'Mumbai Auto Service Center',
      confidence: 91,
      status: 'classified',
      ocrText: 'Oil Change + Filter Replacement\nLabor: ₹2,500\nParts: ₹6,000\nTotal: ₹8,500'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fuel': return Fuel;
      case 'maintenance': return Wrench;
      case 'tolls': return MapPin;
      case 'parking': return Car;
      default: return Receipt;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel': return 'red';
      case 'maintenance': return 'orange';
      case 'tolls': return 'blue';
      case 'parking': return 'purple';
      default: return 'gray';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Mock AI processing
    setIsProcessing(true);
    setTimeout(() => {
      const newExpenses = files.map((file, index) => ({
        id: `EXP-${Date.now()}-${index}`,
        fileName: file.name,
        category: ['fuel', 'maintenance', 'tolls', 'parking'][Math.floor(Math.random() * 4)] as any,
        amount: Math.floor(Math.random() * 5000) + 500,
        date: new Date().toISOString().split('T')[0],
        vendor: 'Auto-detected Vendor',
        confidence: Math.floor(Math.random() * 20) + 80,
        status: 'processing' as const,
        ocrText: 'Processing OCR text...'
      }));
      
      setClassifiedExpenses(prev => [...newExpenses, ...prev]);
      setIsProcessing(false);
      setUploadedFiles([]);
    }, 2000);
  };

  const exportExpenses = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    const data = classifiedExpenses.map(exp => ({
      Date: exp.date,
      Category: exp.category,
      Vendor: exp.vendor,
      Amount: exp.amount,
      Confidence: `${exp.confidence}%`,
      Status: exp.status
    }));
    
    console.log(`Exporting ${format.toUpperCase()}:`, data);
    // In real implementation, this would generate and download the file
  };

  const expenseSummary = classifiedExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-6">
        <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white mb-4 flex items-center">
          <Camera className="w-8 h-8 mr-3 text-purple-400" />
          AI Expense Classifier (OCR)
        </h2>
        <p className="text-gray-300">
          Upload receipts for automatic categorization and expense tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Upload Receipts</h3>
          
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Drop receipts here or click to upload</p>
              <p className="text-gray-400 text-sm">Supports JPG, PNG, PDF • Max 10MB per file</p>
            </label>
          </div>

          {isProcessing && (
            <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />
                <span className="text-blue-400 font-medium">Processing with AI OCR...</span>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 border-white/5 shadow-inner text-center rounded-2xl">
              <div className="text-2xl font-bold text-purple-400">{classifiedExpenses.length}</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Total Receipts</div>
            </div>
            <div className="p-4 bg-black/20 border-white/5 shadow-inner text-center rounded-2xl">
              <div className="text-2xl font-bold text-green-400">
                {formatIndianCurrency(Object.values(expenseSummary).reduce((a, b) => a + b, 0))}
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-500">Total Amount</div>
            </div>
          </div>
        </div>

        {/* Category Summary */}
        <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Expense Categories</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => exportExpenses('csv')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-xl text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => exportExpenses('pdf')}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(expenseSummary).map(([category, amount]) => {
              const Icon = getCategoryIcon(category);
              const color = getCategoryColor(category);
              const count = classifiedExpenses.filter(exp => exp.category === category).length;
              
              return (
                <div key={category} className={`bg-${color}-500/20 border border-${color}-500/50 rounded-2xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 text-${color}-400`} />
                      <span className="text-white font-semibold capitalize">{category}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{count} receipts</span>
                  </div>
                  <div className={`text-2xl font-bold text-${color}-400`}>
                    {formatIndianCurrency(amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Classified Expenses List */}
      <div className="p-6 bg-[#120F17] border-white/5 shadow-2xl rounded-2xl">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Recent Classifications</h3>
        
        <div className="space-y-4">
          {classifiedExpenses.slice(0, 10).map((expense) => {
            const Icon = getCategoryIcon(expense.category);
            const color = getCategoryColor(expense.category);
            
            return (
              <div key={expense.id} className="p-4 bg-black/20 border-white/5 shadow-inner rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${color}-400`} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">{expense.fileName}</h4>
                      <p className="text-gray-400 text-sm">{expense.vendor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black tracking-tight uppercase text-white">{formatIndianCurrency(expense.amount)}</div>
                    <div className="flex items-center space-x-2">
                      <Tag className={`w-4 h-4 text-${color}-400`} />
                      <span className={`text-${color}-400 text-sm font-medium capitalize`}>
                        {expense.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white ml-2">{new Date(expense.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-white ml-2">{expense.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === 'verified' ? 'bg-green-500/30 text-green-300' :
                      expense.status === 'classified' ? 'bg-blue-500/30 text-blue-300' :
                      'bg-yellow-500/30 text-yellow-300'
                    }`}>
                      {expense.status}
                    </span>
                  </div>
                </div>

                {expense.ocrText && (
                  <div className="mt-3 p-3 bg-white/5 rounded-2xl border-l-4 border-l-purple-500">
                    <span className="text-gray-400 text-sm">OCR Text:</span>
                    <p className="text-gray-300 text-sm mt-1 font-mono">{expense.ocrText}</p>
                  </div>
                )}

                <div className="flex space-x-3 mt-4">
                  <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl text-sm transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl text-sm transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>View Full</span>
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
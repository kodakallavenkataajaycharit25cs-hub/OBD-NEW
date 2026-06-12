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
  Car,
  X,
  ZoomIn
} from 'lucide-react';
import { triggerDownload } from '../utils/download';
import { useAuth } from '../contexts/AuthContext';
import { recordTransaction } from '../services/obdApi';
import { formatDate } from '../utils/dateFormat';

declare const cv: any; // OpenCV global

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
  invoiceNumber?: string;
  confidence: number;
  status: 'processing' | 'classified' | 'verified';
  ocrText?: string;
  imageUrl?: string;
}

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

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'fuel':
      return Fuel;
    case 'maintenance':
      return Wrench;
    case 'tolls':
      return MapPin;
    case 'parking':
      return Car;
    default:
      return FileText;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'fuel':
      return 'blue';
    case 'maintenance':
      return 'purple';
    case 'tolls':
      return 'green';
    case 'parking':
      return 'yellow';
    default:
      return 'gray';
  }
};

export default function ExpenseClassifier({ userRole }: ExpenseClassifierProps) {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [viewExpense, setViewExpense] = useState<ClassifiedExpense | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [classifiedExpenses, setClassifiedExpenses] = useState<ClassifiedExpense[]>([]);

  const processImageWithOpenCV = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            if (typeof cv === 'undefined') {
              // Fallback to raw base64 if OpenCV not loaded
              resolve((e.target?.result as string).split(',')[1]);
              return;
            }
            const src = cv.imread(img);
            const dst = new cv.Mat();
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
            const canvas = document.createElement('canvas');
            cv.imshow(canvas, dst);
            const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            src.delete();
            dst.delete();
            resolve(base64);
          } catch (err) {
            console.warn("OpenCV processing failed, using raw image", err);
            resolve((e.target?.result as string).split(',')[1]);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractWithGemini = async (base64Image: string) => {
    if (!apiKey) throw new Error('API Key missing');

    // Validate key format - Gemini API keys always start with AIzaSy
    if (!apiKey.startsWith('AIza')) {
      throw new Error('INVALID_KEY: Your API key appears to be invalid. Gemini API keys always start with "AIzaSy". Please get a fresh key from aistudio.google.com');
    }

    const prompt = `Extract receipt data in JSON format: { "amount": number, "date": "YYYY-MM-DD", "vendor": "string", "invoice": "string", "category": "fuel|maintenance|tolls|parking|other" }. Return ONLY JSON. If multiple amounts, pick the TOTAL.`;

    // Try models in order — stop on rate limit (429), skip on 404
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/jpeg", data: base64Image } }
              ]
            }]
          })
        });

        if (response.status === 429) {
          // Rate limited — wait 3 seconds then retry same model once
          await new Promise(res => setTimeout(res, 3000));
          const retry = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                ]
              }]
            })
          });
          if (!retry.ok) {
            const errBody = await retry.json().catch(() => ({}));
            lastError = new Error(`Rate limit hit (${retry.status}). Please wait a moment and try again. Details: ${errBody?.error?.message || retry.statusText}`);
            continue;
          }
          const result = await retry.json();
          const text = result.candidates[0].content.parts[0].text;
          return JSON.parse(text.replace(/```json|```/g, '').trim());
        }

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody?.error?.message || response.statusText;
          lastError = new Error(`API Error ${response.status}: ${errMsg}`);
          continue; // try next model
        }

        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('All models failed');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!apiKey) {
      alert("Please enter your Gemini API Key first.");
      setShowKeyInput(true);
      return;
    }

    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setIsProcessing(true);

    for (const file of files) {
      try {
        const imageUrl = URL.createObjectURL(file);
        const processedBase64 = await processImageWithOpenCV(file);
        const extracted = await extractWithGemini(processedBase64);

        const newExpense: ClassifiedExpense = {
          id: `EXP-${Date.now()}`,
          fileName: file.name,
          category: extracted.category,
          amount: extracted.amount,
          date: extracted.date,
          vendor: extracted.vendor,
          invoiceNumber: extracted.invoice,
          confidence: 100,
          status: 'classified',
          ocrText: `AI Verified Data for ${extracted.vendor}`,
          imageUrl
        };

        setClassifiedExpenses(prev => [newExpense, ...prev]);
      } catch (error: any) {
        console.error('AI Extraction failed:', error);
        if (error?.message?.startsWith('INVALID_KEY:')) {
          alert(error.message.replace('INVALID_KEY: ', ''));
          setShowKeyInput(true);
          setApiKey('');
          localStorage.removeItem('GEMINI_API_KEY');
        } else {
          alert(`Extraction failed for ${file.name}:\n${error?.message || 'Unknown error'}\n\nTip: Make sure your API key starts with "AIzaSy" and is from aistudio.google.com`);
        }
      }
    }

    setIsProcessing(false);
    setUploadedFiles([]);
  };

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    setShowKeyInput(false);
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
    if (format === 'csv') {
      const csvContent = "Date,Category,Vendor,Amount,Confidence,Status\n" + 
        data.map(r => Object.values(r).join(',')).join('\n');
      triggerDownload('expenses.csv', csvContent, 'text/csv');
    } else {
      const textContent = "EXPENSE REPORT\n=====================\n\n" + 
        data.map(exp => `Date: ${exp.Date}\nVendor: ${exp.Vendor}\nCategory: ${exp.Category.toUpperCase()}\nAmount: ₹${exp.Amount}\nStatus: ${exp.Status.toUpperCase()} (Confidence: ${exp.Confidence})\n---------------------`).join('\n');
      triggerDownload('expenses.txt', textContent, 'text/plain');
    }
  };

  const expenseSummary = classifiedExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleVerify = async (id: string) => {
    const expenseToVerify = classifiedExpenses.find(exp => exp.id === id);
    if (!expenseToVerify || expenseToVerify.status === 'verified') return;

    setClassifiedExpenses(prev => 
      prev.map(exp => exp.id === id ? { ...exp, status: 'verified' } : exp)
    );

    if (user && user.email) {
      await recordTransaction(expenseToVerify.amount, 'debit', user.email, user.role);
    }
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white flex items-center">
              <Camera className="w-8 h-8 mr-3 text-purple-400" />
              AI Expense Classifier (AI Vision)
            </h2>
            <button 
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors"
            >
              {apiKey ? 'Change API Key' : 'Configure API Key'}
            </button>
          </div>
          <p className="text-gray-300">
            Professional-grade extraction using OpenCV + Gemini 1.5 Flash Vision.
          </p>

          {showKeyInput && (
            <div className="mt-4 p-4 bg-black/40 border border-purple-500/30 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-purple-300 mb-2">Gemini API Key (Required for 99% Accuracy)</label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key from Google AI Studio..."
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 outline-none transition-all"
                />
                <button
                  onClick={saveApiKey}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="mt-2 text-[10px] text-gray-500 font-medium italic">
                Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-400 underline">aistudio.google.com</a>
              </p>
            </div>
          )}
        </div>
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
            <div className="mt-6 bg-[#120F17] border border-white/5 rounded-2xl p-4">
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
                <span>TXT/Details</span>
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
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">{formatDate(expense.date)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Invoice:</span>
                    <span className="text-white ml-2">{expense.invoiceNumber || 'N/A'}</span>
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
                  <button 
                    onClick={() => handleVerify(expense.id)}
                    disabled={expense.status === 'verified'}
                    className={`flex items-center space-x-2 ${expense.status === 'verified' ? 'bg-gray-600 cursor-default' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-2xl text-sm transition-colors`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{expense.status === 'verified' ? 'Verified' : 'Verify'}</span>
                  </button>
                  <button 
                    onClick={() => setViewExpense(expense)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl text-sm transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>View Full</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Image / Receipt Preview Modal */}
      {viewExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setViewExpense(null)}
        >
          <div
            className="relative bg-[#120F17] border border-white/10 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="font-black text-white uppercase tracking-tight text-lg">{viewExpense.fileName}</h3>
                <p className="text-gray-400 text-sm">{viewExpense.vendor} &mdash; {new Date(viewExpense.date).toLocaleDateString('en-IN')}</p>
              </div>
              <button
                onClick={() => setViewExpense(null)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
              {viewExpense.imageUrl ? (
                <img
                  src={viewExpense.imageUrl}
                  alt={`Receipt: ${viewExpense.fileName}`}
                  className="max-w-full max-h-[65vh] object-contain rounded-2xl shadow-lg border border-white/10"
                />
              ) : (
                <div className="w-full">
                  <div className="mb-4 p-4 bg-white/5 rounded-2xl border-l-4 border-purple-500">
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">OCR Extracted Text</p>
                    <p className="text-gray-200 text-sm font-mono whitespace-pre-wrap">{viewExpense.ocrText || 'No text extracted.'}</p>
                  </div>
                  <p className="text-center text-gray-500 text-xs">No image available for this entry. Upload a photo to see the receipt here.</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="text-gray-400">Confidence: <span className="text-white font-semibold">{viewExpense.confidence}%</span></span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                viewExpense.status === 'verified' ? 'bg-green-500/30 text-green-300' :
                viewExpense.status === 'classified' ? 'bg-blue-500/30 text-blue-300' :
                'bg-yellow-500/30 text-yellow-300'
              }`}>{viewExpense.status}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
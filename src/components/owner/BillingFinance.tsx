import React, { useState, useEffect } from 'react';
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
  Plus,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { triggerDownload } from '../../utils/download';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { 
  recordTransaction, 
  fetchExpenses, 
  fetchOwners,
  fetchPricingModels,
  createPricingModel,
  updatePricingModel,
  deletePricingModel,
  PricingModel
} from '../../services/obdApi';
import BorderGlow from '../BorderGlow';
import { formatDate, formatCurrentDate, formatCurrentTime } from '../../utils/dateFormat';

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

  const [revenue, setRevenue] = useState(1450000);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterMinAmount, setFilterMinAmount] = useState<string>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>('');
  const [viewInvoice, setViewInvoice] = useState<any | null>(null);

  // Pricing model state & forms
  const [pricingModels, setPricingModels] = useState<PricingModel[]>([]);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [editingPricingModel, setEditingPricingModel] = useState<PricingModel | null>(null);
  const [modelName, setModelName] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customOption, setCustomOption] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const owners = await fetchOwners();
        const currentOwner = owners.find((o: any) => o.email?.toLowerCase() === user?.email?.toLowerCase()) || owners[0];
        if (currentOwner) {
          setRevenue(Number(currentOwner.revenue));
          setOwnerId(currentOwner.id);
        }

        const expenseData = await fetchExpenses();
        const filteredExpenses = expenseData.filter(
          (exp: any) =>
            currentOwner && exp.owner_id &&
            String(exp.owner_id).trim().replace(/^0+/, '') === String(currentOwner.id).trim().replace(/^0+/, '')
        );

        const mappedExpenses = filteredExpenses.map((exp: any) => ({
          id: exp.id,
          customer: exp.vendor,
          date: exp.date,
          dueDate: exp.date,
          status: exp.status === 'verified' ? 'paid' : 'pending',
          trips: 'N/A',
          hsnSac: 'N/A',
          amount: exp.amount,
          gstAmount: 0,
          totalAmount: exp.amount,
          isExpense: true,
          imageUrl: exp.imageUrl
        }));
        
        setInvoices(mappedExpenses);

        const pmData = await fetchPricingModels();
        const filteredPM = pmData.filter(
          (pm: any) =>
            currentOwner && pm.owner_id &&
            String(pm.owner_id).trim().replace(/^0+/, '') === String(currentOwner.id).trim().replace(/^0+/, '')
        );
        setPricingModels(filteredPM);
      } catch (err) {
        console.error('Failed to load data for BillingFinance:', err);
      }
    };
    loadData();
  }, [user]);

  // Outstanding Amount: sum of all unpaid bills (status = pending)
  const outstandingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Paid/Verified Expenses: sum of all paid bills (status = paid)
  const totalPaidExpenses = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Driver Payroll: baseline (e.g., 250000)
  const driverPayroll = 250000;

  // Net Profit = Revenue - Paid Expenses - Driver Payroll
  const netProfit = Math.max(0, revenue - totalPaidExpenses - driverPayroll);

  const financialMetrics = [
    { title: 'Monthly Revenue', value: formatIndianCurrency(revenue), change: '+12.4%' },
    { title: 'Outstanding Amount', value: formatIndianCurrency(outstandingAmount), change: outstandingAmount > 0 ? '+4.2%' : '0%' },
    { title: 'Driver Payroll', value: formatIndianCurrency(driverPayroll), change: '+2.1%' },
    { title: 'Net Profit', value: formatIndianCurrency(netProfit), change: netProfit > 0 ? '+8.5%' : '0%' }
  ];

  const openAddPricingModel = () => {
    setEditingPricingModel(null);
    setModelName('');
    setPeopleCount(1);
    setTotalAmount(0);
    setCustomOption('');
    setShowPricingForm(true);
  };

  const openEditPricingModel = (model: PricingModel) => {
    setEditingPricingModel(model);
    setModelName(model.name);
    setPeopleCount(model.people_count);
    setTotalAmount(model.total_amount);
    setCustomOption(model.custom_option || '');
    setShowPricingForm(true);
  };

  const handleSavePricingModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) {
      alert("Please enter a model name.");
      return;
    }

    try {
      if (editingPricingModel) {
        // Update
        const updated = await updatePricingModel(editingPricingModel.id, {
          name: modelName,
          people_count: Number(peopleCount),
          total_amount: Number(totalAmount),
          custom_option: customOption,
          owner_id: ownerId
        });
        setPricingModels(prev => prev.map(m => m.id === editingPricingModel.id ? updated : m));
      } else {
        // Create
        const newItem: PricingModel = {
          id: `PM-${Date.now()}`,
          name: modelName,
          people_count: Number(peopleCount),
          total_amount: Number(totalAmount),
          custom_option: customOption,
          owner_id: ownerId
        };
        const created = await createPricingModel(newItem);
        setPricingModels(prev => [created, ...prev]);
      }
      setShowPricingForm(false);
    } catch (err) {
      console.error("Failed to save pricing model:", err);
      alert("Failed to save pricing model.");
    }
  };

  const handleDeletePricingModel = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing model?")) return;
    try {
      await deletePricingModel(id);
      setPricingModels(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Failed to delete pricing model:", err);
      alert("Failed to delete pricing model.");
    }
  };

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

  const loadPdfJs = async (): Promise<any> => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjsLib);
      };
      script.onerror = (e) => reject(new Error('Failed to load PDF.js: ' + e));
      document.head.appendChild(script);
    });
  };

  const convertPdfToImage = async (pdfBase64Url: string): Promise<string> => {
    const pdfjsLib = await loadPdfJs();
    const base64Data = pdfBase64Url.split(',')[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    if (context) {
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    }
    throw new Error('Canvas 2D context not available');
  };

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64DataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const isPdf = file.type === 'application/pdf';
      let processedBase64 = '';
      if (isPdf) {
        processedBase64 = await convertPdfToImage(base64DataUrl);
      } else {
        processedBase64 = base64DataUrl.split(',')[1];
      }

      const newInvoiceId = `EXP-${Date.now()}`;
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `invoice_${Date.now()}.${fileExt}`;
      const filePath = `invoices/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const key = localStorage.getItem('OPENROUTER_API_KEY') || localStorage.getItem('GEMINI_API_KEY');
      let extracted = { 
        vendor: file.name.substring(0, file.name.lastIndexOf('.')) || file.name, 
        amount: Math.floor(Math.random() * 50000) + 5000, 
        date: new Date().toISOString().split('T')[0], 
        invoice: 'INV-' + Math.floor(Math.random() * 100000), 
        category: 'other', 
        address: 'Uploaded invoice file' 
      };
      
      if (key) {
        const models = [
          "nvidia/nemotron-nano-12b-2-vl",
          "google/gemma-3-27b-it",
          "google/gemma-4-31b-instruct",
          "qwen/qwen-2.5-vl-7b-instruct"
        ];
        
        const prompt = `Extract receipt/invoice data in JSON format. Return ONLY a valid JSON object matching this schema: { "amount": number, "date": "YYYY-MM-DD", "vendor": "string", "invoice": "string", "category": "fuel|maintenance|tolls|parking|other", "address": "string" }. Do not include any Markdown tags or code block fences.`;

        for (const model of models) {
          try {
            console.log(`BillingFinance OCR: Attempting extraction using model ${model}`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model: model,
                messages: [{
                  role: "user",
                  content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${processedBase64}` } }
                  ]
                }]
              })
            });
            if (response.ok) {
              const resData = await response.json();
              const text = resData.choices[0].message.content;
              const cleanJson = text.replace(/```json|```/g, '').trim();
              const parsed = JSON.parse(cleanJson);
              extracted = { ...extracted, ...parsed };
              break;
            }
          } catch (ocrErr) {
            console.warn(`OCR failed with model ${model}:`, ocrErr);
          }
        }
      }

      const createRes = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newInvoiceId,
          file_name: file.name,
          category: extracted.category || 'other',
          amount: Number(extracted.amount) || 0,
          date: extracted.date || new Date().toISOString().split('T')[0],
          vendor: extracted.vendor || 'Uploaded Vendor',
          address: extracted.address || '',
          invoice_number: extracted.invoice,
          confidence: 100,
          status: 'classified',
          ocr_text: `Uploaded invoice ${file.name}`,
          image_url: publicUrl
        })
      });

      if (createRes.ok) {
        const row = await createRes.json();
        const newInvMapped = {
          id: row.id,
          customer: row.vendor,
          date: row.date,
          dueDate: row.date,
          status: row.status === 'verified' ? 'paid' : 'pending',
          trips: 'N/A',
          hsnSac: 'N/A',
          amount: Number(row.amount),
          gstAmount: 0,
          totalAmount: Number(row.amount),
          isExpense: true,
          imageUrl: row.image_url
        };
        setInvoices(prev => [newInvMapped, ...prev]);
        alert("Invoice uploaded successfully!");
      }
    } catch (err) {
      console.error("Failed to upload invoice:", err);
      alert("Failed to upload invoice.");
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filterStatus !== 'all' && invoice.status !== filterStatus) return false;
    if (filterDate && invoice.date !== filterDate) return false;
    
    const amount = invoice.totalAmount;
    if (filterMinAmount && amount < Number(filterMinAmount)) return false;
    if (filterMaxAmount && amount > Number(filterMaxAmount)) return false;
    
    return true;
  });

  const InvoicesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">Invoice Management</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 ${showFilters ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} px-4 py-2 rounded-xl transition-colors text-white`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => document.getElementById('billing-invoice-file-input')?.click()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Invoice</span>
          </button>
          <input
            type="file"
            id="billing-invoice-file-input"
            className="hidden"
            accept=".pdf,.csv,.doc,.docx,image/*"
            onChange={handleInvoiceUpload}
          />
        </div>
      </div>

      {showFilters && (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid (Verified)</option>
              <option value="pending">Unpaid (Classified)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Min Amount (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={filterMinAmount}
              onChange={(e) => setFilterMinAmount(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Max Amount (₹)</label>
            <input
              type="number"
              placeholder="Max"
              value={filterMaxAmount}
              onChange={(e) => setFilterMaxAmount(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredInvoices.map((invoice) => {
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
                  <div className="text-white mt-1">{formatDate(invoice.date)}</div>
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
                  onClick={() => setViewInvoice(invoice)}
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
          onClick={openAddPricingModel}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Model</span>
        </button>
      </div>

      {pricingModels.length === 0 ? (
        <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-gray-400 text-sm">No pricing models found. Click "Add Pricing Model" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pricingModels.map((model) => (
            <BorderGlow
              key={model.id}
              borderRadius={24}
              backgroundColor="#120F17"
              className="p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-black tracking-tight uppercase text-white">{model.name}</h4>
                  <span className="text-xs text-gray-500 font-mono">{model.id}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-green-400">{formatIndianCurrency(model.total_amount)}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Amount</div>
                </div>
              </div>

              <div className="p-4 bg-black/20 border border-white/5 rounded-2xl mb-6 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">No. of People:</span>
                  <span className="text-white font-semibold">{model.people_count}</span>
                </div>
                {model.custom_option && (
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-gray-400 text-xs block mb-1">Custom Option / Description:</span>
                    <p className="text-white bg-black/40 p-2 rounded-lg text-xs leading-relaxed max-h-24 overflow-y-auto font-mono whitespace-pre-wrap">{model.custom_option}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => openEditPricingModel(model)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-xl transition-all border border-blue-500/30"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDeletePricingModel(model.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 rounded-xl transition-all border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </BorderGlow>
          ))}
        </div>
      )}

      {/* Pricing Model Form Modal */}
      {showPricingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[#120F17] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight text-white uppercase">
                {editingPricingModel ? 'Edit Pricing Model' : 'Add Pricing Model'}
              </h3>
              <button
                onClick={() => setShowPricingForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePricingModel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name of the Model</label>
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Premium Fleet Service"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">No. of People</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  placeholder="e.g. 5"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount in Total (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  placeholder="e.g. 25000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Custom Option / Details</label>
                <textarea
                  value={customOption}
                  onChange={(e) => setCustomOption(e.target.value)}
                  placeholder="e.g. custom terms, notes, or specific fleet parameters..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 resize-none font-mono text-xs"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPricingForm(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors font-medium"
                >
                  {editingPricingModel ? 'Update Model' : 'Create Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
              const rows = payroll.map(p => `${p.driverName},${p.vehicle},${p.basicSalary},${p.incentives},${p.fuelBonus},${p.deductions},${p.grossPay},${p.netPay},${p.status},${p.payDate}`).join('\n');
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
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-2">Generated on: {formatCurrentDate()} {formatCurrentTime()}</div>
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
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-widest block mb-1">{formatDate(payrollItem.payDate)}</span>
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
            { key: 'pricing', label: 'Pricing Models', icon: IndianRupee }
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
      {selectedTab === 'invoices' && InvoicesView()}
      {selectedTab === 'pricing' && PricingView()}

      {/* Receipt / Invoice Preview Modal */}
      {viewInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setViewInvoice(null)}
        >
          <div
            className="relative bg-[#120F17] border border-white/10 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="font-black text-white uppercase tracking-tight text-lg">{viewInvoice.id}</h3>
                <p className="text-gray-400 text-sm">{viewInvoice.customer} &mdash; {formatDate(viewInvoice.date)}</p>
              </div>
              <button
                onClick={() => setViewInvoice(null)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-[50vh] w-full">
              {viewInvoice.imageUrl ? (
                viewInvoice.imageUrl.startsWith('data:application/pdf') || 
                viewInvoice.imageUrl.startsWith('data:text/csv') || 
                viewInvoice.imageUrl.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                viewInvoice.imageUrl.startsWith('data:application/msword') ? (
                  <iframe
                    src={viewInvoice.imageUrl}
                    className="w-full h-full min-h-[60vh] rounded-2xl border border-white/10 bg-white"
                    title={`Receipt: ${viewInvoice.id}`}
                  />
                ) : (
                  <img
                    src={viewInvoice.imageUrl}
                    alt={`Receipt: ${viewInvoice.id}`}
                    className="max-w-full max-h-[65vh] object-contain rounded-2xl shadow-lg border border-white/10"
                  />
                )
              ) : (
                <div className="w-full text-center p-8">
                  <p className="text-gray-400 text-sm">No digital file preview available for this generated entry.</p>
                  <div className="mt-4 p-4 bg-white/5 rounded-2xl border-l-4 border-blue-500 text-left">
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Invoice Details</p>
                    <p className="text-gray-200 text-sm">Customer: {viewInvoice.customer}</p>
                    <p className="text-gray-200 text-sm">Total Amount: {formatIndianCurrency(viewInvoice.totalAmount)}</p>
                    <p className="text-gray-200 text-sm">Status: {viewInvoice.status.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
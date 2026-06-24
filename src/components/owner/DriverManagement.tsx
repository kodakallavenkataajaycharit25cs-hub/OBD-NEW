import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  Star,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Car,
  Plus,
  Edit,
  Trash2,
  X,
  FileText
} from 'lucide-react';
import BorderGlow from '../BorderGlow';
import { formatDate } from '../../utils/dateFormat';
import { fetchPilots, updatePilot, fetchPilotDocuments } from '../../services/obdApi';
import { useAuth } from '../../contexts/AuthContext';

export default function DriverManagement() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDriverDocs, setSelectedDriverDocs] = useState<any[]>([]);
  const [viewingDocUrl, setViewingDocUrl] = useState<string | null>(null);

  const driverIdParam = searchParams.get('driverId');

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const allPilots = await fetchPilots();
        const ownerId = user?.id || 'owner-default';
        const myDrivers = allPilots.filter((p: any) => 
          p.owner_id && ownerId && 
          String(p.owner_id).trim().replace(/^0+/, '') === String(ownerId).trim().replace(/^0+/, '')
        );
        setDrivers(myDrivers);
        
        if (driverIdParam && myDrivers.some((d: any) => d.id === driverIdParam)) {
          setSelectedDriver(driverIdParam);
        } else if (myDrivers.length > 0) {
          setSelectedDriver(myDrivers[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, [user, driverIdParam]);

  useEffect(() => {
    if (driverIdParam && drivers.some((d: any) => d.id === driverIdParam)) {
      setSelectedDriver(driverIdParam);
    }
  }, [driverIdParam, drivers]);

  const selectedDriverData = drivers.find(d => d.id === selectedDriver) || drivers[0];

  useEffect(() => {
    const loadDocs = async () => {
      if (selectedDriverData?.email) {
        try {
          const docs = await fetchPilotDocuments(selectedDriverData.email);
          setSelectedDriverDocs(docs);
        } catch (err) {
          console.error("Failed to load documents for driver:", err);
        }
      } else {
        setSelectedDriverDocs([]);
      }
    };
    loadDocs();
  }, [selectedDriver, selectedDriverData?.email]);

  const handleAvailabilityChange = async (id: string, newAvailability: string) => {
    try {
      await updatePilot(id, { availability: newAvailability });
      setDrivers(prev => prev.map(d => d.id === id ? { ...d, availability: newAvailability } : d));
    } catch (err) {
      console.error('Failed to update availability', err);
    }
  };

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

  // Mock data functions for UI elements not yet in backend
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'green';
    if (score >= 8) return 'yellow';
    if (score >= 7) return 'orange';
    return 'red';
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'valid': return { color: 'green', icon: CheckCircle };
      case 'expiring': return { color: 'yellow', icon: AlertTriangle };
      case 'expired': return { color: 'red', icon: AlertTriangle };
      default: return { color: 'gray', icon: Clock };
    }
  };

  const getAvailabilityPill = (availability: string) => {
    const avail = availability?.toLowerCase() || 'unknown';
    if (avail === 'busy' || avail === 'on-trip') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest bg-red-500/20 text-red-500 border border-red-500/20">Busy</span>;
    }
    if (avail === 'available' || avail === 'free') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest bg-green-500/20 text-green-500 border border-green-500/20">Free</span>;
    }
    if (avail === 'off-duty' || avail === 'offday') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest bg-gray-500/20 text-gray-400 border border-gray-500/20">Unavailable</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/20">{availability || 'Unknown'}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BorderGlow
        borderRadius={24}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-black tracking-tighter uppercase clay-text-3d text-white">Driver Management</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/owner/drivers/create" className="flex items-center px-4 py-2 bg-[#120F17] border border-white/5 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg text-sm font-bold transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Add Driver
            </Link>
            <Link to="/owner/drivers/update" className="flex items-center px-4 py-2 bg-[#120F17] border border-white/5 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg text-sm font-bold transition-all active:scale-95">
              <Edit className="w-4 h-4 mr-2" /> Update Driver
            </Link>
            <Link to="/owner/drivers/remove" className="flex items-center px-4 py-2 bg-[#120F17] border border-white/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-all active:scale-95">
              <Trash2 className="w-4 h-4 mr-2" /> Remove Driver
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{drivers.length}</div>
            <div className="text-sm text-blue-300">Total Drivers</div>
          </div>
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{drivers.filter(d => d.status === 'active').length}</div>
            <div className="text-sm text-green-300">Active Today</div>
          </div>
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {(drivers.reduce((sum, d) => sum + Number(d.safety_score || 0), 0) / (drivers.length || 1)).toFixed(1)}
            </div>
            <div className="text-sm text-yellow-300">Avg Score</div>
          </div>
          <div className="bg-[#120F17] border border-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(drivers.reduce((sum, d) => sum + Number(d.rating || 0), 0) / (drivers.length || 1)).toFixed(1)}
            </div>
            <div className="text-sm text-purple-300">Avg Rating</div>
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver List */}
        <BorderGlow
          borderRadius={24}
          backgroundColor="#120F17"
          className="p-6 border-white/5 shadow-2xl h-full"
        >
          <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Driver Roster
          </h3>

          <div className="space-y-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver.id)}
                className={`cursor-pointer border rounded-lg p-4 transition-all hover:bg-white/10 ${selectedDriver === driver.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">{driver.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${driver.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                        <span>{driver.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getAvailabilityPill(driver.availability)}
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{driver.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Vehicle:</span>
                    <span className="text-white ml-1">{driver.vehicle_model || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Number:</span>
                    <span className="text-white ml-1">{driver.vehicle_number || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>

        {/* Driver Details */}
        <div className="space-y-6">
          {/* Profile Info */}
          <BorderGlow
            borderRadius={24}
            backgroundColor="#120F17"
            className="p-6 border-white/5 shadow-2xl h-full"
          >
            <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Driver Profile</h3>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white">{selectedDriverData?.name}</h4>
                <p className="text-gray-400">{selectedDriverData?.hours || 0} hours experience</p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${selectedDriverData?.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{selectedDriverData?.status}</span>
                  </div>
                  
                  {/* Interactive Status Toggle */}
                  <div className="flex bg-black/40 rounded-full border border-white/10 p-0.5 ml-4">
                    <button onClick={() => handleAvailabilityChange(selectedDriverData.id, 'available')} className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-colors ${selectedDriverData?.availability === 'available' || selectedDriverData?.availability === 'free' ? 'bg-green-500/20 text-green-500' : 'text-gray-500 hover:text-white'}`}>Free</button>
                    <button onClick={() => handleAvailabilityChange(selectedDriverData.id, 'busy')} className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-colors ${selectedDriverData?.availability === 'busy' || selectedDriverData?.availability === 'on-trip' ? 'bg-red-500/20 text-red-500' : 'text-gray-500 hover:text-white'}`}>Busy</button>
                    <button onClick={() => handleAvailabilityChange(selectedDriverData.id, 'off-duty')} className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-colors ${selectedDriverData?.availability === 'off-duty' || selectedDriverData?.availability === 'offday' ? 'bg-gray-500/20 text-gray-400' : 'text-gray-500 hover:text-white'}`}>Unavailable</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData?.contact || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{selectedDriverData?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  {selectedDriverData?.vehicle_number} {selectedDriverData?.vehicle_model ? `- ${selectedDriverData.vehicle_model}` : ''}
                  {(!selectedDriverData?.vehicle_number && !selectedDriverData?.vehicle_model) && 'No Vehicle Assigned'}
                </span>
              </div>
              <div className="flex items-center justify-between col-span-1 md:col-span-2 mt-2 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Total Trips: {selectedDriverData?.trips || 0}</span>
                </div>
              </div>
            </div>
          </BorderGlow>



        </div>
      </div>

      {/* Document Status */}
      <BorderGlow
        borderRadius={32}
        backgroundColor="#120F17"
        className="p-6 border-white/5 shadow-2xl h-full"
      >
        <h3 className="text-xl font-black tracking-tighter uppercase clay-text-3d text-white mb-6">Document Archives & Compliance</h3>

        {selectedDriverDocs.length === 0 ? (
          <div className="text-center p-8 bg-black/20 border border-white/5 rounded-2xl">
            <p className="text-gray-400 text-sm">No uploaded compliance documents found for this driver.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedDriverDocs.map((doc, index) => {
              const statusColor = doc.status === 'valid' ? 'green' : 'red';
              const StatusIcon = doc.status === 'valid' ? CheckCircle : AlertTriangle;

              return (
                <div key={doc.id} className="p-4 bg-black/20 border border-white/5 shadow-inner rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-black text-white uppercase tracking-tight">{doc.name}</h4>
                      <StatusIcon className={`w-5 h-5 text-${statusColor}-400`} />
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`text-${statusColor}-400 font-medium capitalize`}>
                          {doc.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expires:</span>
                        <span className="text-gray-300">
                          <span className="text-white ml-2">{formatDate(doc.expiry)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingDocUrl(doc.file_url)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider h-10 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Document</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </BorderGlow>

      {/* Doc Preview Modal */}
      {viewingDocUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setViewingDocUrl(null)}
        >
          <div 
            className="relative bg-[#120F17] border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-black text-white uppercase tracking-tight text-sm">Document Preview</h3>
              <button
                onClick={() => setViewingDocUrl(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-[60vh]">
              {viewingDocUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={viewingDocUrl}
                  className="w-full h-full min-h-[65vh] rounded-2xl bg-white"
                  title="Doc Preview"
                />
              ) : (
                <img
                  src={viewingDocUrl}
                  alt="Doc Preview"
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
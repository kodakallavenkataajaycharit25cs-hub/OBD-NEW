import React, { useState } from 'react';
import { X, User, Lock, AlertCircle, ShieldCheck, Zap, Globe, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const { success, user } = await login(email, password);
      if (success && user) {
        onClose();
        
        setTimeout(() => {
          if (user.role === 'superadmin') {
            navigate('/super-admin-dashboard');
          } else if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (user.role === 'owner') {
            navigate('/owner');
          } else if (user.role === 'driver') {
            navigate('/driver');
          } else {
            navigate('/'); // Fallback
          }
        }, 100);
      } else {
        setError('Invalid credentials sequence');
      }
    } catch (err) {
      setError('Connection timeout. Retry session.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(resetEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) throw new Error('Failed to send reset link');

      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Connection timeout.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Horizontal Mini-Page Modal */}
      <div className="relative w-full max-w-5xl bg-[#120F17]/60 border-white/10 shadow-3xl overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-in zoom-in-95 duration-300 rounded-2xl">
        
        {/* Graph Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
               backgroundSize: '40px 40px' 
             }} />
        
        {/* Left Side: Branding & Info */}
        <div className="w-full md:w-5/12 p-10 bg-blue-600/10 border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-xl mb-8">
              S
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none clay-text-3d uppercase mb-4 italic">
              {isResetting ? 'Account\nRecovery' : 'Access\nThe Core'}
            </h2>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 leading-relaxed italic">
              Sukrutha Mobility<br/>Fleet Authority Protocol
            </p>

            {!isResetting && (
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, text: 'Encrypted Node Uplink' },
                  { icon: Globe, text: 'Nationwide Sync active' },
                  { icon: Zap, text: 'Real-time Telemetry' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-white/40 group hover:text-white/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 pt-10">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Systems Nominal</div>
          </div>
        </div>

        {/* Right Side: Login/Reset Form */}
        <div className="flex-1 p-10 flex flex-col justify-center relative bg-black/20">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-md mx-auto w-full">
            {isResetting ? (
              // Reset Password Request View
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase clay-text-3d mb-2">Reset Sequence</h3>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">Enter recovery email node</p>
                </div>

                {resetSent ? (
                  <div className="bg-green-500/10 border-green-500/20 p-6 rounded-2xl text-center">
                    <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Uplink Transmitted</h4>
                    <p className="text-gray-400 text-[10px] leading-relaxed">Check your Email for the secure recovery sequence link.</p>
                    <button 
                      onClick={() => { setIsResetting(false); setResetSent(false); }}
                      className="mt-6 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetRequest} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Recovery Email</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/40 shadow-inner text-xs font-bold"
                          placeholder="operator@domain.com"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border-red-500/20 p-4 flex items-center space-x-3 rounded-2xl">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">{error}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full clay-btn clay-btn-blue h-16 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-50"
                      >
                        {loading ? 'TRANSMITTING...' : 'SEND RECOVERY LINK'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsResetting(false)}
                        className="w-full text-center text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Abort & Return
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              // Standard Login View
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="mb-10 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase clay-text-3d mb-2">Authorize Login</h3>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">Enter secure mission passkeys</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border-red-500/20 p-4 mb-8 flex items-center space-x-3 animate-in slide-in-from-top-2 rounded-2xl">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Identity Node</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/40 shadow-inner text-xs font-bold"
                        placeholder="Operator ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Security sequence</label>
                      <button 
                        type="button"
                        onClick={() => setIsResetting(true)}
                        className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest hover:text-blue-400 transition-colors"
                      >
                        Forgot Passkey?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/40 shadow-inner text-xs font-bold"
                        placeholder="Passkey"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full clay-btn clay-btn-blue h-16 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-50 mt-4"
                  >
                    {loading ? 'SYNCING...' : 'INITIATE LOGIN'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

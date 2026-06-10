import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (Supabase handles the hash/token automatically)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired recovery session. Please request a new link.');
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120F17] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-md shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase clay-text-3d mb-2">New Sequence</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Define your secure passkey uplink</p>
        </div>

        {success ? (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Sequence Synchronized</h4>
              <p className="text-gray-400 text-[10px] leading-relaxed">Your new passkey is active. Redirecting to terminal...</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="clay-btn clay-btn-blue w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-3"
            >
              <span>ACCESS LOGIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">New Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/40 shadow-inner text-xs font-bold"
                  placeholder="Minimum 6 characters"
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

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Confirm Sequence</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-blue-500/40 shadow-inner text-xs font-bold"
                  placeholder="Repeat passkey"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-red-500/20 p-4 flex items-center space-x-3 rounded-2xl">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full clay-btn clay-btn-blue h-16 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-50"
            >
              {loading ? 'SYNCHRONIZING...' : 'UPDATE PASSKEY'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

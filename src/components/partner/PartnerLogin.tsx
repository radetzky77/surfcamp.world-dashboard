import React, { useState } from 'react';
import { Waves, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Building2, Key } from 'lucide-react';
import { Partner, UserProfile } from '../../types';

interface PartnerLoginProps {
  onLoginSuccess: (user: UserProfile, partner?: Partner, bookings?: any[]) => void;
  onNavigateRegister: () => void;
}

export const PartnerLogin: React.FC<PartnerLoginProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (email.toLowerCase().includes('demo')) {
        // Fetch seeded Demo Partner Account
        const res = await fetch('/api/partner/demo-seed');
        const data = await res.json();
        onLoginSuccess(data.user, data.partner, data.bookings);
        setLoading(false);
        return;
      }

      // Check standard login endpoint or Supabase
      const res = await fetch('/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Invalid partner login credentials');
      }

      onLoginSuccess(data.user, data.partner);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate partner user.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/partner/demo-seed');
      const data = await res.json();
      onLoginSuccess(data.user, data.partner, data.bookings);
    } catch (err: any) {
      setErrorMsg('Failed to load demo partner profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#5B8CFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6D5EF5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#16161F] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10">
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B8CFF] to-[#6D5EF5] shadow-lg shadow-[#5B8CFF]/20 mb-2">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <span className="block text-[10px] font-black uppercase tracking-wider text-[#5B8CFF] bg-[#5B8CFF]/10 px-3 py-1 rounded-full w-fit mx-auto border border-[#5B8CFF]/20">
            Camp Partner Portal
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">Sign In to Your Surf Camp</h1>
          <p className="text-xs text-white/50">Dedicated portal for Surfcamp.world verified partner camps</p>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/70 font-semibold mb-1.5">Camp Partner Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@surfcamp.world"
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#5B8CFF] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#111118] text-white border border-white/10 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#5B8CFF] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B8CFF] to-[#6D5EF5] text-white font-bold shadow-lg shadow-[#5B8CFF]/20 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Log In to Partner Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Access Button */}
        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <p className="text-[11px] text-white/40">Testing/Development Fast Access:</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-[#111118] hover:bg-white/5 border border-white/10 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Log in as Demo Partner (Demo Surf Camp)</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs">
          <span className="text-white/40">Don't have a partner account yet? </span>
          <button onClick={onNavigateRegister} className="text-[#5B8CFF] font-semibold hover:underline">
            Register your Surf Camp
          </button>
        </div>
      </div>
    </div>
  );
};

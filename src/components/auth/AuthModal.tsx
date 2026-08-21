import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, X, Lock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAsAdmin, loginAsGuest, user, isAdmin, logout } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAsAdmin(password);
    if (!success) {
      setError('Invalid admin credentials. Use "admin" or "kashta123" for Mandal administration access.');
    }
  };

  const handleQuickAdminLogin = () => {
    loginAsAdmin('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="auth-modal-card"
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200/80 transform transition-all"
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner border border-white/30">
            <span className="text-3xl font-devanagari font-bold">ॐ</span>
          </div>

          <h3 className="font-serif-devotional text-xl font-bold tracking-tight">
            Kashtabhanjan Premi Login
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Access Sunderkand Portal & Mandal Management
          </p>
        </div>

        {/* Current Status Bar */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-2.5 flex items-center justify-between text-xs">
          <span className="text-stone-600">Current Role:</span>
          <span className={`font-semibold px-2 py-0.5 rounded-md ${isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200/80 text-amber-900'}`}>
            {isAdmin ? '🛡️ Mandal Administrator' : '👤 Devotee (Guest View)'}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Admin Login Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  Mandal Admin Access
                </label>
                <span className="text-[11px] text-stone-600">Key: <code className="bg-stone-100 px-1 py-0.5 rounded text-orange-700 font-mono">admin</code></span>
              </div>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password or passcode"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl text-sm outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
              {error && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                id="submit-admin-login"
                className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Login as Admin</span>
              </button>

              <button
                type="button"
                id="quick-demo-admin-btn"
                onClick={handleQuickAdminLogin}
                className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                title="1-Click Admin Access for testing"
              >
                1-Click Admin
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-stone-400 uppercase font-medium tracking-wider">or</span>
          </div>

          {/* Guest Login Section */}
          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100/80">
            <div className="flex items-start space-x-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-800">Devotee Guest Access</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Browse Sunderkand dates, venue directions, read Bhajan lyrics, and view photos.
                </p>
              </div>
            </div>

            <button
              id="continue-as-guest-btn"
              onClick={loginAsGuest}
              className="w-full py-2 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Continue as Guest (View-Only)
            </button>
          </div>

          {/* Role Permissions Legend */}
          <div className="text-[11px] text-stone-500 space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin: Create ceremonies, manage accounting, add bhajans, upload photos</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Guest: View Sunderkand schedules, read lyrics with font scaler, photo darshan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

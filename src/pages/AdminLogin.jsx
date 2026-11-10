import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  UserPlus, 
  LogIn,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AdminLogin = ({ onBackToHome }) => {
  const { login, registerAdmin, authError, setAuthError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("Conference Admin");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setAuthError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        await registerAdmin(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setLocalError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail("admin@womensconference.com");
    setPassword("Admin@2026");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Background gradient accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-brand-300 to-rose-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Back link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isRegisterMode ? "Create Admin Account" : "Admin Portal Login"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRegisterMode
              ? "Set up the initial administrator credentials for this Firebase project"
              : "Secure access restricted to authorized event administrators"}
          </p>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{localError || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Admin Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Chief Organizer"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@womensconference.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-medium">min 6 chars</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Admin & Sign In</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Create Initial Admin */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setLocalError("");
              setAuthError("");
            }}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {isRegisterMode 
              ? "Already have an admin account? Sign in here" 
              : "First time setup? Create initial admin account"}
          </button>

          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fill sample admin email & password</span>
          </button>
        </div>

      </div>
    </div>
  );
};


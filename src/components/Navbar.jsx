import React, { useState } from "react";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleNav = (view, anchor = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (anchor && view === "home") {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-800 text-white flex items-center justify-center font-serif italic text-lg shadow-sm group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  Women's Conference
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-50 text-brand-700 border border-rose-200 rounded-full">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Iritty Mandalam • Wisdom Women
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav("home")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                currentView === "home" 
                  ? "text-brand-800 bg-rose-50" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav("home", "details")}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
            >
              Speakers & Venue
            </button>
            <button
              onClick={() => handleNav("home", "register")}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
            >
              Register
            </button>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentView !== "admin" ? (
              <button
                onClick={() => handleNav("admin")}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-800 hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-800 hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Public Site</span>
              </button>
            )}

            {currentView === "admin" && currentUser ? (
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home", "register")}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-800 hover:bg-brand-900 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Register Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentView === "home" ? (
              <button
                onClick={() => handleNav("admin")}
                className="p-2 text-slate-700 hover:text-brand-800 hover:bg-rose-50 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="p-2 text-slate-700 hover:text-brand-800 hover:bg-rose-50 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Public Site
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <button
            onClick={() => handleNav("home")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => handleNav("home", "details")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Speakers & Venue
          </button>
          <button
            onClick={() => handleNav("home", "register")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Registration Form</span>
            <span className="text-[11px] bg-brand-800 text-white font-bold px-2 py-0.5 rounded-full">Open</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav("admin")}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from "react";
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  UserCheck, 
  Calendar, 
  MapPin, 
  LogOut,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ currentView, setCurrentView, participantCount = 0 }) => {
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
    <header className="sticky top-0 z-40 w-full glass border-b border-pink-100/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-rose-400 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-700 bg-clip-text text-transparent">
                  Women's Conference
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200/80 rounded-full">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Empowering Voices • Inspiring Futures
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handleNav("home")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentView === "home" 
                  ? "text-brand-700 bg-brand-50/80" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNav("home", "register")}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => handleNav("home", "participants")}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors flex items-center gap-1.5"
            >
              <span>Participants</span>
              {participantCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-100 text-brand-700">
                  {participantCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav("home", "details")}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
            >
              Event Info
            </button>
          </nav>

          {/* Desktop Right Actions: Register CTA & Admin */}
          <div className="hidden md:flex items-center gap-3">
            {currentView !== "admin" ? (
              <button
                onClick={() => handleNav("admin")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-brand-700 hover:bg-brand-50/60 border border-slate-200/80 transition-all flex items-center gap-1.5"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-brand-700 hover:bg-brand-50/60 border border-slate-200/80 transition-all flex items-center gap-1.5"
              >
                <span>View Public Site</span>
              </button>
            )}

            {currentView === "admin" && currentUser ? (
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home", "register")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentView === "home" ? (
              <button
                onClick={() => handleNav("admin")}
                className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-slate-200 text-xs font-semibold"
              >
                Public Site
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <button
            onClick={() => handleNav("home")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Home / Overview
          </button>
          <button
            onClick={() => handleNav("home", "register")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
          >
            <span>Register Form</span>
            <span className="text-xs bg-brand-500 text-white font-bold px-2 py-0.5 rounded-full">Open</span>
          </button>
          <button
            onClick={() => handleNav("home", "participants")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
          >
            <span>Registered Participants</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
              {participantCount}
            </span>
          </button>
          <button
            onClick={() => handleNav("home", "details")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          >
            Event Schedule & Venue
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNav("admin")}
              className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Admin Dashboard</span>
            </button>

            {currentView === "admin" && currentUser && (
              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


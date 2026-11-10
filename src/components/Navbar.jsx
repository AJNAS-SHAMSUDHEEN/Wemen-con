import React, { useState } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Calendar, 
  MapPin, 
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#981b37] text-white flex items-center justify-center font-serif italic text-lg shadow-md group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  വനിതാ സമ്മേളനം
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
                  ഇരിട്ടി
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Wisdom Women Iritty Zone • 2026 നവംബർ 21
              </p>
            </div>
          </div>

          {/* Desktop Navigation (No public participant details exposed!) */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNav("home")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentView === "home" 
                  ? "text-rose-700 bg-rose-50" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              സമ്മേളനം (Home)
            </button>
            <button
              onClick={() => handleNav("home", "details")}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
            >
              വേദിയും അതിഥികളും (Speakers)
            </button>
            <button
              onClick={() => handleNav("home", "register")}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
            >
              രജിസ്ട്രേഷൻ (Register)
            </button>
          </nav>

          {/* Desktop Right CTA: Register & Admin */}
          <div className="hidden md:flex items-center gap-3">
            {currentView !== "admin" ? (
              <button
                onClick={() => handleNav("admin")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-all flex items-center gap-1.5"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>അഡ്മിൻ ലോഗിൻ (Admin)</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-all flex items-center gap-1.5"
              >
                <span>പബ്ലിക് സൈറ്റ് കാണുക</span>
              </button>
            )}

            {currentView === "admin" && currentUser ? (
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home", "register")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#981b37] to-[#d62254] hover:from-[#7e142c] hover:to-[#b91c47] shadow-md shadow-rose-900/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <span>രജിസ്റ്റർ ചെയ്യുക</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {currentView === "home" ? (
              <button
                onClick={() => handleNav("admin")}
                className="p-2 text-slate-700 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("home")}
                className="p-2 text-slate-700 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Public Site
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-2.5 shadow-xl">
          <button
            onClick={() => handleNav("home")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
          >
            സമ്മേളനം (Home)
          </button>
          <button
            onClick={() => handleNav("home", "details")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
          >
            വേദിയും അതിഥികളും (Speakers & Venue)
          </button>
          <button
            onClick={() => handleNav("home", "register")}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between"
          >
            <span>രജിസ്ട്രേഷൻ ഫോം (Register)</span>
            <span className="text-xs bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">Open</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav("admin")}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>അഡ്മിൻ പോർട്ടൽ (Admin Dashboard)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

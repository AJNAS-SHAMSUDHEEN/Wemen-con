import React, { useState } from "react";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  Info,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ currentView, setCurrentView, onOpenDetails }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleNav = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs transition-all font-ml">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-serif italic text-base shadow-xs group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900">
                  വനിതാ സമ്മേളനം
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-brand-800 border border-rose-200 rounded-full">
                  ഇരിട്ടി
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                2026 നവംബർ 21 ശനി • ഉളിക്കൽ
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            
            {/* Program Details Button (Opens Modal) */}
            {currentView === "home" && onOpenDetails && (
              <button
                type="button"
                onClick={onOpenDetails}
                className="py-2 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-brand-900 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-brand-700" />
                <span className="hidden sm:inline">പരിപാടി വിവരങ്ങൾ</span>
                <span className="sm:hidden">വിവരങ്ങൾ</span>
              </button>
            )}

            {/* If in admin view, show link back to public form */}
            {currentView === "admin" && (
              <button
                onClick={() => handleNav("home")}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                രജിസ്ട്രേഷൻ ഫോം
              </button>
            )}

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              aria-label="Open Sidebar Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

        </div>
      </header>

      {/* Slide-over Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-ml">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-6 z-10 animate-slideLeft">
            
            {/* Sidebar Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-brand-900 text-white flex items-center justify-center font-serif italic text-xs">
                    W
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">
                    മെനു (Menu)
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <div className="space-y-3">
                <button
                  onClick={() => handleNav("home")}
                  className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 text-slate-800 text-sm font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>രജിസ്ട്രേഷൻ ഫോം</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {onOpenDetails && (
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      onOpenDetails();
                    }}
                    className="w-full text-left p-3 rounded-2xl hover:bg-rose-50 text-brand-900 text-sm font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>പരിപാടി വിവരങ്ങളും പോസ്റ്ററും</span>
                    <Info className="w-4 h-4 text-brand-700" />
                  </button>
                )}
              </div>

              {/* Conference Brief Info inside Sidebar */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-extrabold text-slate-900">ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം</p>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-brand-700" />
                  <span>2026 നവംബർ 21 ശനി</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-brand-700" />
                  <span>ചോയ്സ് ഓഡിറ്റോറിയം, ഉളിക്കൽ</span>
                </div>
              </div>
            </div>

            {/* Admin Portal Section (Discreetly at the bottom of the Sidebar) */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                അഡ്മിനിസ്ട്രേഷൻ (Admin Only)
              </span>

              {currentUser ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleNav("admin")}
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-300" />
                    <span>അഡ്മിൻ ഡാഷ്‌ബോർഡ്</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ലോഗൗട്ട് (Sign Out)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav("admin")}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-800" />
                  <span>അഡ്മിൻ പോർട്ടൽ (Admin Login)</span>
                </button>
              )}

              <p className="text-[10px] text-slate-400 text-center pt-2">
                © 2026 Wisdom Women Iritty Zone
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

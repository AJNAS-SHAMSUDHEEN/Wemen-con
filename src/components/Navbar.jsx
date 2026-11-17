import React, { useState } from "react";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  Info,
  Calendar,
  MapPin,
  ChevronRight,
  FileText
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
      {/* Minimal Header App Bar: Pure White background with subtle lavender border */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-lavender-200/80 transition-all font-ml">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Left: Provided Logo & Minimal Title "പഞ്ചസമ്മേളനം" */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 sm:h-9 w-auto max-h-9 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              പഞ്ചസമ്മേളനം
            </h1>
          </div>

          {/* Right: Only the Hamburger Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-lavender-900 hover:bg-lavender-100/70 border border-lavender-200 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
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
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl border-l border-lavender-200 flex flex-col justify-between p-6 z-10 animate-slideLeft">
            
            {/* Sidebar Content */}
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-lavender-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="h-6 w-auto object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="font-extrabold text-base text-slate-900">
                    പഞ്ചസമ്മേളനം
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-lavender-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <div className="space-y-2.5">
                <button
                  onClick={() => handleNav("home")}
                  className={`w-full text-left p-3.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    currentView === "home" 
                      ? "bg-lavender-100 text-lavender-900 border border-lavender-300/80" 
                      : "hover:bg-lavender-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-lavender-600" />
                    <span>രജിസ്ട്രേഷൻ ഫോം</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {onOpenDetails && (
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      onOpenDetails();
                    }}
                    className="w-full text-left p-3.5 rounded-2xl hover:bg-lavender-50 text-slate-800 text-sm font-bold flex items-center justify-between transition-colors cursor-pointer border border-transparent hover:border-lavender-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-lavender-600" />
                      <span>പരിപാടി വിവരങ്ങൾ (Details)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Brief Conference Details inside Sidebar */}
              <div className="mt-6 p-4 rounded-2xl bg-lavender-50/70 border border-lavender-200 text-xs space-y-2">
                <p className="font-extrabold text-slate-900">ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-lavender-700 shrink-0" />
                  <span>2026 നവംബർ 21 ശനി</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-lavender-700 shrink-0" />
                  <span>ചോയ്സ് ഓഡിറ്റോറിയം, ഉളിക്കൽ</span>
                </div>
              </div>
            </div>

            {/* Admin Portal Section at Sidebar Bottom */}
            <div className="pt-6 border-t border-lavender-100 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                അഡ്മിനിസ്ട്രേഷൻ (Admin Only)
              </span>

              {currentUser ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleNav("admin")}
                    className="w-full py-2.5 px-3 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-lavender-100" />
                    <span>അഡ്മിൻ ഡാഷ്‌ബോർഡ്</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-rose-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ലോഗൗട്ട് (Sign Out)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav("admin")}
                  className="w-full py-2.5 px-3 rounded-xl bg-lavender-50 hover:bg-lavender-100 text-lavender-900 border border-lavender-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-lavender-700" />
                  <span>അഡ്മിൻ പോർട്ടൽ (Admin Login)</span>
                </button>
              )}

              <p className="text-[10px] text-slate-400 text-center pt-1 font-sans">
                WISDOM WOMEN IRITTY ZONE
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

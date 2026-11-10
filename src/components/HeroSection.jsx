import React from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic2
} from "lucide-react";

export const HeroSection = ({ 
  totalCount = 0,
  onRegisterClick 
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-20">
      {/* Background Decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 -z-10 opacity-30 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-rose-400 via-amber-200 to-rose-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Organizations Banner */}
        <div className="flex items-center justify-between border-b border-rose-100/80 pb-4 mb-8 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 font-extrabold text-sm sm:text-base tracking-tight">WISDOM Girls</span>
          </div>
          <div className="text-center hidden sm:block text-slate-400 font-semibold tracking-wide text-[11px] uppercase">
            ഇരിട്ടി മണ്ഡലം
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-black text-xs sm:text-sm tracking-wider uppercase">WISDOM ISLAMIC ORGANIZATION</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Event Information */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Slogan Badge */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-rose-200/90 shadow-xs text-xs font-bold text-rose-900 mx-auto lg:mx-0">
              <span className="text-rose-700">വിശ്വാസത്തിൽ കരുത്ത്...</span>
              <span className="hidden sm:inline text-rose-300">•</span>
              <span className="text-amber-800">ആദർശത്തിൽ മാതൃക...</span>
              <span className="hidden sm:inline text-rose-300">•</span>
              <span className="text-emerald-800">ജീവിതത്തിൽ വിശുദ്ധി!</span>
            </div>

            {/* Sub-theme */}
            <p className="text-xs uppercase tracking-widest font-extrabold text-slate-500">
              വിശ്വാസം • വിജ്ഞാനം • വിമോചനം
            </p>

            {/* Main Title */}
            <div>
              <div className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-sm font-extrabold mb-2 border border-rose-200">
                ഇരിട്ടി മണ്ഡലം
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.2]">
                <span className="italic font-serif text-[#981b37] pr-2">Women</span>
                വനിതാ സമ്മേളനം
              </h1>
            </div>

            {/* Date, Time & Venue Highlight Card */}
            <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-md shadow-rose-900/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">തീയതി & സമയം</p>
                  <p className="text-sm font-black text-slate-900">2026 നവംബർ 21 ശനി</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">വേദി</p>
                  <p className="text-sm font-black text-slate-900">ഉളിക്കൽ</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്
                  </p>
                </div>
              </div>
            </div>

            {/* Registration CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#981b37] via-[#b91c47] to-[#d62254] hover:from-[#7e142c] hover:to-[#b91c47] shadow-lg shadow-rose-900/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
              >
                <span>സൗജന്യമായി രജിസ്റ്റർ ചെയ്യുക</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>മുഴുവൻ സ്ത്രീകൾക്കും സ്വാഗതം</span>
              </div>
            </div>

          </div>

          {/* Right Column: Poster Image Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="/poster.jpg"
                alt="Wisdom Women വനിതാ സമ്മേളനം ഇരിട്ടി മണ്ഡലം"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="bg-[#981b37] text-white py-2 text-center text-xs font-extrabold tracking-wider uppercase">
                WISDOM WOMEN IRITTY ZONE
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

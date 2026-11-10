import React from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export const HeroSection = ({ 
  totalCount = 0,
  onRegisterClick 
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20">
      
      {/* Subtle backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 -z-10 opacity-25 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-rose-300 via-amber-100 to-rose-100 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Organizations Banner */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-8 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-brand-700 font-extrabold text-xs sm:text-sm tracking-tight">WISDOM Girls</span>
          </div>
          <div className="text-center hidden sm:block text-slate-400 font-semibold tracking-wider text-[11px] uppercase">
            Iritty Mandalam
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-wide uppercase">WISDOM ISLAMIC ORGANIZATION</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Event Information */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Slogan Badge (Malayalam from Poster) */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-rose-200 shadow-xs text-xs font-semibold text-brand-900 mx-auto lg:mx-0 font-ml">
              <span className="text-brand-800 font-bold">വിശ്വാസത്തിൽ കരുത്ത്...</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-amber-800 font-bold">ആദർശത്തിൽ മാതൃക...</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-emerald-800 font-bold">ജീവിതത്തിൽ വിശുദ്ധി!</span>
            </div>

            {/* Sub-theme */}
            <p className="text-xs uppercase tracking-widest font-extrabold text-slate-500 font-ml">
              വിശ്വാസം • വിജ്ഞാനം • വിമോചനം
            </p>

            {/* Main Title */}
            <div>
              <div className="inline-block px-3 py-1 bg-rose-50 text-brand-800 rounded-lg text-xs sm:text-sm font-extrabold mb-2 border border-rose-200">
                ഇരിട്ടി മണ്ഡലം
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.2]">
                <span className="italic font-serif text-brand-800 pr-2">Women</span>
                <span className="font-ml">വനിതാ സമ്മേളനം</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
                Annual Women's Conference 2026 — Iritty Zone
              </p>
            </div>

            {/* Key Event Details Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Date & Time</p>
                  <p className="text-sm font-bold text-slate-900">2026 November 21, Saturday</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>9:30 AM – 4:00 PM</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Venue</p>
                  <p className="text-sm font-bold text-slate-900">Choice Auditorium, Ulikkal</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium font-ml">
                    നുച്ച്യാട് റോഡ്, ഉളിക്കൽ
                  </p>
                </div>
              </div>
            </div>

            {/* Registration CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-brand-800 hover:bg-brand-900 shadow-md shadow-brand-900/15 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register as Participant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-ml">മുഴുവൻ സ്ത്രീകൾക്കും സ്വാഗതം</span>
              </div>
            </div>

          </div>

          {/* Right Column: Poster Image Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-xs sm:max-w-sm w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <img
                src="/poster.jpg"
                alt="Women's Conference Iritty Mandalam Official Poster"
                className="w-full h-auto object-cover group-hover:scale-101 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="bg-brand-900 text-white py-2 text-center text-[11px] font-bold tracking-wider uppercase">
                WISDOM WOMEN IRITTY ZONE
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

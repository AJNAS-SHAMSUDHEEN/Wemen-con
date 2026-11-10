import React from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const HeroSection = ({ 
  stats = { total: 0, foodCount: 0, placesCount: 0 },
  onRegisterClick,
  onViewParticipantsClick
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 opacity-40 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-brand-300 via-rose-200 to-indigo-200 rounded-full animate-gradient"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold tracking-wide shadow-xs mb-6">
            <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>Grand Annual Gathering • Women's Empowerment 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6">
            Inspiring Leadership,{" "}
            <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
              Empowering Voices
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl mx-auto">
            Join thousands of visionary women leaders, students, educators, and changemakers for three transformative days of knowledge, connection, and spiritual growth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>Register as Participant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onViewParticipantsClick}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5"
            >
              <Users className="w-5 h-5 text-slate-500" />
              <span>View Registered List</span>
              <span className="text-xs px-2 py-0.5 font-extrabold rounded-full bg-brand-100 text-brand-700">
                {stats.total}
              </span>
            </button>
          </div>

          {/* Key Event Highlights pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-pink-100/80 text-brand-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Date & Duration</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">Dec 12 - 14, 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Venue</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">Grand Convention Center</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Hospitality</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">Complimentary Food</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-r from-brand-500/20 via-rose-300/20 to-indigo-300/20 shadow-xl shadow-brand-500/5">
            <div className="bg-white rounded-[22px] p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              <div className="pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  <span className="text-brand-600">{stats.total}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-500" />
                  <span>Total Registered</span>
                </p>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  <span className="text-emerald-600">{stats.foodCount}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Meals Requested</span>
                </p>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  <span className="text-indigo-600">{stats.placesCount}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Places Represented</span>
                </p>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  <span className="text-amber-600">100%</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Free Registration</span>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { RegistrationForm } from "../components/RegistrationForm";
import { SuccessModal } from "../components/SuccessModal";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mic2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen
} from "lucide-react";

const SPEAKERS = [
  { name: "ഡോ. ജൗഹർ മുനവ്വർ", role: "Keynote Speaker", icon: "🎙️" },
  { name: "ടി.കെ ഉബൈദ്", role: "Speaker & Author", icon: "📖" },
  { name: "ഹാരിസ് കായക്കൊടി", role: "Speaker", icon: "🎙️" },
  { name: "റഊഫ ടീച്ചർ", role: "Educator & Speaker", icon: "✨" },
  { name: "ഷഫീഖ് സ്വലാഹി", role: "Scholar & Speaker", icon: "🎙️" },
  { name: "നജീബ ടീച്ചർ", role: "Social Worker & Speaker", icon: "✨" },
];

export const HomePage = ({ totalCount = 0 }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      
      {/* 1. Hero Section */}
      <HeroSection
        totalCount={totalCount}
        onRegisterClick={() => scrollToSection("register")}
      />

      {/* 2. Registration Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-rose-100 text-brand-800">
              Registration Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
              Reserve Your Complimentary Seat
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Admission is 100% free with prior online registration. Please submit your details below.
            </p>
          </div>

          <RegistrationForm onSuccess={(reg) => setSuccessRegistration(reg)} />
        </div>
      </section>

      {/* 3. Event Details, Speakers & Venue Section */}
      <section id="details" className="py-14 sm:py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Distinguished Guests
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
              Eminent Speakers & Guests
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Engaging sessions on faith, moral excellence, contemporary challenges, and women empowerment.
            </p>
          </div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-14">
            {SPEAKERS.map((spk, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 hover:shadow-md transition-all text-center group"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-xs text-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  {spk.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-ml">
                  {spk.name}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {spk.role}
                </p>
              </div>
            ))}
          </div>

          {/* Venue & Schedule Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Venue & Logistics
              </span>
              <h3 className="text-2xl font-bold">
                Choice Auditorium, Ulikkal
              </h3>
              <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                Nuchiyad Road, Ulikkal. Comfortable seating, prayer facilities, and dedicated resting spaces for sisters.
              </p>
              <div className="flex items-center gap-2 text-xs text-rose-200 pt-1 font-medium">
                <Clock className="w-4 h-4 text-rose-300" />
                <span>Saturday, 21 November 2026 • 9:30 AM – 4:00 PM</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center space-y-3">
              <p className="text-xs uppercase font-extrabold tracking-wider text-rose-200">
                Conference Slogan
              </p>
              <p className="text-base sm:text-lg font-bold leading-relaxed font-ml">
                "വിശ്വാസത്തിൽ കരുത്ത്... <br/>
                ആദർശത്തിൽ മാതൃക... <br/>
                ജീവിതത്തിൽ വിശുദ്ധി!"
              </p>
              <button
                onClick={() => scrollToSection("register")}
                className="w-full py-2.5 rounded-xl bg-white text-brand-900 hover:bg-rose-50 font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Success Confirmation Modal */}
      {successRegistration && (
        <SuccessModal
          registration={successRegistration}
          onClose={() => setSuccessRegistration(null)}
        />
      )}

    </main>
  );
};

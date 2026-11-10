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
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen
} from "lucide-react";

const SPEAKERS = [
  { name: "ഡോ. ജൗഹർ മുനവ്വർ", role: "പ്രമുഖ പ്രഭാഷകൻ & ചിന്തകൻ", icon: "🎙️" },
  { name: "ടി.കെ ഉബൈദ്", role: "പ്രഭാഷകൻ & എഴുത്തുകാരൻ", icon: "📖" },
  { name: "ഹാരിസ് കായക്കൊടി", role: "പ്രഭാഷകൻ", icon: "🎙️" },
  { name: "റഊഫ ടീച്ചർ", role: "വിദ്യാഭ്യാസ പ്രവർത്തക & പ്രഭാഷക", icon: "✨" },
  { name: "ഷഫീഖ് സ്വലാഹി", role: "പണ്ഡിതൻ & പ്രഭാഷകൻ", icon: "🎙️" },
  { name: "നജീബ ടീച്ചർ", role: "സാമൂഹിക പ്രവർത്തക & പ്രഭാഷക", icon: "✨" },
];

export const HomePage = ({ totalCount = 0 }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      
      {/* 1. Hero Section with Poster Details */}
      <HeroSection
        totalCount={totalCount}
        onRegisterClick={() => scrollToSection("register")}
      />

      {/* 2. Registration Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-rose-50/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-rose-100 text-rose-800">
              സൗജന്യ പ്രവേശനം
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              നിങ്ങളുടെ സീറ്റ് ഉറപ്പുവരുത്തുക
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              സമ്മേളനത്തിൽ പങ്കെടുക്കാൻ ആഗ്രഹിക്കുന്ന എല്ലാ വനിതകളും താഴെയുള്ള ഫോം പൂരിപ്പിച്ച് രജിസ്റ്റർ ചെയ്യുക.
            </p>
          </div>

          <RegistrationForm onSuccess={(reg) => setSuccessRegistration(reg)} />
        </div>
      </section>

      {/* 3. Event Details, Speakers & Venue Section */}
      <section id="details" className="py-16 sm:py-20 bg-white border-y border-rose-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              പങ്കെടുക്കുന്ന പ്രമുഖർ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              പ്രഭാഷകരും അതിഥികളും
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              വിശ്വാസം, വിജ്ഞാനം, കുടുംബം, വനിതാ ശാക്തീകരണം എന്നിവയെ അധികരിച്ച് പ്രമുഖർ സംസാരിക്കുന്നു.
            </p>
          </div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16">
            {SPEAKERS.map((spk, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-rose-300 hover:shadow-md transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-rose-100 shadow-xs text-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {spk.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {spk.name}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {spk.role}
                </p>
              </div>
            ))}
          </div>

          {/* Venue & Schedule Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#981b37] to-[#731227] text-white shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                വേദി വിവരങ്ങൾ
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം
              </h3>
              <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                നുച്ച്യാട് റോഡ്, ഉളിക്കൽ. സുഖപ്രദമായ ഇരിപ്പിടങ്ങൾ, നിസ്കാര സൗകര്യം, സ്ത്രീകൾക്കായുള്ള പ്രത്യേക വിശ്രമ മുറികൾ എന്നിവ സജ്ജീകരിച്ചിരിക്കുന്നു.
              </p>
              <div className="flex items-center gap-3 text-xs text-rose-200 pt-1 font-semibold">
                <Clock className="w-4 h-4" />
                <span>2026 നവംബർ 21 ശനി • രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-4">
              <p className="text-xs uppercase font-extrabold tracking-wider text-rose-200">
                സമ്മേളന സന്ദേശം
              </p>
              <p className="text-lg font-bold leading-relaxed">
                "വിശ്വാസത്തിൽ കരുത്ത്... <br/>
                ആദർശത്തിൽ മാതൃക... <br/>
                ജീവിതത്തിൽ വിശുദ്ധി!"
              </p>
              <button
                onClick={() => scrollToSection("register")}
                className="w-full py-3 rounded-xl bg-white text-[#981b37] hover:bg-rose-50 font-extrabold text-xs shadow-md transition-colors"
              >
                ഇപ്പോൾ തന്നെ രജിസ്റ്റർ ചെയ്യുക
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

import React, { useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { RegistrationForm } from "../components/RegistrationForm";
import { ParticipantsList } from "../components/ParticipantsList";
import { SuccessModal } from "../components/SuccessModal";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Utensils, 
  Award, 
  BookOpen, 
  Smile, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake
} from "lucide-react";

export const HomePage = ({ participants = [], loading = false }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  // Calculate live stats
  const total = participants.length;
  const foodCount = participants.filter(p => p.foodPreference === "Food Required").length;
  const uniquePlaces = new Set(participants.map(p => p.place ? p.place.trim() : "").filter(Boolean));
  const placesCount = uniquePlaces.size;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        stats={{ total, foodCount, placesCount }}
        onRegisterClick={() => scrollToSection("register")}
        onViewParticipantsClick={() => scrollToSection("participants")}
      />

      {/* 2. Registration Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-brand-100 text-brand-700">
              Quick & Easy
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Reserve Your Complimentary Seat
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Admission is 100% free with prior online registration. Instant digital pass provided upon submission.
            </p>
          </div>

          <RegistrationForm onSuccess={(reg) => setSuccessRegistration(reg)} />
        </div>
      </section>

      {/* 3. Event Details & Highlights Section */}
      <section id="details" className="py-16 sm:py-24 bg-white border-y border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80">
              Conference Agenda & Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Why Attend Women's Conference 2026?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Curated sessions focused on spiritual enrichment, entrepreneurship, mental wellness, and community leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Knowledge & Wisdom
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                In-depth masterclasses by prominent scholars, educationists, and community pioneers addressing contemporary life challenges.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Networking & Sisterhood
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect with like-minded women from diverse professions, students, and social workers. Build lasting friendships and collaborations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Hospitality & Comfort
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                State-of-the-art air-conditioned auditorium, dedicated mother-and-child spaces, prayer halls, and complimentary wholesome meals.
              </p>
            </div>

          </div>

          {/* Schedule Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Sessions Planned For Every Schedule
              </span>
              <h4 className="text-xl sm:text-2xl font-bold">
                Choose Your Preferred Session Time During Registration
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Morning (9am-1pm) • Afternoon (2pm-5pm) • Evening (5:30pm-8:30pm) • Full Day
              </p>
            </div>

            <button
              onClick={() => scrollToSection("register")}
              className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Register for Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Registered Participants Public Section */}
      <ParticipantsList
        participants={participants}
        loading={loading}
      />

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

import React, { useState } from "react";
import { RegistrationForm } from "../components/RegistrationForm";
import { SuccessModal } from "../components/SuccessModal";
import { ProgramDetailsModal } from "../components/ProgramDetailsModal";
import { 
  Sparkles, 
  Info,
  Calendar,
  MapPin,
  Heart
} from "lucide-react";

export const HomePage = ({ isDetailsOpen, setIsDetailsOpen }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  return (
    <main className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden font-ml">
      
      {/* Decorative subtle ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 -z-10 opacity-30 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-rose-300 via-amber-100 to-rose-200 rounded-full"></div>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-4">
        
        {/* Top Program Announcement Badge */}
        <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-700 animate-pulse shrink-0"></span>
            <span className="font-bold text-slate-800">
              2026 നവംബർ 21 ശനി • ഉളിക്കൽ
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-brand-900 hover:bg-brand-950 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <Info className="w-3.5 h-3.5 text-rose-300" />
            <span>പരിപാടി വിവരങ്ങൾ</span>
          </button>
        </div>

        {/* Focused Registration Form (Fully in Malayalam) */}
        <RegistrationForm
          onSuccess={(reg) => setSuccessRegistration(reg)}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />

        {/* Clean Footer Note */}
        <div className="text-center pt-2 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-brand-950">
            WISDOM WOMEN IRITTY ZONE • WISDOM ISLAMIC ORGANIZATION
          </p>
          <p className="text-[11px] text-slate-400">
            "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"
          </p>
        </div>

      </div>

      {/* Program Details Modal */}
      <ProgramDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onRegisterClick={() => {
          setIsDetailsOpen(false);
          const el = document.getElementById("register");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
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

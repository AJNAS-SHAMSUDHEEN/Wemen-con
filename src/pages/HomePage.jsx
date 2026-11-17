import React, { useState } from "react";
import { RegistrationForm } from "../components/RegistrationForm";
import { SuccessModal } from "../components/SuccessModal";
import { ProgramDetailsModal } from "../components/ProgramDetailsModal";
import { 
  Info,
  Calendar
} from "lucide-react";

export const HomePage = ({ isDetailsOpen, setIsDetailsOpen }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  return (
    <main className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden font-ml bg-white">
      
      {/* Decorative soft ambient lavender background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 -z-10 opacity-40 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-lavender-200 via-lavender-100 to-white rounded-full"></div>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-4">
        
        {/* Top Program Announcement Badge */}
        <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-lavender-200/90 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lavender-600 animate-pulse shrink-0"></span>
            <span className="font-bold text-slate-800">
              2026 നവംബർ 21 ശനി • ഉളിക്കൽ
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <Info className="w-3.5 h-3.5 text-lavender-100" />
            <span>പരിപാടി വിവരങ്ങൾ</span>
          </button>
        </div>

        {/* Focused Registration Form with Highlighted WhatsApp & Place */}
        <RegistrationForm
          onSuccess={(reg) => setSuccessRegistration(reg)}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />

        {/* Clean Lavender Footer Note */}
        <div className="text-center pt-3 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-lavender-900 tracking-wide">
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

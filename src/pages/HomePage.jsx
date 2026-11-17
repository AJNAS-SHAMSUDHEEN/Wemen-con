import React, { useState } from "react";
import { RegistrationForm } from "../components/RegistrationForm";
import { SuccessModal } from "../components/SuccessModal";
import { ProgramDetailsModal } from "../components/ProgramDetailsModal";

export const HomePage = ({ isDetailsOpen, setIsDetailsOpen }) => {
  const [successRegistration, setSuccessRegistration] = useState(null);

  return (
    <main className="min-h-[85vh] flex flex-col justify-center items-center px-3 sm:px-4 py-6 sm:py-10 relative overflow-hidden font-ml bg-slate-50/50">
      
      {/* Decorative soft ambient lavender background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 -z-10 opacity-35 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-lavender-200 via-lavender-100 to-white rounded-full"></div>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-4">

        {/* Google Forms-styled Registration Form with Highlighted Questions */}
        <RegistrationForm
          onSuccess={(reg) => setSuccessRegistration(reg)}
          onOpenDetails={() => setIsDetailsOpen(true)}
        />

        {/* Clean Lavender Footer Note */}
        <div className="text-center pt-4 text-xs text-slate-500 space-y-1">
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

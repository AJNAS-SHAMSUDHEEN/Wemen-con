import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Printer,
  X,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Baby,
  GraduationCap
} from "lucide-react";
import { formatDisplayPhone } from "../utils/validators";
import { generateSelfConfirmationShare } from "../services/whatsappService";

export const SuccessModal = ({ registration, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#8464bf', '#997ecc', '#b4a0dc', '#10b981']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!registration) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(registration.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = generateSelfConfirmationShare(registration);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn font-ml">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-lavender-200 overflow-hidden">

        {/* Header Ribbon - Elegant Lavender */}
        <div className="bg-gradient-to-r from-lavender-700 via-lavender-600 to-lavender-500 p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-0.5 rounded-full">
            പ്രവേശനം ഉറപ്പിച്ചു
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-1.5">
            രജിസ്ട്രേഷൻ വിജയകരം!
          </h3>
          <p className="text-lavender-100 text-xs sm:text-sm mt-1">
            വനിതാ സമ്മേളനത്തിലേക്ക് സ്വാഗതം.
          </p>
        </div>

        {/* Modal Printable Card Body */}
        <div id="printable-pass" className="p-6 space-y-4 bg-white">

          {/* Unique ID Highlight Box */}
          <div className="p-4 rounded-2xl bg-lavender-50/80 border border-lavender-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-lavender-700">
                റജിസ്ട്രേഷൻ ഐഡി (ID)
              </p>
              <p className="text-xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
                {registration.registrationId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-lavender-50 border border-lavender-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">കോപ്പി ചെയ്തു</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>കോപ്പി</span>
                </>
              )}
            </button>
          </div>

          {/* Conference Details Banner */}
          <div className="p-3.5 rounded-2xl bg-lavender-50/60 border border-lavender-200 text-xs space-y-1">
            <p className="font-extrabold text-slate-900 text-sm">
              ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
            </p>
            <p className="text-[11px] text-lavender-800 italic">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"
            </p>
            <div className="flex items-center gap-2 text-slate-600 pt-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-lavender-700 shrink-0" />
              <span>2026 നവംബർ 21 ശനി (രാവിലെ 9:30 – വൈകിട്ട് 4:00)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-lavender-700 shrink-0" />
              <span>ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ</span>
            </div>
          </div>

          {/* Participant Details Summary */}
          <div className="space-y-2.5 rounded-2xl border border-lavender-200 p-3.5 bg-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-lavender-500" />
                <span>പങ്കെടുക്കുന്നയാൾ</span>
              </span>
              <span className="font-bold text-slate-900">{registration.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-lavender-500" />
                <span>മൊബൈൽ</span>
              </span>
              <span className="font-bold text-slate-900">
                {formatDisplayPhone(registration.phoneNumber)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-lavender-500" />
                <span>സ്ഥലം</span>
              </span>
              <span className="font-bold text-slate-900">{registration.place}</span>
            </div>

            {Number(registration.childrenCount) > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-lavender-600" />
                  <span>കൂടെയുള്ള കുട്ടികൾ</span>
                </span>
                <span className="font-extrabold text-lavender-900 bg-lavender-100 px-2 py-0.5 rounded-md text-[11px]">
                  {registration.childrenCount} പേർ
                </span>
              </div>
            )}

            {Array.isArray(registration.teenspaceStudents) && registration.teenspaceStudents.length > 0 && (
              <div className="border-t border-slate-100 pt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-lavender-600" />
                    <span>Teenspace വിദ്യാർത്ഥികൾ</span>
                  </span>
                  <span className="font-extrabold text-lavender-900 bg-lavender-100 px-2 py-0.5 rounded-md text-[11px]">
                    {registration.teenspaceStudents.length} പേർ
                  </span>
                </div>
                <div className="pl-5 space-y-1">
                  {registration.teenspaceStudents.map((st, idx) => (
                    <p key={idx} className="text-[11px] font-medium text-slate-700 flex items-center justify-between">
                      <span>• {st.name}</span>
                      <span className="text-lavender-800 font-bold bg-lavender-50 px-1.5 py-0.2 rounded border border-lavender-200">
                        Class {st.classGrade}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>വാട്സ്ആപ്പിൽ പാസ്സ് ഷെയർ ചെയ്യുക</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>പ്രിന്റ് പാസ്സ്</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-lavender-900 bg-lavender-100 hover:bg-lavender-200 border border-lavender-300 transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>പൂർത്തിയായി</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

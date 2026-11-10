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
  Utensils, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Sparkles
} from "lucide-react";
import { formatDisplayPhone } from "../utils/validators";
import { generateSelfConfirmationShare } from "../services/whatsappService";

export const SuccessModal = ({ registration, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a81b3d', '#df4668', '#10b981', '#fbbf24']
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-0.5 rounded-full">
            Confirmed
          </span>
          <h3 className="text-xl font-bold mt-1.5">
            Registration Successful!
          </h3>
          <p className="text-emerald-100 text-xs mt-1">
            Welcome to the Women's Conference 2026.
          </p>
        </div>

        {/* Modal Printable Card Body */}
        <div id="printable-pass" className="p-6 space-y-4">
          
          {/* Unique ID Highlight Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Registration ID
              </p>
              <p className="text-xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
                {registration.registrationId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Conference Details Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs space-y-1">
            <p className="font-extrabold text-brand-900 text-sm">
              ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
            </p>
            <p className="text-[11px] text-brand-700 italic font-ml">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"
            </p>
            <div className="flex items-center gap-2 text-slate-600 pt-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>Saturday, 21 November 2026 (9:30 AM – 4:00 PM)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>Choice Auditorium, Nuchiyad Road, Ulikkal</span>
            </div>
          </div>

          {/* Participant Details Summary */}
          <div className="space-y-2 rounded-2xl border border-slate-200 p-3.5 bg-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Participant</span>
              </span>
              <span className="font-bold text-slate-900">{registration.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile</span>
              </span>
              <span className="font-bold text-slate-900">
                {formatDisplayPhone(registration.phoneNumber)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Place</span>
              </span>
              <span className="font-bold text-slate-900">{registration.place}</span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-400" />
                <span>Food Preference</span>
              </span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                registration.foodPreference === "Food Required"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {registration.foodPreference}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Pass via WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Pass</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>Done</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

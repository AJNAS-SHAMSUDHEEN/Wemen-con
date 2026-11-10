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
  Sparkles,
  ExternalLink
} from "lucide-react";
import { getGoogleMapsUrl } from "../utils/formatters";
import { formatDisplayPhone } from "../utils/validators";
import { generateSelfConfirmationShare } from "../services/whatsappService";

export const SuccessModal = ({ registration, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#981b37', '#d62254', '#10b981', '#fbbf24']
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

  const mapsUrl = registration.hasGpsLocation
    ? getGoogleMapsUrl(registration.latitude, registration.longitude)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest bg-white/25 px-3 py-1 rounded-full">
            പ്രവേശനം ഉറപ്പിച്ചു
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-2">
            രജിസ്ട്രേഷൻ വിജയകരം!
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            അസ്സലാമു അലൈക്കും! വനിതാ സമ്മേളനത്തിലേക്ക് സ്വാഗതം.
          </p>
        </div>

        {/* Modal Printable Card Body */}
        <div id="printable-pass" className="p-6 sm:p-7 space-y-4">
          
          {/* Unique ID Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Registration ID
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {registration.registrationId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 shadow-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-rose-600" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Conference Details Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <p className="font-extrabold text-slate-900 text-sm">
              ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
            </p>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>2026 നവംബർ 21 ശനി (9:30 AM - 4:00 PM)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ</span>
            </div>
          </div>

          {/* Participant Details Summary */}
          <div className="space-y-2.5 rounded-2xl border border-slate-200/80 p-4 bg-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>പങ്കെടുക്കുന്നയാൾ</span>
              </span>
              <span className="font-bold text-slate-900">{registration.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>മൊബൈൽ നമ്പർ</span>
              </span>
              <span className="font-bold text-slate-900">
                {formatDisplayPhone(registration.phoneNumber)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>സ്ഥലം</span>
              </span>
              <span className="font-bold text-slate-900">{registration.place}</span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Utensils className="w-3.5 h-3.5 text-slate-400" />
                <span>ഭക്ഷണ സൗകര്യം</span>
              </span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                registration.foodPreference === "Food Required"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {registration.foodPreference === "Food Required" ? "ഭക്ഷണം ആവശ്യമുണ്ട്" : "ഭക്ഷണം ആവശ്യമില്ല"}
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Share & Print Pass */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>വാട്ട്‌സ്ആപ്പിൽ പാസ്സ് ഷെയർ ചെയ്യുക</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>പ്രിന്റ് / സേവ് പാസ്സ്</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center"
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

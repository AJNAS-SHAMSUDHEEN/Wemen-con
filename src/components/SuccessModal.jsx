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
  Clock, 
  Phone, 
  User, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { formatDateTime, getGoogleMapsUrl } from "../utils/formatters";
import { formatDisplayPhone } from "../utils/validators";
import { generateSelfConfirmationShare, getWhatsAppUrl } from "../services/whatsappService";

export const SuccessModal = ({ registration, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#10b981', '#6366f1', '#fbbf24']
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top ribbon banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest bg-white/25 px-3 py-1 rounded-full">
            Seat Confirmed
          </span>
          <h3 className="text-2xl font-black mt-2">
            Registration Successful!
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Assalamu Alaikum! Welcome to the Women's Conference 2026.
          </p>
        </div>

        {/* Modal Printable Card Body */}
        <div id="printable-pass" className="p-6 sm:p-7 space-y-5">
          
          {/* Unique ID Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-pink-50/60 border border-brand-200/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                Unique Registration ID
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {registration.registrationId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 shadow-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-brand-600" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Participant Details Summary */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Participant Name</span>
              </span>
              <span className="font-bold text-slate-900">{registration.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Mobile Number</span>
              </span>
              <span className="font-bold text-slate-900">
                {formatDisplayPhone(registration.phoneNumber)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location / Place</span>
              </span>
              <span className="font-bold text-slate-900">{registration.place}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <Utensils className="w-3.5 h-3.5 text-slate-400" />
                <span>Food Preference</span>
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                registration.foodPreference === "Food Required"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {registration.foodPreference}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Session</span>
              </span>
              <span className="font-semibold text-slate-800 text-xs text-right max-w-[200px]">
                {registration.preferredTime}
              </span>
            </div>

            {/* GPS coordinates if available */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 flex items-center gap-1.5 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>GPS Location Status</span>
              </span>
              {registration.hasGpsLocation ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span>Coordinates Saved</span>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 inline-flex items-center"
                      title="View on Google Maps"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-medium">Manual Place Stored</span>
              )}
            </div>
          </div>

          {/* Action Buttons: WhatsApp Share & Print Pass */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Pass via WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print / Save Pass</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center justify-center"
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


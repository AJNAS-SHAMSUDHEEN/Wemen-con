import React, { useState, useEffect } from "react";
import { 
  X, 
  Send, 
  MessageCircle, 
  Edit3, 
  User, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone
} from "lucide-react";
import { 
  DEFAULT_REMINDER_TEMPLATE, 
  GENERAL_ANNOUNCEMENT_TEMPLATE, 
  generateMessage, 
  openWhatsApp,
  getWhatsAppUrl
} from "../services/whatsappService";
import { formatForWhatsApp, formatDisplayPhone } from "../utils/validators";

export const WhatsAppModal = ({ 
  isOpen, 
  onClose, 
  participant, 
  selectedParticipants = [] 
}) => {
  if (!isOpen) return null;

  // Decide mode: single participant or bulk selected
  const isBulkMode = selectedParticipants && selectedParticipants.length > 0;
  const list = isBulkMode ? selectedParticipants : (participant ? [participant] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [template, setTemplate] = useState(DEFAULT_REMINDER_TEMPLATE);
  const [customMessage, setCustomMessage] = useState("");
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const activeParticipant = list[currentIndex] || null;

  useEffect(() => {
    if (activeParticipant) {
      setCustomMessage(generateMessage(template, activeParticipant));
    }
  }, [activeParticipant, template]);

  const handleTemplateChange = (tpl) => {
    setTemplate(tpl);
    if (activeParticipant) {
      setCustomMessage(generateMessage(tpl, activeParticipant));
    }
  };

  const handleLaunchWhatsApp = () => {
    if (!activeParticipant) return;
    openWhatsApp(activeParticipant.phoneNumber, customMessage);
  };

  const handleNextInQueue = () => {
    if (currentIndex < list.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (list[nextIdx]) {
        setCustomMessage(generateMessage(template, list[nextIdx]));
      }
    }
  };

  const handlePrevInQueue = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (list[prevIdx]) {
        setCustomMessage(generateMessage(template, list[prevIdx]));
      }
    }
  };

  const previewWaUrl = activeParticipant 
    ? getWhatsAppUrl(activeParticipant.phoneNumber, customMessage)
    : "";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isBulkMode ? "WhatsApp Bulk Reminder Queue" : "Send WhatsApp Reminder"}
              </h3>
              <p className="text-emerald-100 text-xs">
                {isBulkMode 
                  ? `Sending reminders to ${list.length} selected participant(s)` 
                  : "Preview and edit personalized message before opening WhatsApp"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          {/* Active Participant Info Card */}
          {activeParticipant && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {activeParticipant.fullName}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {activeParticipant.registrationId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Phone className="w-3 h-3" />
                    <span>{formatDisplayPhone(activeParticipant.phoneNumber)}</span>
                  </span>
                  <span>•</span>
                  <span>{activeParticipant.place}</span>
                  <span>•</span>
                  <span>{activeParticipant.foodPreference}</span>
                </div>
              </div>

              {isBulkMode && (
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">
                    Queue {currentIndex + 1} of {list.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Message Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTemplateChange(DEFAULT_REMINDER_TEMPLATE)}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                  template === DEFAULT_REMINDER_TEMPLATE
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Friendly Reminder
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange(GENERAL_ANNOUNCEMENT_TEMPLATE)}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                  template === GENERAL_ANNOUNCEMENT_TEMPLATE
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Venue & Timing Notice
              </button>
            </div>
          </div>

          {/* Message Editor / Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Message Content (Editable)
              </label>
              <span className="text-[11px] text-slate-400">
                International format: +91
              </span>
            </div>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <button
              onClick={handleLaunchWhatsApp}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp (wa.me)</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </button>

            {/* If Bulk Mode: Stepper controls */}
            {isBulkMode && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handlePrevInQueue}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  {currentIndex + 1} / {list.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleNextInQueue}
                  disabled={currentIndex === list.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <span>Next Participant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <p className="text-[11px] text-center text-slate-400 leading-normal">
              Note: Clicking this will open WhatsApp web/app with the message pre-filled. You must press <strong>Send</strong> manually inside WhatsApp.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

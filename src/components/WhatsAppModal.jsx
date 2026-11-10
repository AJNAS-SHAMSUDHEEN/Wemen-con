import React, { useState, useEffect } from "react";
import { 
  X, 
  MessageCircle, 
  ChevronRight,
  Phone,
  ExternalLink
} from "lucide-react";
import { 
  DEFAULT_REMINDER_TEMPLATE, 
  GENERAL_ANNOUNCEMENT_TEMPLATE, 
  generateMessage, 
  openWhatsApp,
  getWhatsAppUrl
} from "../services/whatsappService";
import { formatDisplayPhone } from "../utils/validators";

export const WhatsAppModal = ({ 
  isOpen, 
  onClose, 
  participant, 
  selectedParticipants = [] 
}) => {
  if (!isOpen) return null;

  const isBulkMode = selectedParticipants && selectedParticipants.length > 0;
  const list = isBulkMode ? selectedParticipants : (participant ? [participant] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [template, setTemplate] = useState(DEFAULT_REMINDER_TEMPLATE);
  const [customMessage, setCustomMessage] = useState("");

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
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
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {/* Active Participant Info Card */}
          {activeParticipant && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {activeParticipant.fullName}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
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
                  <span className="text-xs font-bold text-slate-600">
                    {currentIndex + 1} of {list.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Template Selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTemplateChange(DEFAULT_REMINDER_TEMPLATE)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  template === DEFAULT_REMINDER_TEMPLATE
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Friendly Reminder
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange(GENERAL_ANNOUNCEMENT_TEMPLATE)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  template === GENERAL_ANNOUNCEMENT_TEMPLATE
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Speakers & Venue Notice
              </button>
            </div>
          </div>

          {/* Message Editor / Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Message Content (Editable)
              </label>
            </div>
            <textarea
              rows={5}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={handleLaunchWhatsApp}
              className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp (wa.me)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isBulkMode && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handlePrevInQueue}
                  disabled={currentIndex === 0}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  {currentIndex + 1} / {list.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleNextInQueue}
                  disabled={currentIndex === list.length - 1}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Participant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

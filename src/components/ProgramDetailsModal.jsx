import React from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2,
  BookOpen
} from "lucide-react";

const SPEAKERS = [
  { name: "ഡോ. ജൗഹർ മുനവ്വർ", role: "പ്രമുഖ പ്രഭാഷകൻ & ചിന്തകൻ", icon: "🎙️" },
  { name: "ടി.കെ ഉബൈദ്", role: "പ്രഭാഷകൻ & എഴുത്തുകാരൻ", icon: "📖" },
  { name: "ഹാരിസ് കായക്കൊടി", role: "പ്രഭാഷകൻ", icon: "🎙️" },
  { name: "റഊഫ ടീച്ചർ", role: "വിദ്യാഭ്യാസ പ്രവർത്തക & പ്രഭാഷക", icon: "✨" },
  { name: "ഷഫീഖ് സ്വലാഹി", role: "പണ്ഡിതൻ & പ്രഭാഷകൻ", icon: "🎙️" },
  { name: "നജീബ ടീച്ചർ", role: "സാമൂഹിക പ്രവർത്തക & പ്രഭാഷക", icon: "✨" },
];

export const ProgramDetailsModal = ({ isOpen, onClose, onRegisterClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full">
              പ്രോഗ്രാം വിവരങ്ങൾ
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 font-ml">
              ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto font-ml">
          
          {/* Slogan Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
            <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
              വിശ്വാസം • വിജ്ഞാനം • വിമോചനം
            </p>
            <p className="text-base sm:text-lg font-black text-brand-900 leading-relaxed">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"
            </p>
          </div>

          {/* Date, Time & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-brand-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">തീയതി & സമയം</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">2026 നവംബർ 21 ശനി</p>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">വേദി</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം</p>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  നുച്ച്യാട് റോഡ്, ഉളിക്കൽ
                </p>
              </div>
            </div>
          </div>

          {/* Poster Image Preview */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src="/poster.jpg"
              alt="ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം പോസ്റ്റർ"
              className="w-full h-auto object-cover max-h-80 mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Speakers Section */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
              <span>പങ്കെടുക്കുന്ന പ്രമുഖർ</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SPEAKERS.map((spk, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center"
                >
                  <span className="text-base">{spk.icon}</span>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mt-1">
                    {spk.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {spk.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Organizers & Welcome Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white text-center space-y-1">
            <p className="text-xs font-bold text-rose-300">
              WISDOM WOMEN IRITTY ZONE • WISDOM ISLAMIC ORGANIZATION • WISDOM Girls
            </p>
            <p className="text-sm font-extrabold text-emerald-400 pt-0.5">
              മുഴുവൻ സ്ത്രീകൾക്കും സ്നേഹപൂർവ്വം സ്വാഗതം
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                if (onRegisterClick) onRegisterClick();
              }}
              className="w-full py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer text-center"
            >
              രജിസ്ട്രേഷൻ ഫോമിലേക്ക് പോകുക
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

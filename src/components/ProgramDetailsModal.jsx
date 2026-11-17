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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-lavender-200 overflow-hidden my-6">
        
        {/* Modal Top Header - Soft Lavender */}
        <div className="bg-gradient-to-r from-lavender-700 via-lavender-600 to-lavender-500 px-6 py-5 text-white flex items-center justify-between">
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
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto font-ml bg-white">
          
          {/* Slogan Banner */}
          <div className="p-4 rounded-2xl bg-lavender-50 border border-lavender-200 text-center space-y-1">
            <p className="text-xs uppercase font-extrabold text-lavender-700 tracking-wider">
              വിശ്വാസം • വിജ്ഞാനം • വിമോചനം
            </p>
            <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"
            </p>
          </div>

          {/* Date, Time & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-4 rounded-2xl bg-lavender-50/60 border border-lavender-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender-200 text-lavender-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-lavender-700">തീയതി & സമയം</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">2026 നവംബർ 21 ശനി</p>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-lavender-600" />
                  <span>രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-lavender-50/60 border border-lavender-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavender-200 text-lavender-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-lavender-700">സ്ഥലം (Venue)</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം</p>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  നുച്ച്യാട് റോഡ്, ഉളിക്കൽ, കണ്ണൂർ
                </p>
              </div>
            </div>
          </div>

          {/* Official Event Poster */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>ഔദ്യോഗിക പോസ്റ്റർ</span>
            </p>
            <div className="rounded-2xl border border-lavender-200 overflow-hidden bg-slate-50 shadow-xs flex justify-center">
              <img
                src="/poster.jpg"
                alt="Women's Conference Poster"
                className="w-full max-w-md h-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Key Speakers Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-lavender-700" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                പങ്കെടുക്കുന്ന പ്രമുഖർ (Speakers)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPEAKERS.map((sp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-lavender-50/50 border border-lavender-200/80 flex items-center gap-3"
                >
                  <span className="text-xl shrink-0 p-1.5 bg-white rounded-xl shadow-2xs border border-lavender-200">
                    {sp.icon}
                  </span>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{sp.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{sp.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration CTA inside modal */}
          <div className="pt-2">
            <button
              onClick={onRegisterClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-lavender-600 hover:bg-lavender-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lavender-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>രജിസ്ട്രേഷൻ ഫോമിലേക്ക് പോകുക</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

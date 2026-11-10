import React from "react";
import { Heart, ShieldCheck, MapPin, Calendar, Clock, Phone } from "lucide-react";

export const Footer = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Organization */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-[#981b37] text-white flex items-center justify-center font-serif italic text-base">
                W
              </span>
              <span className="font-black text-xl text-white tracking-tight">
                വനിതാ സമ്മേളനം 2026
              </span>
            </div>
            <p className="text-xs font-bold text-rose-400">
              WISDOM WOMEN IRITTY ZONE • WISDOM ISLAMIC ORGANIZATION
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!" — വിശ്വാസം, വിജ്ഞാനം, വിമോചനം എന്നിവ മുൻനിർത്തി സംഘടിപ്പിക്കുന്ന ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം.
            </p>
          </div>

          {/* Event Details from Poster */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">
              സമ്മേളന വിവരങ്ങൾ
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>2026 നവംബർ 21 ശനി</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>രാവിലെ 9:30 മുതൽ വൈകിട്ട് 4:00 വരെ</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ</span>
              </li>
            </ul>
          </div>

          {/* Admin Control Link */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">
              അഡ്മിനിസ്ട്രേഷൻ
            </h4>
            <div className="space-y-3">
              <button
                onClick={onAdminClick}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>അഡ്മിൻ ഡാഷ്‌ബോർഡ്</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                രജിസ്ട്രേഷൻ വിവരങ്ങൾ പരിശോധിക്കാൻ അഡ്മിന്മാർ മാത്രം ലോഗിൻ ചെയ്യുക.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © 2026 Wisdom Women Iritty Zone. മുഴുവൻ സ്ത്രീകൾക്കും സ്വാഗതം.
          </p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-slate-400">Cloud Firestore</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

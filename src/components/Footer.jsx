import React from "react";
import { ShieldCheck, MapPin, Calendar, Clock, Phone, Mail } from "lucide-react";

export const Footer = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Organization */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center font-serif italic text-base">
                W
              </span>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Women's Conference 2026
              </span>
            </div>
            <p className="text-xs font-bold text-rose-400">
              WISDOM WOMEN IRITTY ZONE • WISDOM ISLAMIC ORGANIZATION
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md font-ml">
              "വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!" — ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം.
            </p>
          </div>

          {/* Event Details from Poster */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
              Event Information
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Saturday, 21 November 2026</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>9:30 AM – 4:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Choice Auditorium, Ulikkal</span>
              </li>
            </ul>
          </div>

          {/* Admin Control Link */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
              Administration
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={onAdminClick}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin Portal</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Restricted to authorized event organizers
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            © 2026 Wisdom Women Iritty Zone. All rights reserved.
          </p>
          <p className="flex items-center gap-1 font-ml">
            <span>മുഴുവൻ സ്ത്രീകൾക്കും സ്വാഗതം</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

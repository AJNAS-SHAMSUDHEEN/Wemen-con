import React from "react";
import { Sparkles, Heart, ShieldCheck, Phone, MapPin, Mail, MessageCircle } from "lucide-react";

export const Footer = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Women's Conference 2026
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A landmark gathering dedicated to uplifting, educating, and connecting women across diverse spheres. Fostering faith, leadership, professional excellence, and community impact.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Backed by Cloud Firestore Real-time Infrastructure</span>
            </div>
          </div>

          {/* Quick Info & Schedule */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4">
              Event Details
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Grand Convention Center, Kerala, India</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Helpdesk: +91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>info@womensconference.com</span>
              </li>
            </ul>
          </div>

          {/* Links & Admin Access */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4">
              Administration
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  onClick={onAdminClick}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-2 font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>Admin Control Center</span>
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210?text=Hello,%20I%20have%20an%20inquiry%20regarding%20the%20Women's%20Conference."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Helpdesk on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 Women's Conference Organizing Committee. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for community empowerment</span>
          </p>
        </div>
      </div>
    </footer>
  );
};


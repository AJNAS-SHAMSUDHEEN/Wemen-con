import React from "react";
import { MapPin, Utensils, Clock, CheckCircle2 } from "lucide-react";
import { getRelativeTime } from "../utils/formatters";

// Generate avatar gradient based on initials
const getGradient = (name = "") => {
  const gradients = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-rose-500 to-amber-500",
    "from-teal-500 to-emerald-500",
    "from-fuchsia-500 to-pink-500",
    "from-brand-600 to-rose-400",
  ];
  const charCode = name.charCodeAt(0) || 0;
  return gradients[charCode % gradients.length];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || "WC").toUpperCase();
};

export const ParticipantCard = ({ participant }) => {
  const initials = getInitials(participant.fullName);
  const gradient = getGradient(participant.fullName);
  const timeAgo = getRelativeTime(participant.registrationDate);

  const isFoodRequired = participant.foodPreference === "Food Required";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar: Avatar, Name, Time Ago */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${gradient} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-slate-900 text-base truncate">
                {participant.fullName}
              </h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{participant.place}</span>
              {timeAgo && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400">{timeAgo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges: Food Preference & Session Time */}
        <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
              <Utensils className="w-3 h-3" />
              <span>Hospitality</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              isFoodRequired
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : "bg-amber-50 text-amber-700 border border-amber-200/80"
            }`}>
              {participant.foodPreference || "Food Required"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>Session</span>
            </span>
            <span className="font-semibold text-slate-700 text-[11px] truncate max-w-[170px]" title={participant.preferredTime}>
              {participant.preferredTime || "General"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Pill */}
      <div className="mt-4 pt-2.5 border-t border-slate-100/70 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>ID: {participant.registrationId}</span>
        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Seat Confirmed</span>
        </span>
      </div>
    </div>
  );
};

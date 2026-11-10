import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Utensils, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ParticipantCard } from "./ParticipantCard";

export const ParticipantsList = ({ participants = [], loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFood, setFilterFood] = useState("all"); // "all" | "Food Required" | "Food Not Required"
  const [filterPlace, setFilterPlace] = useState("all");
  const [displayCount, setDisplayCount] = useState(9);

  // Extract unique places
  const uniquePlaces = useMemo(() => {
    const places = participants
      .map(p => p.place ? p.place.trim() : "")
      .filter(Boolean);
    return Array.from(new Set(places)).sort();
  }, [participants]);

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = !search ||
        (p.fullName && p.fullName.toLowerCase().includes(search)) ||
        (p.place && p.place.toLowerCase().includes(search)) ||
        (p.registrationId && p.registrationId.toLowerCase().includes(search));

      // Food filter
      const matchesFood = filterFood === "all" || p.foodPreference === filterFood;

      // Place filter
      const matchesPlace = filterPlace === "all" || 
        (p.place && p.place.toLowerCase().trim() === filterPlace.toLowerCase().trim());

      return matchesSearch && matchesFood && matchesPlace;
    });
  }, [participants, searchTerm, filterFood, filterPlace]);

  const visibleList = filteredParticipants.slice(0, displayCount);
  const hasMore = displayCount < filteredParticipants.length;

  return (
    <section id="participants" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200/60 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Firestore Real-Time Sync</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Registered Participants
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Meet the inspiring women joining us for the conference. Updated in real-time as new attendees register.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <Users className="w-5 h-5 text-brand-600" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {participants.length} <span className="text-xs font-semibold text-slate-500">Participants</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm mb-8 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by participant name, place, or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
            />
          </div>

          {/* Place Filter Dropdown */}
          <div className="w-full md:w-52">
            <select
              value={filterPlace}
              onChange={(e) => setFilterPlace(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-sm font-medium text-slate-700 outline-none focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Places ({uniquePlaces.length})</option>
              {uniquePlaces.map((pl) => (
                <option key={pl} value={pl}>
                  {pl}
                </option>
              ))}
            </select>
          </div>

          {/* Food Filter Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={filterFood}
              onChange={(e) => setFilterFood(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-sm font-medium text-slate-700 outline-none focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Food Choices</option>
              <option value="Food Required">Food Required</option>
              <option value="Food Not Required">Food Not Required</option>
            </select>
          </div>

        </div>

        {/* Security & Privacy Notice */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Phone numbers and exact GPS locations are protected and visible solely to verified administrators.</span>
          </div>
          <span className="font-bold text-slate-600 hidden sm:inline">
            Showing {visibleList.length} of {filteredParticipants.length}
          </span>
        </div>
      </div>

      {/* Participants Grid */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Syncing participants from Firestore...</p>
        </div>
      ) : visibleList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleList.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Participants Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || filterFood !== "all" || filterPlace !== "all"
              ? "No participants match the selected filter criteria. Try clearing filters."
              : "Be the first to register! Fill out the registration form above to confirm your seat."}
          </p>
          {(searchTerm || filterFood !== "all" || filterPlace !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterFood("all");
                setFilterPlace("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setDisplayCount(prev => prev + 9)}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
          >
            <span>Load More Participants ({filteredParticipants.length - displayCount} remaining)</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

    </section>
  );
};

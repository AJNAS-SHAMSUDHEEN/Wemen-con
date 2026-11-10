import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Utensils, 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  MessageCircle, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  LogOut,
  Layers,
  ArrowUpDown,
  Navigation
} from "lucide-react";
import { 
  subscribeToAllRegistrations, 
  updateRegistration, 
  deleteRegistration 
} from "../services/registrationService";
import { exportToCSV, exportToJSON } from "../utils/exportUtils";
import { formatDateTime, formatDateOnly, getGoogleMapsUrl } from "../utils/formatters";
import { formatDisplayPhone } from "../utils/validators";
import { WhatsAppModal } from "../components/WhatsAppModal";
import { useAuth } from "../context/AuthContext";

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterFood, setFilterFood] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" (newest) or "asc" (oldest)

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modals state
  const [viewParticipant, setViewParticipant] = useState(null);
  const [editParticipant, setEditParticipant] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // WhatsApp modal state
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppTargetParticipant, setWhatsAppTargetParticipant] = useState(null);
  const [whatsAppSelectedList, setWhatsAppSelectedList] = useState([]);

  // Subscribe to real-time registrations from Cloud Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAllRegistrations(
      (data) => {
        setRegistrations(data);
        setLoading(false);
      },
      (err) => {
        console.error("Dashboard error:", err);
        setError("Failed to fetch registrations from Firebase. Check Firestore security rules or connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = registrations.length;
    const foodReq = registrations.filter(r => r.foodPreference === "Food Required").length;
    const foodNotReq = total - foodReq;
    
    // Unique places
    const placesSet = new Set(registrations.map(r => r.place ? r.place.trim() : "").filter(Boolean));
    const totalPlaces = placesSet.size;

    // Today's registrations
    const now = new Date();
    const todayStr = now.toDateString();
    const todayCount = registrations.filter(r => {
      if (!r.registrationDate) return false;
      let d;
      if (r.registrationDate.toDate) d = r.registrationDate.toDate();
      else d = new Date(r.registrationDate);
      return d.toDateString() === todayStr;
    }).length;

    return {
      total,
      foodReq,
      foodNotReq,
      foodPercentage: total > 0 ? Math.round((foodReq / total) * 100) : 0,
      totalPlaces,
      todayCount,
    };
  }, [registrations]);

  // Unique lists for dropdowns
  const uniquePlaces = useMemo(() => {
    const set = new Set(registrations.map(r => r.place ? r.place.trim() : "").filter(Boolean));
    return Array.from(set).sort();
  }, [registrations]);

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        // Search by Name or Phone
        const search = searchTerm.toLowerCase().trim();
        const matchesSearch = !search ||
          (r.fullName && r.fullName.toLowerCase().includes(search)) ||
          (r.phoneNumber && r.phoneNumber.includes(search)) ||
          (r.registrationId && r.registrationId.toLowerCase().includes(search)) ||
          (r.place && r.place.toLowerCase().includes(search));

        // Place filter
        const matchesPlace = filterPlace === "all" ||
          (r.place && r.place.trim().toLowerCase() === filterPlace.trim().toLowerCase());

        // Food filter
        const matchesFood = filterFood === "all" || r.foodPreference === filterFood;

        // Time slot filter
        const matchesTime = filterTime === "all" || r.preferredTime === filterTime;

        // Status filter
        const matchesStatus = filterStatus === "all" || (r.status || "Confirmed") === filterStatus;

        return matchesSearch && matchesPlace && matchesFood && matchesTime && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate || 0);
        const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [registrations, searchTerm, filterPlace, filterFood, filterTime, filterStatus, sortOrder]);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRegistrations.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRegistration(id, { status: newStatus });
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Bulk Status change
  const handleBulkStatusChange = async (newStatus) => {
    if (!selectedIds.size) return;
    try {
      const promises = Array.from(selectedIds).map(id => updateRegistration(id, { status: newStatus }));
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (err) {
      alert("Error updating some participants: " + err.message);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteRegistration(id);
      setDeleteConfirmId(null);
      if (selectedIds.has(id)) {
        const next = new Set(selectedIds);
        next.delete(id);
        setSelectedIds(next);
      }
    } catch (err) {
      alert("Failed to delete registration: " + err.message);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected registrations? This cannot be undone.`)) {
      return;
    }
    try {
      const promises = Array.from(selectedIds).map(id => deleteRegistration(id));
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to delete some registrations: " + err.message);
    }
  };

  // Open WhatsApp for single
  const triggerWhatsAppSingle = (participant) => {
    setWhatsAppTargetParticipant(participant);
    setWhatsAppSelectedList([]);
    setWhatsAppModalOpen(true);
  };

  // Open WhatsApp for selected
  const triggerWhatsAppBulk = () => {
    const list = registrations.filter(r => selectedIds.has(r.id));
    if (!list.length) {
      alert("Please select at least one participant using checkboxes.");
      return;
    }
    setWhatsAppTargetParticipant(null);
    setWhatsAppSelectedList(list);
    setWhatsAppModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      
      {/* Top Admin Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Admin Control Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Cloud Firestore
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <span className="font-semibold text-slate-800">{currentUser?.email || "Admin"}</span>
            </p>
          </div>

          {/* Top Actions: Export CSV, Excel, Bulk WhatsApp */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => exportToCSV(filteredRegistrations)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(filteredRegistrations)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
              title="Download JSON format"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={triggerWhatsAppBulk}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Firestore Connection Alert</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* 1. Statistic Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span>
              <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Confirmed participants</p>
            </div>
          </div>

          {/* Food Required */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Food Yes</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 tracking-tight">{stats.foodReq}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                {stats.foodPercentage}% of attendees
              </p>
            </div>
          </div>

          {/* Food Not Required */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Food No</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Utensils className="w-4 h-4 opacity-60" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-600 tracking-tight">{stats.foodNotReq}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">No meal arrangement</p>
            </div>
          </div>

          {/* Total Unique Places */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Places</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">{stats.totalPlaces}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Cities & districts</p>
            </div>
          </div>

          {/* Today's Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-rose-600 tracking-tight">{stats.todayCount}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Joined in last 24h</p>
            </div>
          </div>

        </div>

        {/* 2. Search, Filter, and Bulk Action Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search by Name or Phone */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, place, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
              />
            </div>

            {/* Place Filter */}
            <div>
              <select
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Places</option>
                {uniquePlaces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Food Filter */}
            <div>
              <select
                value={filterFood}
                onChange={(e) => setFilterFood(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Food</option>
                <option value="Food Required">Food Required</option>
                <option value="Food Not Required">Food Not Required</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Attended">Attended</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <button
                onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-white flex items-center justify-between"
              >
                <span>Date: {sortOrder === "desc" ? "Newest" : "Oldest"}</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Bulk Selection Ribbon */}
          {selectedIds.size > 0 && (
            <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200/80 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-brand-900 bg-brand-200/70 px-2.5 py-1 rounded-full">
                  {selectedIds.size} Selected
                </span>
                <span className="text-brand-700 font-medium">Bulk Actions:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={triggerWhatsAppBulk}
                  className="px-3 py-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => handleBulkStatusChange("Confirmed")}
                  className="px-3 py-1.5 rounded-xl font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                  Mark Confirmed
                </button>

                <button
                  onClick={() => handleBulkStatusChange("Attended")}
                  className="px-3 py-1.5 rounded-xl font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  Mark Attended
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 rounded-xl font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-500 hover:text-slate-800 underline ml-1"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 3. Registrations Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span>All Participant Registrations</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                {filteredRegistrations.length}
              </span>
            </h3>
            {loading && (
              <span className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing...</span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredRegistrations.length > 0 && selectedIds.size === filteredRegistrations.length}
                      onChange={handleSelectAll}
                      className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Reg ID</th>
                  <th className="p-4">Participant & Phone</th>
                  <th className="p-4">Place</th>
                  <th className="p-4">Food</th>
                  <th className="p-4">Preferred Time</th>
                  <th className="p-4">GPS / Maps</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => {
                    const isSelected = selectedIds.has(r.id);
                    const mapsUrl = r.latitude && r.longitude ? getGoogleMapsUrl(r.latitude, r.longitude) : null;

                    return (
                      <tr 
                        key={r.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? "bg-brand-50/40" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(r.id)}
                            className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>

                        {/* Registration ID */}
                        <td className="p-4 font-mono font-bold text-slate-800">
                          {r.registrationId}
                        </td>

                        {/* Name & Phone */}
                        <td className="p-4">
                          <p className="font-bold text-slate-900 text-sm">{r.fullName}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {formatDisplayPhone(r.phoneNumber)}
                          </p>
                        </td>

                        {/* Place */}
                        <td className="p-4 font-semibold text-slate-700">
                          {r.place}
                        </td>

                        {/* Food */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            r.foodPreference === "Food Required"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {r.foodPreference}
                          </span>
                        </td>

                        {/* Preferred Time */}
                        <td className="p-4 text-slate-600 font-medium max-w-[160px] truncate" title={r.preferredTime}>
                          {r.preferredTime}
                        </td>

                        {/* GPS Location & Maps link */}
                        <td className="p-4">
                          {mapsUrl ? (
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors font-bold text-[11px]"
                              title={`Coordinates: ${r.latitude}, ${r.longitude}`}
                            >
                              <Navigation className="w-3 h-3 text-blue-600" />
                              <span>View Maps</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">Manual Place</span>
                          )}
                        </td>

                        {/* Registered Date */}
                        <td className="p-4 text-slate-500 text-[11px]">
                          {formatDateTime(r.registrationDate)}
                        </td>

                        {/* Status Inline Dropdown */}
                        <td className="p-4">
                          <select
                            value={r.status || "Confirmed"}
                            onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer outline-none ${
                              (r.status || "Confirmed") === "Confirmed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : (r.status === "Attended")
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : (r.status === "Pending")
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Attended">Attended</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Button (Prompt Requirement #5) */}
                            <button
                              onClick={() => triggerWhatsAppSingle(r)}
                              className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </button>

                            {/* View Details */}
                            <button
                              onClick={() => setViewParticipant(r)}
                              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                              title="View full details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => setEditParticipant(r)}
                              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                              title="Edit registration"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                              title="Delete registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">No registrations found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {searchTerm ? "Try adjusting your search or filters." : "New registrations will appear here automatically."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* WhatsApp Modal (Single or Bulk) */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => {
          setWhatsAppModalOpen(false);
          setWhatsAppTargetParticipant(null);
          setWhatsAppSelectedList([]);
        }}
        participant={whatsAppTargetParticipant}
        selectedParticipants={whatsAppSelectedList}
      />

      {/* View Participant Details Modal */}
      {viewParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participant Profile</span>
                <h3 className="font-black text-lg text-slate-900">{viewParticipant.fullName}</h3>
              </div>
              <button 
                onClick={() => setViewParticipant(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Registration ID</span>
                <span className="font-bold text-slate-900 font-mono">{viewParticipant.registrationId}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Mobile Number</span>
                <span className="font-bold text-slate-900">{formatDisplayPhone(viewParticipant.phoneNumber)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Place / Location</span>
                <span className="font-bold text-slate-900">{viewParticipant.place}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Food Preference</span>
                <span className="font-bold text-slate-900">{viewParticipant.foodPreference}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Preferred Session</span>
                <span className="font-bold text-slate-900 text-right">{viewParticipant.preferredTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Status</span>
                <span className="font-bold text-emerald-700">{viewParticipant.status || "Confirmed"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Registered Timestamp</span>
                <span className="font-bold text-slate-800">{formatDateTime(viewParticipant.registrationDate)}</span>
              </div>
              {viewParticipant.latitude && viewParticipant.longitude && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                  <span className="text-blue-800 font-semibold">GPS Coordinates</span>
                  <a
                    href={getGoogleMapsUrl(viewParticipant.latitude, viewParticipant.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-700 underline flex items-center gap-1"
                  >
                    <span>{viewParticipant.latitude.toFixed(4)}°, {viewParticipant.longitude.toFixed(4)}°</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const p = viewParticipant;
                  setViewParticipant(null);
                  triggerWhatsAppSingle(p);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Reminder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {editParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">Edit Registration</h3>
              <button 
                onClick={() => setEditParticipant(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateRegistration(editParticipant.id, {
                    fullName: editParticipant.fullName,
                    phoneNumber: editParticipant.phoneNumber,
                    place: editParticipant.place,
                    foodPreference: editParticipant.foodPreference,
                    preferredTime: editParticipant.preferredTime,
                    status: editParticipant.status,
                  });
                  setEditParticipant(null);
                } catch (err) {
                  alert("Failed to update: " + err.message);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editParticipant.fullName}
                  onChange={(e) => setEditParticipant({ ...editParticipant, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editParticipant.phoneNumber}
                  onChange={(e) => setEditParticipant({ ...editParticipant, phoneNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Place / City</label>
                <input
                  type="text"
                  required
                  value={editParticipant.place}
                  onChange={(e) => setEditParticipant({ ...editParticipant, place: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Preference</label>
                <select
                  value={editParticipant.foodPreference}
                  onChange={(e) => setEditParticipant({ ...editParticipant, foodPreference: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 font-medium"
                >
                  <option value="Food Required">Food Required</option>
                  <option value="Food Not Required">Food Not Required</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editParticipant.status || "Confirmed"}
                  onChange={(e) => setEditParticipant({ ...editParticipant, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 font-medium"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Attended">Attended</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditParticipant(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this participant's registration? This action is permanent and cannot be reversed in Firebase.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


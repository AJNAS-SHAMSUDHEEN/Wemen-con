import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  MessageCircle, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Layers,
  CheckCircle2
} from "lucide-react";
import { 
  subscribeToAllRegistrations, 
  updateRegistration, 
  deleteRegistration 
} from "../services/registrationService";
import { exportToCSV, exportToJSON } from "../utils/exportUtils";
import { formatDateTime } from "../utils/formatters";
import { formatDisplayPhone } from "../utils/validators";
import { WhatsAppModal } from "../components/WhatsAppModal";
import { useAuth } from "../context/AuthContext";

export const AdminDashboard = () => {
  const { currentUser } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

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
    
    // Unique places
    const placesSet = new Set(registrations.map(r => r.place ? r.place.trim() : "").filter(Boolean));
    const totalPlaces = placesSet.size;

    // Confirmed count
    const confirmedCount = registrations.filter(r => (r.status || "Confirmed") === "Confirmed").length;
    const attendedCount = registrations.filter(r => r.status === "Attended").length;

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
      totalPlaces,
      confirmedCount,
      attendedCount,
      todayCount,
    };
  }, [registrations]);

  // Unique places for dropdown
  const uniquePlaces = useMemo(() => {
    const set = new Set(registrations.map(r => r.place ? r.place.trim() : "").filter(Boolean));
    return Array.from(set).sort();
  }, [registrations]);

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        const search = searchTerm.toLowerCase().trim();
        const matchesSearch = !search ||
          (r.fullName && r.fullName.toLowerCase().includes(search)) ||
          (r.phoneNumber && r.phoneNumber.includes(search)) ||
          (r.registrationId && r.registrationId.toLowerCase().includes(search)) ||
          (r.place && r.place.toLowerCase().includes(search));

        const matchesPlace = filterPlace === "all" ||
          (r.place && r.place.trim().toLowerCase() === filterPlace.trim().toLowerCase());

        const matchesStatus = filterStatus === "all" || (r.status || "Confirmed") === filterStatus;

        return matchesSearch && matchesPlace && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate || 0);
        const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [registrations, searchTerm, filterPlace, filterStatus, sortOrder]);

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRegistration(id, { status: newStatus });
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

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

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected registrations? This action cannot be reversed.`)) {
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

  const triggerWhatsAppSingle = (participant) => {
    setWhatsAppTargetParticipant(participant);
    setWhatsAppSelectedList([]);
    setWhatsAppModalOpen(true);
  };

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
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Admin Control Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Cloud Firestore
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Women's Conference 2026 • Logged in as: <span className="font-semibold text-slate-800">{currentUser?.email || "Admin"}</span>
            </p>
          </div>

          {/* Action Buttons: Export CSV, JSON, Bulk WhatsApp */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredRegistrations, "womens_conference_registrations.csv")}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(filteredRegistrations, "womens_conference_registrations.json")}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={triggerWhatsAppBulk}
              disabled={selectedIds.size === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Firestore Alert</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* 1. Statistic Cards (Clean 4 cards without food) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
              <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Total participants</p>
            </div>
          </div>

          {/* Unique Places */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unique Places</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">{stats.totalPlaces}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Different localities</p>
            </div>
          </div>

          {/* Confirmed Seats */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirmed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 tracking-tight">{stats.confirmedCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Confirmed participants</p>
            </div>
          </div>

          {/* Today's Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today</span>
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-pink-600 tracking-tight">{stats.todayCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Joined in last 24h</p>
            </div>
          </div>

        </div>

        {/* 2. Search, Filter, and Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, place, or Reg ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-brand-600 outline-none"
              />
            </div>

            {/* Place Filter */}
            <div>
              <select
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Places ({uniquePlaces.length})</option>
                {uniquePlaces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
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
          </div>

          {/* Bulk Ribbon */}
          {selectedIds.size > 0 && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-brand-900 bg-rose-200/80 px-2.5 py-1 rounded-full">
                  {selectedIds.size} Selected
                </span>
                <span className="text-brand-800 font-medium">Bulk Actions:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={triggerWhatsAppBulk}
                  className="px-3 py-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => handleBulkStatusChange("Confirmed")}
                  className="px-3 py-1.5 rounded-xl font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  Mark Confirmed
                </button>

                <button
                  onClick={() => handleBulkStatusChange("Attended")}
                  className="px-3 py-1.5 rounded-xl font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  Mark Attended
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 rounded-xl font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-500 hover:text-slate-800 underline ml-1 cursor-pointer"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 3. Registrations Table (No Food column) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span>All Participant Registrations</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                {filteredRegistrations.length}
              </span>
            </h3>
            {loading && (
              <span className="text-xs font-semibold text-brand-700 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing...</span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredRegistrations.length > 0 && selectedIds.size === filteredRegistrations.length}
                      onChange={handleSelectAll}
                      className="rounded text-brand-700 focus:ring-brand-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Reg ID</th>
                  <th className="p-4">Participant & Mobile</th>
                  <th className="p-4">Place</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => {
                    const isSelected = selectedIds.has(r.id);

                    return (
                      <tr 
                        key={r.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? "bg-rose-50/40" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(r.id)}
                            className="rounded text-brand-700 focus:ring-brand-600 cursor-pointer"
                          />
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-800">
                          {r.registrationId}
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-slate-900 text-sm">{r.fullName}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {formatDisplayPhone(r.phoneNumber)}
                          </p>
                        </td>

                        <td className="p-4 font-medium text-slate-700">
                          {r.place}
                        </td>

                        <td className="p-4 text-slate-500 text-[11px]">
                          {formatDateTime(r.registrationDate)}
                        </td>

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

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => triggerWhatsAppSingle(r)}
                              className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors cursor-pointer"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              onClick={() => setViewParticipant(r)}
                              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                              title="View Participant Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEditParticipant(r)}
                              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                              title="Edit Registration"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Record"
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
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">No registrations found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* WhatsApp Modal */}
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

      {/* View Participant Modal */}
      {viewParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participant Profile</span>
                <h3 className="font-extrabold text-base text-slate-900">{viewParticipant.fullName}</h3>
              </div>
              <button 
                onClick={() => setViewParticipant(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Registration ID</span>
                <span className="font-bold text-slate-900 font-mono">{viewParticipant.registrationId}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mobile Number</span>
                <span className="font-bold text-slate-900">{formatDisplayPhone(viewParticipant.phoneNumber)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Place</span>
                <span className="font-bold text-slate-900">{viewParticipant.place}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="font-bold text-emerald-700">{viewParticipant.status || "Confirmed"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Registration Timestamp</span>
                <span className="font-bold text-slate-800">{formatDateTime(viewParticipant.registrationDate)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const p = viewParticipant;
                  setViewParticipant(null);
                  triggerWhatsAppSingle(p);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
              <h3 className="font-bold text-base text-slate-900">Edit Registration</h3>
              <button 
                onClick={() => setEditParticipant(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
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
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editParticipant.fullName}
                  onChange={(e) => setEditParticipant({ ...editParticipant, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={editParticipant.phoneNumber}
                  onChange={(e) => setEditParticipant({ ...editParticipant, phoneNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Place</label>
                <input
                  type="text"
                  required
                  value={editParticipant.place}
                  onChange={(e) => setEditParticipant({ ...editParticipant, place: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editParticipant.status || "Confirmed"}
                  onChange={(e) => setEditParticipant({ ...editParticipant, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-600 font-medium cursor-pointer"
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
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 font-bold text-white cursor-pointer"
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
            <h3 className="font-bold text-base text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete this participant record?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

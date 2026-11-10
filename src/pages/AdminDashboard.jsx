import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Utensils, 
  MapPin, 
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
import { formatDateTime, getGoogleMapsUrl } from "../utils/formatters";
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

        const matchesFood = filterFood === "all" || r.foodPreference === filterFood;
        const matchesStatus = filterStatus === "all" || (r.status || "Confirmed") === filterStatus;

        return matchesSearch && matchesPlace && matchesFood && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate || 0);
        const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [registrations, searchTerm, filterPlace, filterFood, filterStatus, sortOrder]);

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
    if (!window.confirm(`തിരഞ്ഞെടുത്ത ${selectedIds.size} രജിസ്ട്രേഷനുകൾ നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?`)) {
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
      alert("ദയവായി കുറഞ്ഞത് ഒരു പങ്കാളിയെ എങ്കിലും തിരഞ്ഞെടുക്കുക.");
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
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                വനിതാ സമ്മേളനം — അഡ്മിൻ കൺട്രോൾ പാനൽ
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Cloud Firestore
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ഇരിട്ടി മണ്ഡലം (2026 നവംബർ 21 ശനി) • ലോഗിൻ ചെയ്തിരിക്കുന്നത്: <span className="font-semibold text-slate-800">{currentUser?.email || "Admin"}</span>
            </p>
          </div>

          {/* Top Actions: Export CSV, JSON, Bulk WhatsApp */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => exportToCSV(filteredRegistrations, "wisdom_women_registrations.csv")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(filteredRegistrations, "wisdom_women_registrations.json")}
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
              <span>WhatsApp സന്ദേശം ({selectedIds.size})</span>
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
              <p className="font-bold text-sm">Firestore Alert</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* 1. Statistic Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ആകെ രജിസ്ട്രേഷൻ</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">സ്ഥിരീകരിച്ച പങ്കാളികൾ</p>
            </div>
          </div>

          {/* Food Required */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ഭക്ഷണം ആവശ്യമുള്ളവർ</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 tracking-tight">{stats.foodReq}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                {stats.foodPercentage}% പേർക്ക് ഭക്ഷണം
              </p>
            </div>
          </div>

          {/* Food Not Required */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ഭക്ഷണം ആവശ്യമില്ലാത്തവർ</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Utensils className="w-4 h-4 opacity-60" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-600 tracking-tight">{stats.foodNotReq}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">ഭക്ഷണം ഒഴിവാക്കിയവർ</p>
            </div>
          </div>

          {/* Total Unique Places */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">പ്രദേശങ്ങൾ / മഹല്ലുകൾ</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">{stats.totalPlaces}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">വ്യത്യസ്ത സ്ഥലങ്ങൾ</p>
            </div>
          </div>

          {/* Today's Registrations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ഇന്നത്തെ രജിസ്ട്രേഷൻ</span>
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-pink-600 tracking-tight">{stats.todayCount}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">കഴിഞ്ഞ 24 മണിക്കൂറിൽ</p>
            </div>
          </div>

        </div>

        {/* 2. Search, Filter, and Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="പേര്, ഫോൺ, സ്ഥലം, Reg ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-rose-600 outline-none"
              />
            </div>

            {/* Place Filter */}
            <div>
              <select
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">എല്ലാ സ്ഥലങ്ങളും ({uniquePlaces.length})</option>
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
                <option value="all">ഭക്ഷണം (എല്ലാം)</option>
                <option value="Food Required">ഭക്ഷണം ആവശ്യമുള്ളവർ</option>
                <option value="Food Not Required">ഭക്ഷണം ആവശ്യമില്ലാത്തവർ</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">സ്റ്റാറ്റസ് (എല്ലാം)</option>
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
                <span className="font-extrabold text-rose-900 bg-rose-200/80 px-2.5 py-1 rounded-full">
                  {selectedIds.size} പേരെ തിരഞ്ഞെടുത്തു
                </span>
                <span className="text-rose-700 font-medium">Bulk Actions:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={triggerWhatsAppBulk}
                  className="px-3 py-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>വാട്ട്‌സ്ആപ്പ് അയക്കുക</span>
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
                  <span>ഡിലീറ്റ്</span>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span>രജിസ്ട്രേഷൻ പട്ടിക (All Participants)</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                {filteredRegistrations.length}
              </span>
            </h3>
            {loading && (
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
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
                      className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Reg ID</th>
                  <th className="p-4">പേര് & മൊബൈൽ</th>
                  <th className="p-4">സ്ഥലം</th>
                  <th className="p-4">ഭക്ഷണം</th>
                  <th className="p-4">GPS / Maps</th>
                  <th className="p-4">തീയതി</th>
                  <th className="p-4">സ്റ്റാറ്റസ്</th>
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
                          isSelected ? "bg-rose-50/40" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(r.id)}
                            className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
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

                        <td className="p-4 font-semibold text-slate-700">
                          {r.place}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            r.foodPreference === "Food Required"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {r.foodPreference === "Food Required" ? "ഭക്ഷണം വേണം" : "വേണ്ട"}
                          </span>
                        </td>

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
                              <span>Maps ലിങ്ക്</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">Manual Place</span>
                          )}
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
                              className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              onClick={() => setViewParticipant(r)}
                              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                              title="വിശദവിവരങ്ങൾ കാണുക"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEditParticipant(r)}
                              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                              title="എഡിറ്റ് ചെയ്യുക"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                              title="ഡിലീറ്റ് ചെയ്യുക"
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
                    <td colSpan={9} className="p-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">രജിസ്ട്രേഷനുകൾ ഒന്നും ലഭിച്ചിട്ടില്ല</p>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">പങ്കാളിയുടെ പ്രൊഫൈൽ</span>
                <h3 className="font-black text-lg text-slate-900">{viewParticipant.fullName}</h3>
              </div>
              <button 
                onClick={() => setViewParticipant(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Registration ID</span>
                <span className="font-bold text-slate-900 font-mono">{viewParticipant.registrationId}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">മൊബൈൽ നമ്പർ</span>
                <span className="font-bold text-slate-900">{formatDisplayPhone(viewParticipant.phoneNumber)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">സ്ഥലം</span>
                <span className="font-bold text-slate-900">{viewParticipant.place}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">ഭക്ഷണ സൗകര്യം</span>
                <span className="font-bold text-slate-900">
                  {viewParticipant.foodPreference === "Food Required" ? "ഭക്ഷണം ആവശ്യമുണ്ട്" : "ഭക്ഷണം ആവശ്യമില്ല"}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">സ്റ്റാറ്റസ്</span>
                <span className="font-bold text-emerald-700">{viewParticipant.status || "Confirmed"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-semibold">രജിസ്റ്റർ ചെയ്ത സമയം</span>
                <span className="font-bold text-slate-800">{formatDateTime(viewParticipant.registrationDate)}</span>
              </div>
              {viewParticipant.latitude && viewParticipant.longitude && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <span className="text-blue-800 font-semibold">GPS ലൊക്കേഷൻ</span>
                  <a
                    href={getGoogleMapsUrl(viewParticipant.latitude, viewParticipant.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-700 underline flex items-center gap-1"
                  >
                    <span>Google Maps-ൽ കാണുക</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const p = viewParticipant;
                  setViewParticipant(null);
                  triggerWhatsAppSingle(p);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>വാട്ട്‌സ്ആപ്പ് റിമൈൻഡർ അയക്കുക</span>
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
              <h3 className="font-black text-lg text-slate-900">രജിസ്ട്രേഷൻ എഡിറ്റ് ചെയ്യുക</h3>
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
                <label className="block font-bold text-slate-700 mb-1">പൂർണ്ണ നാമം</label>
                <input
                  type="text"
                  required
                  value={editParticipant.fullName}
                  onChange={(e) => setEditParticipant({ ...editParticipant, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">മൊബൈൽ നമ്പർ</label>
                <input
                  type="text"
                  required
                  value={editParticipant.phoneNumber}
                  onChange={(e) => setEditParticipant({ ...editParticipant, phoneNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">സ്ഥലം / മഹല്ല്</label>
                <input
                  type="text"
                  required
                  value={editParticipant.place}
                  onChange={(e) => setEditParticipant({ ...editParticipant, place: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ഭക്ഷണ സൗകര്യം</label>
                <select
                  value={editParticipant.foodPreference}
                  onChange={(e) => setEditParticipant({ ...editParticipant, foodPreference: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600 font-medium"
                >
                  <option value="Food Required">ഭക്ഷണം ആവശ്യമുള്ളവർ</option>
                  <option value="Food Not Required">ഭക്ഷണം ആവശ്യമില്ലാത്തവർ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">സ്റ്റാറ്റസ്</label>
                <select
                  value={editParticipant.status || "Confirmed"}
                  onChange={(e) => setEditParticipant({ ...editParticipant, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600 font-medium"
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
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 font-bold text-white shadow-xs"
                >
                  മാറ്റങ്ങൾ സേവ് ചെയ്യുക
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
            <h3 className="font-black text-lg text-slate-900">രജിസ്ട്രേഷൻ നീക്കം ചെയ്യുക</h3>
            <p className="text-xs text-slate-500">
              ഈ പങ്കാളിയുടെ രജിസ്ട്രേഷൻ ഡാറ്റാബേസിൽ നിന്ന് പൂർണ്ണമായും ഡിലീറ്റ് ചെയ്യപ്പെടും. ഈ പ്രവർത്തനം മാറ്റാൻ കഴിയില്ല.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                റദ്ദാക്കുക
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
              >
                ഡിലീറ്റ് ചെയ്യുക
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

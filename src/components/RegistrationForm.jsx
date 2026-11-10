import React, { useState } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  Utensils, 
  Navigation, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Crosshair,
  Calendar,
  Clock
} from "lucide-react";
import { 
  validateIndianMobile, 
  validateFullName, 
  validatePlace,
} from "../utils/validators";
import { createRegistration } from "../services/registrationService";

export const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    place: "",
    foodPreference: "Food Required",
  });

  // Geolocation state
  const [locationState, setLocationState] = useState({
    requested: false,
    loading: false,
    granted: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Handle GPS location capture
  const captureGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: "നിങ്ങളുടെ ബ്രൗസറിൽ GPS ലഭ്യമല്ല. ദയവായി സ്ഥലം നേരിട്ട് നൽകുക.",
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null, requested: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          requested: true,
          loading: false,
          granted: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          error: null,
        });
      },
      (error) => {
        let msg = "GPS ലൊക്കേഷൻ ലഭ്യമായില്ല. നിങ്ങളുടെ സ്ഥലം നേരിട്ട് നൽകി മുന്നോട്ട് പോകാം.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "ലൊക്കേഷൻ അനുമതി നൽകിയിട്ടില്ല. നൽകിയ സ്ഥലം വെച്ച് രജിസ്റ്റർ ചെയ്യാം.";
        }
        setLocationState(prev => ({
          ...prev,
          loading: false,
          granted: false,
          error: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateField = (field, value) => {
    switch (field) {
      case "fullName": {
        const res = validateFullName(value);
        return res.isValid ? "" : "ശരിയായ പേര് നൽകുക (കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ)";
      }
      case "phoneNumber": {
        const res = validateIndianMobile(value);
        return res.isValid ? "" : "10 അക്ക മൊബൈൽ നമ്പർ നൽകുക (ഉദാ: 9876543210)";
      }
      case "place": {
        const res = validatePlace(value);
        return res.isValid ? "" : "നിങ്ങളുടെ സ്ഥലം / പ്രദേശം നൽകുക";
      }
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate fields
    const nameErr = validateField("fullName", formData.fullName);
    const phoneErr = validateField("phoneNumber", formData.phoneNumber);
    const placeErr = validateField("place", formData.place);

    const validationErrors = {};
    if (nameErr) validationErrors.fullName = nameErr;
    if (phoneErr) validationErrors.phoneNumber = phoneErr;
    if (placeErr) validationErrors.place = placeErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalLat = locationState.latitude;
      let finalLng = locationState.longitude;
      let finalAcc = locationState.accuracy;

      // Save to Firebase Firestore (preferredTime is fixed to 9:30 AM - 4:00 PM per poster)
      const newRegistration = await createRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        place: formData.place,
        foodPreference: formData.foodPreference,
        latitude: finalLat,
        longitude: finalLng,
        locationAccuracy: finalAcc,
      });

      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
        foodPreference: "Food Required",
      });
      setLocationState({
        requested: false,
        loading: false,
        granted: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
      });
      setErrors({});

      if (onSuccess) {
        onSuccess(newRegistration);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      if (err.code === "DUPLICATE_PHONE") {
        setApiError(err.message);
      } else {
        setApiError(err.message || "രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="register" className="max-w-2xl mx-auto scroll-mt-24">
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-900/5 overflow-hidden transition-all">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#981b37] via-[#b91c47] to-[#d62254] px-6 sm:px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              പ്രവേശന രജിസ്ട്രേഷൻ ഫോം
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            സമ്മേളനത്തിൽ പങ്കെടുക്കാൻ രജിസ്റ്റർ ചെയ്യുക
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
            ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം • 2026 നവംബർ 21 ശനി (രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ)
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-rose-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>2026 നവംബർ 21 ശനി</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>9:30 AM - 4:00 PM</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>ഉളിക്കൽ (ചോയ്സ് ഓഡിറ്റോറിയം)</span>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          {/* Duplicate / API Error Alert */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">ശ്രദ്ധിക്കുക</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              പൂർണ്ണ നാമം (Full Name) <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="ഉദാ: ഫാത്തിമ സഹ്റ"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.fullName 
                    ? "border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* 2. Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-800">
                മൊബൈൽ നമ്പർ (Mobile Number) <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                10 അക്ക വാട്ട്‌സ്ആപ്പ് നമ്പർ
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-slate-400 font-bold text-xs border-r border-slate-200 pr-2">
                +91
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="9876543210"
                maxLength={14}
                className={`w-full pl-22 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.phoneNumber 
                    ? "border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10"
                }`}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phoneNumber}</span>
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-400">
                രജിസ്ട്രേഷൻ കൺഫർമേഷൻ അയക്കുന്നതിനായി ഉപയോഗിക്കുന്നു. പൊതുവായി കാണിക്കില്ല.
              </p>
            )}
          </div>

          {/* 3. Place / Location */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              സ്ഥലം / മഹല്ല് (Place / Unit) <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="ഉദാ: ഉളിക്കൽ, ഇരിട്ടി, നുച്ച്യാട്, പായം..."
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.place 
                    ? "border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10"
                }`}
              />
            </div>
            {errors.place && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.place}</span>
              </p>
            )}
          </div>

          {/* 4. Food Preference */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              ഭക്ഷണ സൗകര്യം (Food Preference) <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange("foodPreference", "Food Required")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.foodPreference === "Food Required"
                    ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-950"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.foodPreference === "Food Required" 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm">ഭക്ഷണം ആവശ്യമുണ്ട്</span>
                    {formData.foodPreference === "Food Required" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ഉച്ചഭക്ഷണ ക്രമീകരണത്തിനായി
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("foodPreference", "Food Not Required")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.foodPreference === "Food Not Required"
                    ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 text-amber-950"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.foodPreference === "Food Not Required" 
                    ? "bg-amber-600 text-white shadow-xs" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  <Utensils className="w-4 h-4 opacity-50" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm">ഭക്ഷണം ആവശ്യമില്ല</span>
                    {formData.foodPreference === "Food Not Required" && (
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ഭക്ഷണം ഒഴിവാക്കാൻ സഹായിക്കുന്നു
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 5. Location Sharing (GPS Permission - Optional) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#981b37]" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  ലൊക്കേഷൻ ഷെയറിങ് (GPS ഓപ്ഷണൽ)
                </span>
              </div>
              {locationState.granted && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GPS ലഭ്യമായി</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              യാത്രാ ക്രമീകരണങ്ങൾക്ക് സഹായിക്കാനായി ലൊക്കേഷൻ നൽകാം. നൽകിയില്ലെങ്കിലും മുകളിൽ നൽകിയ സ്ഥലം വെച്ച് രജിസ്ട്രേഷൻ പൂർത്തിയാക്കാം.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={captureGpsLocation}
                disabled={locationState.loading}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
              >
                {locationState.loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#981b37]" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5 text-[#981b37]" />
                )}
                <span>{locationState.granted ? "വീണ്ടും GPS ചെക്ക് ചെയ്യുക" : "GPS ലൊക്കേഷൻ ചേർക്കുക"}</span>
              </button>

              {locationState.granted && locationState.latitude && (
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {locationState.latitude.toFixed(4)}°, {locationState.longitude.toFixed(4)}°
                </span>
              )}
            </div>

            {locationState.error && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                {locationState.error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#981b37] via-[#b91c47] to-[#d62254] hover:from-[#7e142c] hover:to-[#b91c47] shadow-lg shadow-rose-900/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുന്നു...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക (Submit)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              🔒 സൗജന്യ പ്രവേശനം. രജിസ്ട്രേഷൻ പൂർത്തിയാകുമ്പോൾ ഡിജിറ്റൽ പാസ്സ് ലഭ്യമാകും.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

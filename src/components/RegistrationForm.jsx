import React, { useState } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  Utensils, 
  Clock, 
  Navigation, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  Crosshair,
  ExternalLink
} from "lucide-react";
import { 
  validateIndianMobile, 
  validateFullName, 
  validatePlace,
  formatToStandard10Digit 
} from "../utils/validators";
import { createRegistration } from "../services/registrationService";

const TIME_SLOTS = [
  { id: "morning", label: "Morning Session (09:00 AM - 01:00 PM)", desc: "Keynotes & Inaugural Session" },
  { id: "afternoon", label: "Afternoon Session (02:00 PM - 05:00 PM)", desc: "Panel Discussions & Workshops" },
  { id: "evening", label: "Evening Session (05:30 PM - 08:30 PM)", desc: "Valedictory & Cultural Gathering" },
  { id: "fullday", label: "Full Day (09:00 AM - 08:30 PM)", desc: "All sessions included" },
];

export const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    place: "",
    foodPreference: "Food Required",
    preferredTime: "Morning Session (09:00 AM - 01:00 PM)",
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
        error: "Geolocation is not supported by your browser. Please enter your place manually.",
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
        let msg = "Could not access GPS location. Manual place entry will be used.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied. You can proceed with your manual place.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS signal unavailable. Manual place will be used.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Manual place will be used.";
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
        return res.isValid ? "" : res.message;
      }
      case "phoneNumber": {
        const res = validateIndianMobile(value);
        return res.isValid ? "" : res.message;
      }
      case "place": {
        const res = validatePlace(value);
        return res.isValid ? "" : res.message;
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

    // Validate all fields
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
      // If user hasn't explicitly clicked "Capture Location" yet, attempt a quick background location check
      let finalLat = locationState.latitude;
      let finalLng = locationState.longitude;
      let finalAcc = locationState.accuracy;

      if (!locationState.granted && navigator.geolocation && !locationState.requested) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 4000,
            });
          });
          if (pos && pos.coords) {
            finalLat = pos.coords.latitude;
            finalLng = pos.coords.longitude;
            finalAcc = Math.round(pos.coords.accuracy);
          }
        } catch {
          // Fallback gracefully without error to manual place
        }
      }

      // Save to Firebase Firestore
      const newRegistration = await createRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        place: formData.place,
        foodPreference: formData.foodPreference,
        preferredTime: formData.preferredTime,
        latitude: finalLat,
        longitude: finalLng,
        locationAccuracy: finalAcc,
      });

      // Clear form
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
        foodPreference: "Food Required",
        preferredTime: "Morning Session (09:00 AM - 01:00 PM)",
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

      // Fire success callback
      if (onSuccess) {
        onSuccess(newRegistration);
      }

    } catch (err) {
      console.error("Submission failed:", err);
      if (err.code === "DUPLICATE_PHONE") {
        setApiError(err.message);
      } else {
        setApiError(err.message || "Failed to submit registration. Please check your internet connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="register" className="max-w-2xl mx-auto scroll-mt-24">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-brand-500/5 overflow-hidden transition-all">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-rose-500 px-6 sm:px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
              ✨
            </span>
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full">
              Registration Form
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Register for Women's Conference
          </h2>
          <p className="text-pink-100 text-sm mt-1">
            Fill in your details below to confirm your free seat and hospitality pass.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          {/* API / Duplicate Error Alert */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Registration Notice</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="e.g. Fathima Zahra"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.fullName 
                    ? "border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
              <label className="block text-sm font-bold text-slate-700">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                10-digit Indian Mobile
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-slate-400 font-semibold text-xs border-r border-slate-200 pr-2">
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
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
                Used for your registration confirmation and WhatsApp updates. Kept private.
              </p>
            )}
          </div>

          {/* 3. Place / Location */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Place / City / District <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="e.g. Kozhikode, Malappuram, Kochi..."
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.place 
                    ? "border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
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
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Food Preference <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange("foodPreference", "Food Required")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.foodPreference === "Food Required"
                    ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.foodPreference === "Food Required" 
                    ? "bg-emerald-500 text-white shadow-sm" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Food Required</span>
                    {formData.foodPreference === "Food Required" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complimentary buffet lunch & refreshments
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("foodPreference", "Food Not Required")}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.foodPreference === "Food Not Required"
                    ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-900"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.foodPreference === "Food Not Required" 
                    ? "bg-amber-500 text-white shadow-sm" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  <Utensils className="w-4 h-4 opacity-50" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Food Not Required</span>
                    {formData.foodPreference === "Food Not Required" && (
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Helps us prevent excess food waste
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 5. Preferred Time */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Preferred Time / Session <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = formData.preferredTime === slot.label;
                return (
                  <label
                    key={slot.id}
                    onClick={() => handleChange("preferredTime", slot.label)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20 text-brand-950 shadow-xs"
                        : "border-slate-200 bg-slate-50/40 hover:bg-slate-100/60 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredTime"
                      checked={isSelected}
                      onChange={() => handleChange("preferredTime", slot.label)}
                      className="mt-1 text-brand-600 focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{slot.label}</p>
                      <p className="text-xs text-slate-500">{slot.desc}</p>
                    </div>
                    <Clock className={`w-4 h-4 mt-0.5 ${isSelected ? "text-brand-600" : "text-slate-400"}`} />
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. Location Sharing (GPS Permission + Coordinates) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-bold text-slate-800">
                  Location Sharing (Optional GPS)
                </span>
              </div>
              {locationState.granted && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GPS Captured</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sharing GPS assists the organizing committee with transit planning and routing. You can click below to detect coordinates, or rely solely on your manual place entry.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={captureGpsLocation}
                disabled={locationState.loading}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {locationState.loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5 text-brand-600" />
                )}
                <span>{locationState.granted ? "Re-detect GPS Coordinates" : "Share GPS Location"}</span>
              </button>

              {locationState.granted && locationState.latitude && (
                <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <span>{locationState.latitude.toFixed(4)}°, {locationState.longitude.toFixed(4)}°</span>
                  {locationState.accuracy && <span className="text-slate-400 font-normal">({locationState.accuracy}m accuracy)</span>}
                </div>
              )}
            </div>

            {locationState.error && (
              <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded-xl border border-amber-200">
                {locationState.error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Seat in Firebase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Submit My Registration</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              🔒 Safe & Secure. Instant confirmation with your Registration ID.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

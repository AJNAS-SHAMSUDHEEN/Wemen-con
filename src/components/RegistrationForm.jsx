import React, { useState } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateField = (field, value) => {
    switch (field) {
      case "fullName": {
        const res = validateFullName(value);
        return res.isValid ? "" : "Please enter a valid full name (minimum 2 characters)";
      }
      case "phoneNumber": {
        const res = validateIndianMobile(value);
        return res.isValid ? "" : "Please enter a valid 10-digit mobile number";
      }
      case "place": {
        const res = validatePlace(value);
        return res.isValid ? "" : "Please enter your place name";
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
      const newRegistration = await createRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        place: formData.place,
      });

      // Clear form on success
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
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
        setApiError(err.message || "Registration failed. Please check your network connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="register" className="max-w-xl mx-auto scroll-mt-24">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
        
        {/* Form Header */}
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 px-6 sm:px-8 py-7 text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              Participant Pass
            </span>
            <span className="text-[11px] font-semibold text-rose-200">
              Free Admission
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">
            Register for the Conference
          </h3>
          <p className="text-rose-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Please enter your details below to confirm your seat.
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-rose-100 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-300" />
              <span>Saturday, 21 November 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-300" />
              <span>9:30 AM – 4:00 PM</span>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

          {/* Error Notice */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">Notice</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter participant's full name"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.fullName 
                    ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* 2. Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                10-digit WhatsApp number
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none text-slate-500 font-bold text-xs border-r border-slate-200 pr-2">
                +91
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="9876543210"
                maxLength={14}
                className={`w-full pl-20 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.phoneNumber 
                    ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                }`}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phoneNumber}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Used to deliver your confirmation pass and event notifications. Kept strictly private.
              </p>
            )}
          </div>

          {/* 3. Place */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Place <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="e.g. Ulikkal, Iritty, Payam, Mattannur"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.place 
                    ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                }`}
              />
            </div>
            {errors.place && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.place}</span>
              </p>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 hover:from-brand-900 hover:to-brand-700 shadow-md shadow-brand-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Registration</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant digital pass provided upon registration</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

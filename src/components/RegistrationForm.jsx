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
  ShieldCheck,
  Info
} from "lucide-react";
import { 
  validateIndianMobile, 
  validateFullName, 
  validatePlace,
} from "../utils/validators";
import { createRegistration } from "../services/registrationService";

export const RegistrationForm = ({ onSuccess, onOpenDetails }) => {
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
        return res.isValid ? "" : "ദയവായി പൂർണ്ണ നാമം നൽകുക (കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ)";
      }
      case "phoneNumber": {
        const res = validateIndianMobile(value);
        return res.isValid ? "" : "ശരിയായ 10 അക്ക വാട്സ്ആപ്പ് മൊബൈൽ നമ്പർ നൽകുക";
      }
      case "place": {
        const res = validatePlace(value);
        return res.isValid ? "" : "ദയവായി നിങ്ങളുടെ സ്ഥലം നൽകുക";
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
        setApiError(err.message || "രജിസ്ട്രേഷൻ സമർപ്പിക്കാൻ സാധിച്ചില്ല. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="register" className="w-full max-w-lg mx-auto font-ml">
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-950/5 overflow-hidden transition-all">
        
        {/* Form Header Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 px-6 sm:px-8 py-7 text-white relative">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              പ്രവേശന രജിസ്ട്രേഷൻ
            </span>
            <span className="text-xs font-semibold text-rose-200">
              സൗജന്യ പ്രവേശനം
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm mt-1 leading-relaxed">
            നിങ്ങളുടെ സീറ്റ് ഉറപ്പുവരുത്താൻ താഴെ വിവരങ്ങൾ നൽകുക.
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-rose-300" />
              <span>2026 നവംബർ 21 ശനി</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-rose-300" />
              <span>9:30 AM – 4:00 PM</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം</span>
            </span>
          </div>

          {/* Program Details Button */}
          {onOpenDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 text-rose-200" />
              <span>മുഴുവൻ പരിപാടി വിവരങ്ങളും പോസ്റ്ററും കാണുക</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

          {/* Error Notice */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">ശ്രദ്ധിക്കുക</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              പൂർണ്ണ നാമം <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="ഉദാ: ഫാത്തിമ സഹ്റ"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.fullName 
                    ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
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

          {/* 2. Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                വാട്സ്ആപ്പ് നമ്പർ <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                10 അക്ക മൊബൈൽ നമ്പർ
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
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
                }`}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phoneNumber}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                കൺഫർമേഷൻ പാസ്സ് ലഭിക്കുന്നതിനായി നൽകുക. സ്വകാര്യമായി സൂക്ഷിക്കും.
              </p>
            )}
          </div>

          {/* 3. Place */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              സ്ഥലം <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="ഉദാ: ഉളിക്കൽ, ഇരിട്ടി, പായം, നുച്ച്യാട്..."
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${
                  errors.place 
                    ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10"
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 hover:from-brand-950 hover:to-brand-800 shadow-lg shadow-brand-950/15 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുന്നു...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>രജിസ്റ്റർ ചെയ്യുക</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>രജിസ്ട്രേഷൻ പൂർത്തിയാകുമ്പോൾ തൽക്ഷണം ഡിജിറ്റൽ പാസ്സ് ലഭിക്കും</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

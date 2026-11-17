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
  Info,
  Baby,
  RotateCcw
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
    childrenCount: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [activeField, setActiveField] = useState(null);

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

  const handleClear = () => {
    if (window.confirm("ഫോമിലെ വിവരങ്ങൾ മായ്‌ക്കണമെന്നുറപ്പാണോ? (Clear form?)")) {
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
        childrenCount: 0,
      });
      setErrors({});
      setApiError("");
    }
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
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const newRegistration = await createRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        place: formData.place,
        childrenCount: Number(formData.childrenCount) || 0,
      });

      // Clear form on success
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
        childrenCount: 0,
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

  const childrenOptions = [
    { label: "ഇല്ല (0)", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4+", value: 4 },
  ];

  return (
    <div id="register" className="w-full max-w-xl mx-auto font-ml space-y-4">
      
      {/* 1. Google Forms Header Card with Lavender Accent Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
        {/* Top Lavender Accent Strip */}
        <div className="h-3 sm:h-3.5 bg-lavender-600 w-full" />
        
        <div className="p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-lavender-100 text-lavender-800 px-3 py-0.5 rounded-full">
              പ്രവേശന രജിസ്ട്രേഷൻ ഫോം
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              സൗജന്യ പ്രവേശനം
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            പഞ്ചസമ്മേളനത്തിൽ പങ്കെടുക്കാൻ താത്പര്യപ്പെടുന്നവർ താഴെയുള്ള ചോദ്യങ്ങൾക്ക് വിവരങ്ങൾ നൽകി രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-lavender-600 shrink-0" />
              <span>2026 നവംബർ 21 ശനി</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-lavender-600 shrink-0" />
              <span>9:30 AM – 4:00 PM</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-lavender-600 shrink-0" />
              <span>ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം</span>
            </span>
          </div>

          {onOpenDetails && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenDetails}
                className="w-full py-2 px-3 rounded-xl bg-lavender-50 hover:bg-lavender-100 text-lavender-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-lavender-200"
              >
                <Info className="w-3.5 h-3.5 text-lavender-600" />
                <span>പരിപാടി വിവരങ്ങളും ഔദ്യോഗിക പോസ്റ്ററും കാണുക</span>
              </button>
            </div>
          )}

          {/* Google Forms Required Notice */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <span className="text-base leading-none font-bold">*</span>
              <span>നിർബന്ധമായും പൂരിപ്പിക്കേണ്ട ചോദ്യങ്ങൾ (Indicates required question)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Global API / Duplicate Error Card */}
      {apiError && (
        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-4 sm:p-5 flex items-start gap-3 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-rose-900">
            <p className="font-bold">ശ്രദ്ധിക്കുക (Notice)</p>
            <p className="mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* 2. Google Form Question Cards */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* QUESTION 1: Full Name */}
        <div 
          id="field-fullName"
          onFocus={() => setActiveField("fullName")}
          onBlur={() => setActiveField(null)}
          className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
            errors.fullName
              ? "border-red-400 border-l-4 border-l-red-500 bg-red-50/20"
              : activeField === "fullName"
                ? "border-lavender-300 border-l-4 border-l-lavender-600 shadow-sm"
                : "border-slate-200/90 border-l-4 border-l-transparent hover:border-slate-300"
          }`}
        >
          {/* Highlighted Question Label */}
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>പൂർണ്ണ നാമം</span>
              <span className="text-xs font-normal text-slate-500">(Full Name)</span>
              <span className="text-red-500 text-lg leading-none font-bold" title="Required">*</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              സമ്മേളനത്തിൽ പങ്കെടുക്കുന്നയാളുടെ പേര് നൽകുക
            </p>
          </div>

          {/* Underline / Clean Input */}
          <div className="mt-3">
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="നിങ്ങളുടെ ഉത്തരം (Your answer)"
                className="w-full py-2.5 px-1 border-b-2 border-slate-200 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent outline-none transition-colors focus:border-lavender-600 hover:border-slate-300"
              />
            </div>
            {errors.fullName && (
              <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>
        </div>

        {/* QUESTION 2: WhatsApp Number (SPECIALLY HIGHLIGHTED) */}
        <div 
          id="field-phoneNumber"
          onFocus={() => setActiveField("phoneNumber")}
          onBlur={() => setActiveField(null)}
          className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
            errors.phoneNumber
              ? "border-red-400 border-l-4 border-l-red-500 bg-red-50/20"
              : activeField === "phoneNumber"
                ? "border-lavender-400 border-l-4 border-l-lavender-600 shadow-sm bg-lavender-50/30"
                : "border-lavender-200 border-l-4 border-l-lavender-400 bg-lavender-50/20 hover:border-lavender-300"
          }`}
        >
          {/* Highlighted Question Label */}
          <div className="mb-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                <span>വാട്സ്ആപ്പ് നമ്പർ</span>
                <span className="text-xs font-normal text-slate-500">(WhatsApp Mobile)</span>
                <span className="text-red-500 text-lg leading-none font-bold" title="Required">*</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-lavender-200 text-lavender-900 rounded-md">
                പ്രധാനപ്പെട്ടത്
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ഡിജിറ്റൽ എൻട്രി പാസ്സ് ലഭിക്കുന്നതിനായി 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക
            </p>
          </div>

          {/* Underline / Phone Group Input */}
          <div className="mt-3">
            <div className="flex items-center border-b-2 border-slate-200 focus-within:border-lavender-600 transition-colors">
              <span className="text-sm font-bold text-slate-500 pr-2 select-none border-r border-slate-200 my-1">
                +91
              </span>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="10 അക്ക നമ്പർ (e.g. 9876543210)"
                maxLength={14}
                className="w-full py-2.5 px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phoneNumber}</span>
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-400 font-medium">
                നമ്പർ സുരക്ഷിതമായി സൂക്ഷിക്കും.
              </p>
            )}
          </div>
        </div>

        {/* QUESTION 3: Place / Location (SPECIALLY HIGHLIGHTED) */}
        <div 
          id="field-place"
          onFocus={() => setActiveField("place")}
          onBlur={() => setActiveField(null)}
          className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
            errors.place
              ? "border-red-400 border-l-4 border-l-red-500 bg-red-50/20"
              : activeField === "place"
                ? "border-lavender-400 border-l-4 border-l-lavender-600 shadow-sm bg-lavender-50/30"
                : "border-lavender-200 border-l-4 border-l-lavender-400 bg-lavender-50/20 hover:border-lavender-300"
          }`}
        >
          {/* Highlighted Question Label */}
          <div className="mb-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                <span>സ്ഥലം / പ്രദേശം</span>
                <span className="text-xs font-normal text-slate-500">(Place / Location)</span>
                <span className="text-red-500 text-lg leading-none font-bold" title="Required">*</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-lavender-200 text-lavender-900 rounded-md">
                പ്രധാനപ്പെട്ടത്
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              നിങ്ങളുടെ താമസ സ്ഥലം / പ്രദേശം (ഉദാ: ഉളിക്കൽ, ഇരിട്ടി, പായം, നുച്ച്യാട്...)
            </p>
          </div>

          {/* Underline / Clean Input */}
          <div className="mt-3">
            <input
              type="text"
              value={formData.place}
              onChange={(e) => handleChange("place", e.target.value)}
              placeholder="നിങ്ങളുടെ ഉത്തരം (Your answer)"
              className="w-full py-2.5 px-1 border-b-2 border-slate-200 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent outline-none transition-colors focus:border-lavender-600 hover:border-slate-300"
            />
            {errors.place && (
              <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.place}</span>
              </p>
            )}
          </div>
        </div>

        {/* QUESTION 4 (NEW FIELD): Number of Children */}
        <div 
          id="field-childrenCount"
          onFocus={() => setActiveField("childrenCount")}
          onBlur={() => setActiveField(null)}
          className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
            activeField === "childrenCount"
              ? "border-lavender-300 border-l-4 border-l-lavender-600 shadow-sm"
              : "border-slate-200/90 border-l-4 border-l-transparent hover:border-slate-300"
          }`}
        >
          {/* Highlighted Question Label */}
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>കൂടെയുള്ള കുട്ടികളുടെ എണ്ണം</span>
              <span className="text-xs font-normal text-slate-500">(No. of Children)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              നിങ്ങളോടൊപ്പം പങ്കെടുക്കുന്ന കുട്ടികളുടെ എണ്ണം തിരഞ്ഞെടുക്കുക
            </p>
          </div>

          {/* Google Forms Radio Options / Counter */}
          <div className="mt-3.5">
            <div className="grid grid-cols-5 gap-2">
              {childrenOptions.map((opt) => {
                const isSelected = formData.childrenCount === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange("childrenCount", opt.value)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-lavender-600 text-white border-lavender-600 shadow-sm"
                        : "bg-slate-50 hover:bg-lavender-50 text-slate-700 border-slate-200 hover:border-lavender-300"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Manual Counter alternative for convenience */}
            <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-lavender-600" />
                <span>തിരഞ്ഞെടുത്ത എണ്ണം:</span>
                <strong className="text-lavender-900 text-sm font-bold">
                  {formData.childrenCount === 0 ? "കുട്ടികൾ ഇല്ല (0)" : `${formData.childrenCount} കുട്ടികൾ`}
                </strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleChange("childrenCount", Math.max(0, formData.childrenCount - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer select-none"
                  aria-label="Decrease children count"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {formData.childrenCount}
                </span>
                <button
                  type="button"
                  onClick={() => handleChange("childrenCount", formData.childrenCount + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer select-none"
                  aria-label="Increase children count"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Google Form Bottom Actions (Submit & Clear Form) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-lavender-600 hover:bg-lavender-700 active:scale-[0.98] shadow-md shadow-lavender-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>സമർപ്പിക്കുന്നു...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുക (Submit)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ഫോം മായ്‌ക്കുക (Clear form)</span>
          </button>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-lavender-600 shrink-0" />
          <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുമ്പോൾ ഉടൻതന്നെ ഡിജിറ്റൽ പാസ്സ് ലഭ്യമാകും</span>
        </div>

      </form>

    </div>
  );
};

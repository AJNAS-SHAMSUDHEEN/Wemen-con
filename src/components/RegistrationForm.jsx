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
  GraduationCap,
  Plus,
  X
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

  const [hasTeenspace, setHasTeenspace] = useState(false);
  const [teenspaceStudents, setTeenspaceStudents] = useState([]);
  const [studentInput, setStudentInput] = useState({
    name: "",
    classGrade: "10",
  });
  const [studentError, setStudentError] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleToggleTeenspace = (e) => {
    const checked = e.target.checked;
    setHasTeenspace(checked);
    setStudentError("");
  };

  const handleAddStudent = () => {
    if (!studentInput.name || !studentInput.name.trim()) {
      setStudentError("ദയവായി വിദ്യാർത്ഥിയുടെ പേര് നൽകുക");
      return;
    }
    setStudentError("");
    setTeenspaceStudents(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: studentInput.name.trim(),
        classGrade: studentInput.classGrade || "10",
      }
    ]);
    setStudentInput({ name: "", classGrade: "10" });
  };

  const handleRemoveStudent = (index) => {
    setTeenspaceStudents(prev => prev.filter((_, i) => i !== index));
  };

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

    // Gather all students: existing list + currently typed in input (if any)
    let finalStudents = [...teenspaceStudents];
    if (hasTeenspace && studentInput.name && studentInput.name.trim()) {
      finalStudents.push({
        id: Date.now(),
        name: studentInput.name.trim(),
        classGrade: studentInput.classGrade || "10",
      });
    }

    if (hasTeenspace && finalStudents.length === 0) {
      setApiError("ടീൻസ്പേസിൽ വിദ്യാർത്ഥിയുടെ പേര് നൽകി ചേർക്കുക (Add ചെയ്യുക) അല്ലെങ്കിൽ ടിക്ക് ഒഴിവാക്കുക.");
      return;
    }

    setIsSubmitting(true);

    try {
      const validTeenspaceStudents = hasTeenspace
        ? finalStudents.map((s) => ({ name: s.name.trim(), classGrade: s.classGrade || "10" }))
        : [];

      const newRegistration = await createRegistration({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        place: formData.place,
        childrenCount: formData.childrenCount,
        hasTeenspace: Boolean(hasTeenspace && validTeenspaceStudents.length > 0),
        teenspaceStudents: validTeenspaceStudents,
      });

      // Clear form on success
      setFormData({
        fullName: "",
        phoneNumber: "",
        place: "",
        childrenCount: 0,
      });
      setHasTeenspace(false);
      setTeenspaceStudents([]);
      setStudentInput({ name: "", classGrade: "10" });
      setStudentError("");
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
      {/* Pure White Card with Lavender Border & Soft Shadow */}
      <div className="bg-white rounded-3xl border border-lavender-200/90 shadow-xl shadow-lavender-900/5 overflow-hidden transition-all">

        {/* Soft Lavender Card Header */}
        <div className="bg-gradient-to-br from-lavender-100 via-lavender-50 to-white px-6 sm:px-8 py-6 sm:py-7 border-b border-lavender-200/80 relative">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-lavender-200/90 text-lavender-900 px-3 py-0.5 rounded-full">
              പ്രവേശന രജിസ്ട്രേഷൻ
            </span>
            <span className="text-xs font-bold text-lavender-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-lavender-200/60 shadow-2xs">
              സൗജന്യ പ്രവേശനം
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            നിങ്ങളുടെ സീറ്റ് ഉറപ്പുവരുത്താൻ താഴെ വിവരങ്ങൾ നൽകുക.
          </p>

          <div className="mt-4 pt-3 border-t border-lavender-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-lavender-700" />
              <span>2026 നവംബർ 21 ശനി</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-lavender-700" />
              <span>9:30 AM – 4:00 PM</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-lavender-700" />
              <span>ഉളിക്കൽ ചോയ്സ് ഓഡിറ്റോറിയം</span>
            </span>
          </div>

          {/* Program Details Modal Button */}
          {onOpenDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-lavender-50 border border-lavender-300 text-lavender-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Info className="w-4 h-4 text-lavender-600" />
              <span>മുഴുവൻ പരിപാടി വിവരങ്ങളും പോസ്റ്ററും കാണുക</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-white">

          {/* Error Notice */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold">ശ്രദ്ധിക്കുക</p>
                <p className="mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              പൂർണ്ണ നാമം <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none ${errors.fullName
                  ? "border-rose-300 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white hover:border-lavender-300 focus:border-lavender-600 focus:ring-4 focus:ring-lavender-500/15"
                  }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* 2. WhatsApp Number – SPECIALLY HIGHLIGHTED WITH LAVENDER ACCENT */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-lavender-50/80 border-2 border-lavender-300 space-y-1.5 transition-all shadow-2xs hover:border-lavender-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs sm:text-sm font-bold text-lavender-950">
                  വാട്സ്ആപ്പ് നമ്പർ <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-lavender-200 text-lavender-800 rounded">
                  പ്രധാനം
                </span>
              </div>
              <span className="text-[11px] font-medium text-lavender-700">
                10 അക്ക നമ്പർ
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lavender-700">
                <Phone className="w-4 h-4" />
              </div>
              <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none text-lavender-900 font-bold text-xs border-r border-lavender-200 pr-2">
                +91
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="10 അക്ക വാട്സ്ആപ്പ് നമ്പർ നൽകുക"
                maxLength={14}
                className={`w-full pl-20 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none bg-white ${errors.phoneNumber
                  ? "border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10"
                  : "border-lavender-300 focus:border-lavender-600 focus:ring-4 focus:ring-lavender-500/20"
                  }`}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phoneNumber}</span>
              </p>
            ) : (
              <p className="text-[11px] text-lavender-700 font-medium">
                കൺഫർമേഷൻ പാസ്സ് ലഭിക്കുന്നതിനായി നൽകുക. സ്വകാര്യമായി സൂക്ഷിക്കും.
              </p>
            )}
          </div>

          {/* 3. Place / Location – SPECIALLY HIGHLIGHTED WITH LAVENDER ACCENT */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-lavender-50/80 border-2 border-lavender-300 space-y-1.5 transition-all shadow-2xs hover:border-lavender-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label className="block text-xs sm:text-sm font-bold text-lavender-950">
                  സ്ഥലം (Place / Location) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-lavender-200 text-lavender-800 rounded">
                  പ്രധാനം
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lavender-700">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => handleChange("place", e.target.value)}
                placeholder="നിങ്ങളുടെ സ്ഥലം രേഖപ്പെടുത്തുക"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none bg-white ${errors.place
                  ? "border-rose-400 bg-rose-50/40 focus:ring-4 focus:ring-rose-500/10"
                  : "border-lavender-300 focus:border-lavender-600 focus:ring-4 focus:ring-lavender-500/20"
                  }`}
              />
            </div>
            {errors.place && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.place}</span>
              </p>
            )}
          </div>

          {/* 4. Number of Children Accompanying (കൂടെയുള്ള കുട്ടികൾ) */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-lavender-200/90 space-y-2.5 transition-all shadow-2xs hover:border-lavender-300">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Baby className="w-4 h-4 text-lavender-700 shrink-0" />
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  കൂടെയുള്ള കുട്ടികൾ
                </label>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  ഓപ്ഷണൽ
                </span>
              </div>
              <span className="text-[11px] font-bold text-lavender-700 bg-lavender-50 px-2 py-0.5 rounded-md border border-lavender-200/60 shrink-0">
                {Number(formData.childrenCount) > 0
                  ? `${formData.childrenCount} കുട്ടികൾ`
                  : "കുട്ടികളില്ല (0)"}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              നിങ്ങളോടൊപ്പം കുട്ടികൾ പങ്കെടുക്കുന്നുണ്ടെങ്കിൽ എണ്ണം തിരഞ്ഞെടുക്കുക.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap sm:flex-nowrap">
              {/* Stepper buttons */}
              <div className="flex items-center border border-lavender-300 rounded-xl overflow-hidden bg-lavender-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => handleChange("childrenCount", Math.max(0, (parseInt(formData.childrenCount, 10) || 0) - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lavender-800 hover:bg-lavender-200/70 active:bg-lavender-300 font-black text-lg transition-colors cursor-pointer select-none"
                  aria-label="കുറയ്ക്കുക"
                >
                  −
                </button>
                <div className="w-12 h-10 flex items-center justify-center font-bold text-base text-slate-900 bg-white border-x border-lavender-200">
                  {formData.childrenCount || 0}
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("childrenCount", Math.min(20, (parseInt(formData.childrenCount, 10) || 0) + 1))}
                  className="w-10 h-10 flex items-center justify-center text-lavender-800 hover:bg-lavender-200/70 active:bg-lavender-300 font-black text-lg transition-colors cursor-pointer select-none"
                  aria-label="കൂട്ടുക"
                >
                  +
                </button>
              </div>

              {/* Quick Select Preset Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((count) => {
                  const isSelected = Number(formData.childrenCount) === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleChange("childrenCount", count)}
                      className={`h-10 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${isSelected
                        ? "bg-lavender-600 text-white shadow-xs"
                        : "bg-lavender-50 hover:bg-lavender-100 text-lavender-900 border border-lavender-200"
                        }`}
                    >
                      {count === 0 ? "കുട്ടികളില്ല (0)" : `${count}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Teenspace (ടീൻസ്പേസ് - 10, +1, +2 Students) Option */}
          <div className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 ${
            hasTeenspace 
              ? "bg-lavender-50/90 border-2 border-lavender-400 shadow-sm" 
              : "bg-white border-lavender-200/90 hover:border-lavender-300 shadow-2xs"
          }`}>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasTeenspace}
                onChange={handleToggleTeenspace}
                className="w-5 h-5 mt-0.5 rounded-md text-lavender-600 focus:ring-lavender-500 border-lavender-300 cursor-pointer accent-lavender-600 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-lavender-700" />
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Teenspace (ടീൻസ്പേസ്)
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-lavender-200 text-lavender-900 border border-lavender-300/80">
                    10, +1, +2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                  10, +1, +2 ക്ലാസുകളിലെ വിദ്യാർത്ഥികൾ പങ്കെടുക്കുന്നുണ്ടെങ്കിൽ ടിക്ക് ചെയ്യുക.
                </p>
              </div>
            </label>

            {/* If Teenspace is checked: Input form to enter & Add student */}
            {hasTeenspace && (
              <div className="mt-4 pt-4 border-t border-lavender-200/80 space-y-3.5 animate-fadeIn">
                
                {/* Form to enter student & click Add */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-lavender-300 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ നൽകുക
                    </span>
                    <span className="text-[10px] font-semibold text-lavender-700 bg-lavender-100 px-2 py-0.5 rounded-full">
                      Teenspace
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Student Name Input */}
                    <div>
                      <input
                        type="text"
                        value={studentInput.name}
                        onChange={(e) => {
                          setStudentInput((prev) => ({ ...prev, name: e.target.value }));
                          if (studentError) setStudentError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddStudent();
                          }
                        }}
                        placeholder="വിദ്യാർത്ഥിയുടെ പൂർണ്ണ നാമം"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border outline-none font-medium transition-all ${
                          studentError
                            ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-lavender-600 focus:ring-2 focus:ring-lavender-500/15"
                        }`}
                      />
                      {studentError && (
                        <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{studentError}</span>
                        </p>
                      )}
                    </div>

                    {/* Class Selector & Add Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">ക്ലാസ്സ്:</span>
                        {["10", "+1", "+2"].map((cls) => {
                          const isSelected = studentInput.classGrade === cls;
                          return (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => setStudentInput((prev) => ({ ...prev, classGrade: cls }))}
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-lavender-600 text-white shadow-xs"
                                  : "bg-lavender-50 hover:bg-lavender-100 text-lavender-900 border border-lavender-200"
                              }`}
                            >
                              {cls}
                            </button>
                          );
                        })}
                      </div>

                      {/* Add Student Button */}
                      <button
                        type="button"
                        onClick={handleAddStudent}
                        className="py-2 px-4 rounded-xl bg-lavender-600 hover:bg-lavender-700 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Student</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Students List with Close (✕) Button */}
                {teenspaceStudents.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-lavender-900">
                        ചേർത്ത വിദ്യാർത്ഥികൾ ({teenspaceStudents.length} പേർ)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {teenspaceStudents.map((student, idx) => (
                        <div
                          key={student.id || idx}
                          className="p-3 rounded-xl bg-white border border-lavender-200 shadow-2xs flex items-center justify-between gap-3 animate-fadeIn"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-lavender-100 text-lavender-900 text-xs font-extrabold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-slate-900">
                                {student.name}
                              </p>
                              <span className="inline-block text-[10px] font-bold text-lavender-800 bg-lavender-50 px-1.5 py-0.2 rounded border border-lavender-200 mt-0.5">
                                ക്ലാസ്സ്: {student.classGrade}
                              </span>
                            </div>
                          </div>

                          {/* Close button to remove added student */}
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(idx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="വിദ്യാർത്ഥിയെ ഒഴിവാക്കുക"
                            aria-label="Remove student"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Prominent Lavender Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-lavender-600 hover:bg-lavender-700 active:scale-[0.99] shadow-lg shadow-lavender-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-lavender-600" />
              <span>രജിസ്ട്രേഷൻ പൂർത്തിയാകുമ്പോൾ തൽക്ഷണം ഡിജിറ്റൽ പാസ്സ് ലഭിക്കും</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

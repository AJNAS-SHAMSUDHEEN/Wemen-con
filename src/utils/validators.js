/**
 * Validation utilities for Women's Conference Registration
 */

// Validate Indian mobile numbers (10 digits starting with 6, 7, 8, 9, allowing optional +91, 91, or 0 prefix)
export const validateIndianMobile = (phone) => {
  if (!phone) return { isValid: false, message: "Phone number is required" };
  
  // Strip spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  
  // Check regex for Indian numbers
  // Matches: 9876543210, +919876543210, 919876543210, 09876543210
  const indianRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  
  if (!indianRegex.test(cleanPhone)) {
    return {
      isValid: false,
      message: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)",
    };
  }
  
  return { isValid: true, cleanNumber: formatToStandard10Digit(cleanPhone) };
};

// Normalize to 10-digit string
export const formatToStandard10Digit = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length === 11 && cleaned.startsWith("0")) return cleaned.slice(1);
  if (cleaned.length === 12 && cleaned.startsWith("91")) return cleaned.slice(2);
  return cleaned.slice(-10);
};

// Format for WhatsApp (wa.me) international format: 919876543210
export const formatForWhatsApp = (phone) => {
  const standard10 = formatToStandard10Digit(phone);
  if (standard10.length === 10) {
    return `91${standard10}`;
  }
  return phone.replace(/[^0-9]/g, "");
};

// Pretty display phone: +91 98765 43210
export const formatDisplayPhone = (phone) => {
  const standard10 = formatToStandard10Digit(phone);
  if (standard10.length === 10) {
    return `+91 ${standard10.slice(0, 5)} ${standard10.slice(5)}`;
  }
  return phone;
};

// Validate name
export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, message: "Full Name is required" };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: "Full Name must be at least 2 characters" };
  }
  if (!/^[a-zA-Z\s\.\'\-]+$/.test(name.trim())) {
    return { isValid: false, message: "Full Name contains invalid characters" };
  }
  return { isValid: true };
};

// Validate place
export const validatePlace = (place) => {
  if (!place || !place.trim()) {
    return { isValid: false, message: "Place / Location is required" };
  }
  if (place.trim().length < 2) {
    return { isValid: false, message: "Please enter a valid place name" };
  }
  return { isValid: true };
};


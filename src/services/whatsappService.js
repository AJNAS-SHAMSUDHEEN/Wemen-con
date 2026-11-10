import { formatForWhatsApp } from "../utils/validators";

/**
 * WhatsApp Click-to-Chat Service
 */

export const DEFAULT_REMINDER_TEMPLATE = 
`Assalamu Alaikum {Name},

This is a friendly reminder regarding your registration for the Women's Conference.

Registration ID: {RegistrationId}
Place: {Place}
Food Preference: {FoodPreference}
Preferred Time: {PreferredTime}

Please contact us if you have any changes or queries.

Thank you!`;

export const GENERAL_ANNOUNCEMENT_TEMPLATE =
`Assalamu Alaikum {Name},

Important Update regarding Women's Conference:
We look forward to welcoming you!

Your Registration ID: {RegistrationId}
Session: {PreferredTime}
Venue: Grand Convention Center
Food Service: {FoodPreference}

Please arrive 15 minutes before your session begins.

Warm regards,
Organizing Committee`;

/**
 * Generate formatted reminder message replacing placeholders
 */
export const generateMessage = (template, participant) => {
  if (!participant) return "";
  return template
    .replace(/{Name}/g, participant.fullName || "Participant")
    .replace(/{RegistrationId}/g, participant.registrationId || "N/A")
    .replace(/{Place}/g, participant.place || "N/A")
    .replace(/{FoodPreference}/g, participant.foodPreference || "Not specified")
    .replace(/{PreferredTime}/g, participant.preferredTime || "General");
};

/**
 * Build the wa.me URL
 * IMPORTANT: wa.me requires phone number without '+' or symbols, prefixed with country code
 * e.g., 919876543210
 */
export const getWhatsAppUrl = (phone, text) => {
  const formattedPhone = formatForWhatsApp(phone);
  const encodedText = encodeURIComponent(text || "");
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
};

/**
 * Opens WhatsApp in a new tab with prefilled text
 * User must manually review and press "Send" in WhatsApp
 */
export const openWhatsApp = (phone, text) => {
  if (!phone) {
    alert("Phone number is missing for this participant.");
    return false;
  }
  const url = getWhatsAppUrl(phone, text);
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};

/**
 * Generate a shareable WhatsApp text for participant confirmation
 */
export const generateSelfConfirmationShare = (registration) => {
  return `✨ *Women's Conference 2026 - Registration Confirmation* ✨

Assalamu Alaikum! I have successfully registered for the Women's Conference.

*Registration ID:* ${registration.registrationId}
*Name:* ${registration.fullName}
*Place:* ${registration.place}
*Food Preference:* ${registration.foodPreference}
*Preferred Time:* ${registration.preferredTime}

Join us for an inspiring experience!`;
};

import { formatForWhatsApp } from "../utils/validators";

/**
 * WhatsApp Click-to-Chat Service for Women's Conference - Iritty Mandalam
 */

export const DEFAULT_REMINDER_TEMPLATE = 
`അസ്സലാമു അലൈക്കും {Name},

വിസ്ഡം വിമൻ ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനത്തിലേക്ക് താങ്കൾ വിജയകരമായി രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്.

📋 രജിസ്ട്രേഷൻ വിവരങ്ങൾ:
• Reg ID: {RegistrationId}
• സ്ഥലം: {Place}
• തീയതി: 2026 നവംബർ 21 ശനി
• സമയം: രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ
• വേദി: ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ

സമ്മേളനത്തിൽ കൃത്യസമയത്ത് എത്തിച്ചേരുവാൻ അഭ്യർത്ഥിക്കുന്നു.

നന്ദി,
വിസ്ഡം വിമൻ ഇരിട്ടി സോൺ`;

export const GENERAL_ANNOUNCEMENT_TEMPLATE =
`അസ്സലാമു അലൈക്കും {Name},

ഇരിട്ടി മണ്ഡലം വനിതാ സമ്മേളനം (2026 നവംബർ 21 ശനി)

വേദി: ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ
സമയം: രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 4:00 വരെ
Reg ID: {RegistrationId}

പങ്കെടുക്കുന്നവർ:
• ഡോ. ജൗഹർ മുനവ്വർ
• ടി.കെ ഉബൈദ്
• ഹാരിസ് കായക്കൊടി
• റഊഫ ടീച്ചർ
• ഷഫീഖ് സ്വലാഹി
• നജീബ ടീച്ചർ

മുഴുവൻ സ്ത്രീകളെയും ആദരപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു.
വിസ്ഡം വിമൻ ഇരിട്ടി സോൺ`;

/**
 * Generate formatted reminder message replacing placeholders
 */
export const generateMessage = (template, participant) => {
  if (!participant) return "";
  return template
    .replace(/{Name}/g, participant.fullName || "Participant")
    .replace(/{RegistrationId}/g, participant.registrationId || "N/A")
    .replace(/{Place}/g, participant.place || "N/A");
};

/**
 * Build the wa.me URL
 */
export const getWhatsAppUrl = (phone, text) => {
  const formattedPhone = formatForWhatsApp(phone);
  const encodedText = encodeURIComponent(text || "");
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
};

/**
 * Opens WhatsApp in a new tab with prefilled text
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
  return `✨ *വിസ്ഡം വിമൻ വനിതാ സമ്മേളനം - ഇരിട്ടി മണ്ഡലം* ✨
"വിശ്വാസത്തിൽ കരുത്ത്... ആദർശത്തിൽ മാതൃക... ജീവിതത്തിൽ വിശുദ്ധി!"

അസ്സലാമു അലൈക്കും! ഞാൻ വനിതാ സമ്മേളനത്തിലേക്ക് രജിസ്റ്റർ ചെയ്തു.

• *Reg ID:* ${registration.registrationId}
• *പേര്:* ${registration.fullName}
• *സ്ഥലം:* ${registration.place}
• *തീയതി:* 2026 നവംബർ 21 ശനി (രാവിലെ 9:30 - വൈകിട്ട് 4:00)
• *വേദി:* ചോയ്സ് ഓഡിറ്റോറിയം, നുച്ച്യാട് റോഡ്, ഉളിക്കൽ

എല്ലാവരെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു!`;
};

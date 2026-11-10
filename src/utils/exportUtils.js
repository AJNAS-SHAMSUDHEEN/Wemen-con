import { formatDateTime } from "./formatters";

/**
 * Export participant data to CSV file
 */
export const exportToCSV = (registrations, filename = "womens_conference_registrations.csv") => {
  if (!registrations || !registrations.length) {
    alert("No registrations available to export.");
    return;
  }

  const headers = [
    "Registration ID",
    "Full Name",
    "Phone Number",
    "Place",
    "Status",
    "Registration Date",
    "Notes"
  ];

  const rows = registrations.map((r) => [
    `"${r.registrationId || ""}"`,
    `"${(r.fullName || "").replace(/"/g, '""')}"`,
    `"${r.phoneNumber || ""}"`,
    `"${(r.place || "").replace(/"/g, '""')}"`,
    `"${r.status || "Confirmed"}"`,
    `"${formatDateTime(r.registrationDate)}"`,
    `"${(r.notes || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export participant data to JSON file
 */
export const exportToJSON = (registrations, filename = "womens_conference_registrations.json") => {
  if (!registrations || !registrations.length) {
    alert("No registrations available to export.");
    return;
  }

  const jsonString = JSON.stringify(registrations, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

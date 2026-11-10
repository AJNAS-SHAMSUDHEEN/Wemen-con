# Women's Conference 2026 — Smart Registration & Management System

A modern, high-performance, responsive web application built with **React.js**, **Tailwind CSS**, and **Firebase** (Cloud Firestore & Firebase Authentication) featuring real-time synchronization, participant privacy protection, and seamless **WhatsApp Click-to-Chat** automated reminder messaging.

---

## 🌟 Key Features

### 1. Public Registration Portal
- **High-Impact Hero Section**: Branding, live countdown, and animated statistics counters.
- **Smart Registration Form**:
  - Full Name validation (min. 2 characters, sanitization).
  - Indian Mobile Number validation (10-digit format with regex and duplicate check).
  - Place / Location manual entry.
  - Food Preference selectable cards (*Food Required* vs *Food Not Required*).
  - Session Time slot selection (*Morning*, *Afternoon*, *Evening*, *Full Day*).
  - Optional GPS Location detection (`navigator.geolocation`) with accuracy display and Google Maps coordinates storage.
  - In-flight duplicate submission protection.
- **Celebratory Success Modal**:
  - Confetti burst effect (`canvas-confetti`).
  - Unique Registration ID generation (`WC-2026-XXXXX`).
  - One-click Registration ID copying.
  - Printable / Downloadable conference pass.
  - WhatsApp share button to bookmark or share confirmation.
- **Real-Time Registered Participants Display**:
  - Synced live with Cloud Firestore (`onSnapshot`).
  - Total registered counter banner.
  - Search by participant name or location.
  - Filter by food requirement or city.
  - Privacy safeguards: phone numbers and precise GPS coordinates are masked from the public view.

### 2. Secure Admin Control Center
- **Firebase Authentication**: Protected login screen (`signInWithEmailAndPassword`) with an initial admin creation wizard.
- **Live Statistics Overview**:
  - Total Registrations count.
  - Food Required count and meal percentage.
  - Food Not Required count.
  - Total Unique Places represented.
  - Today's Registrations (joined in the last 24 hours).
- **Interactive Management Table**:
  - Full details: Registration ID, Name, Phone Number, Place, Food Choice, Preferred Time, GPS coordinates + Google Maps link, Registration Date, Status.
  - Filter by Place, Food Preference, Status, and Preferred Session.
  - Sort by Registration Date (Newest / Oldest).
  - Search by Name, Phone Number, Place, or Registration ID.
  - Inline status update dropdown (*Confirmed*, *Attended*, *Pending*, *Cancelled*).
  - View full participant profile modal.
  - Edit participant modal with Firebase update.
  - Delete participant with confirmation dialog.
  - Bulk actions: Select all, Bulk WhatsApp, Bulk Status Change, Bulk Delete.
  - One-click Data Export to **CSV** and **JSON**.

### 3. WhatsApp Click-to-Chat Integration
- WhatsApp button on every participant row in the admin dashboard.
- Automatic international phone formatting (e.g., `919876543210`).
- Pre-filled personalized reminder message:
  ```
  Assalamu Alaikum [Name],

  This is a friendly reminder regarding your registration.

  Registration ID: [ID]
  Place: [Place]
  Food Preference: [Food Preference]
  Preferred Time: [Preferred Time]

  Please contact us if you have any changes.

  Thank you!
  ```
- **Interactive WhatsApp Composer Modal**: Preview and edit custom text before opening WhatsApp.
- **Bulk Queue Stepper**: Send reminders to multiple selected participants in sequence.
- Opens via official `https://wa.me/` protocol; messages require manual admin press to send.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **Icons**: Lucide React
- **Animations / Celebrations**: Canvas Confetti

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
Optimized static files will be generated in `dist/`.

---

## 🔒 Firebase Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    match /registrations/{registrationId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'registrationId', 'fullName', 'phoneNumber', 'place', 'foodPreference', 'preferredTime', 'status'
      ]);
      allow update, delete: if isAuthenticated();
    }
  }
}
```

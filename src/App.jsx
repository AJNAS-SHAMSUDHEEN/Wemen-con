import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { subscribeToPublicParticipants } from "./services/registrationService";

function AppContent() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "admin"
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Real-time public subscription to Cloud Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublicParticipants(
      (data) => {
        setParticipants(data);
        setLoading(false);
      },
      (err) => {
        console.error("Public participants listener error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        participantCount={participants.length}
      />

      {/* Main View Switcher */}
      <div className="flex-1">
        {currentView === "home" ? (
          <HomePage participants={participants} loading={loading} />
        ) : (
          currentUser ? (
            <AdminDashboard />
          ) : (
            <AdminLogin onBackToHome={() => setCurrentView("home")} />
          )
        )}
      </div>

      {/* Footer */}
      <Footer onAdminClick={() => setCurrentView("admin")} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

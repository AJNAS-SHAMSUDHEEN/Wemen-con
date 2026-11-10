import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { subscribeToRegistrationCount } from "./services/registrationService";

function AppContent() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "admin"
  const [totalCount, setTotalCount] = useState(0);
  const { currentUser } = useAuth();

  // Listen to total count for public counter banner (no sensitive data exposed)
  useEffect(() => {
    const unsubscribe = subscribeToRegistrationCount(
      (count) => {
        setTotalCount(count);
      },
      (err) => {
        console.error("Count listener error:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main View: Public vs Admin */}
      <div className="flex-1">
        {currentView === "home" ? (
          <HomePage totalCount={totalCount} />
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

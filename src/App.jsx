import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

function AppContent() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "admin"
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Top Minimal Header Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDetails={() => setIsDetailsOpen(true)}
      />

      {/* Main View: Public Registration Form vs Admin Portal */}
      <div className="flex-1">
        {currentView === "home" ? (
          <HomePage
            isDetailsOpen={isDetailsOpen}
            setIsDetailsOpen={setIsDetailsOpen}
          />
        ) : (
          currentUser ? (
            <AdminDashboard />
          ) : (
            <AdminLogin onBackToHome={() => setCurrentView("home")} />
          )
        )}
      </div>
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

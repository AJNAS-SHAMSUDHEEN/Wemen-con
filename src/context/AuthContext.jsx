import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Login failed:", err);
      let message = "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        message = "No admin account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const registerAdmin = async (email, password, displayName = "Admin") => {
    setAuthError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (err) {
      console.error("Admin registration failed:", err);
      let message = "Failed to create admin account.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (err.code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    setAuthError("");
    await signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    authError,
    setAuthError,
    login,
    registerAdmin,
    logout,
    isAdmin: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

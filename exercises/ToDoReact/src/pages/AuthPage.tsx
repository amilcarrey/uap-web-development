import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";
import AuthForm from "../components/AuthForm";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔄 Already authenticated, redirecting from AuthPage");
      navigate({ to: "/tab/$tabId", params: { tabId: "today" } });
    }
  }, [isAuthenticated, navigate]);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  // Don't render auth form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return <AuthForm mode={mode} onToggleMode={toggleMode} />;
};

export default AuthPage;

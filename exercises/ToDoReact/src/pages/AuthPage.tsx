import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return <AuthForm mode={mode} onToggleMode={toggleMode} />;
};

export default AuthPage;

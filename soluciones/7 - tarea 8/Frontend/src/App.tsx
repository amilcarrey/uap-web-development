import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar } from "./components/NavBar";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div style={{ padding: "20px" }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

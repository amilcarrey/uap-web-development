import MainPage from "./pages/MainPage.tsx";
import { ConfigPage } from "./pages/ConfigPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:id"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ConfigPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster position="bottom-right" reverseOrder={false} />
      </AuthProvider>
    </>
  );
}

export default App;

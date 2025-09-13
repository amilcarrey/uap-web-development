import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './components/dashboard/DashboardPage';
import SettingsPage from './components/settings/SettingsPage'; // Import SettingsPage
import { useAuthStore } from './store/useAuthStore';
import { getMe } from './lib/api';
import { Toaster } from 'sonner'; // Assuming sonner is used for toasts via lib/toast.ts

function App() {
  const { setUser, logout, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      try {
        // The 'getMe' function in api.ts will use the cookie.
        // If the cookie is valid, backend returns user data.
        // If cookie invalid/expired, backend returns 401, axios interceptor handles logout.
        const currentUser = await getMe();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // This case might not be hit if 401 interceptor always logs out
          logout();
        }
      } catch (error) {
        // Error implies no valid session (e.g., 401 caught by interceptor or network error)
        // The interceptor in api.ts should handle the logout action for 401s.
        // If it's another error, we ensure local state is also logged out.
        console.warn("Failed to fetch current user on app load, ensuring logout state.", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [setUser, logout, setLoading]); // Dependencies for useEffect

  // If still loading auth status, show a global loader or blank screen
  // This prevents flicker between public/private routes before auth is confirmed
  if (useAuthStore.getState().isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading application...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add other protected routes here, e.g., /profile */}
            {/* <Route path="profile" element={<ProfilePage />} /> */}
          </Route>

          {/* Fallback for unmatched routes (optional) */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

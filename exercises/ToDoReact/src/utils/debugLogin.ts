// Debug utility for login issues
// Temporary file for debugging

import { useAuthStore } from "../store/authStore";

export const debugLogin = async () => {
  console.log("🔍 Starting login debug...");

  try {
    const API_URL = "http://localhost:4322";
    const email = "demo@example.com";
    const password = "demo123";

    console.log("📡 Making login request to:", `${API_URL}/api/users/login`);
    console.log("📧 Email:", email);

    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("📊 Response status:", response.status);
    console.log(
      "📊 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Login failed:", error);
      return;
    }

    const data = await response.json();
    console.log("✅ Login successful:", data);

    // Test localStorage
    localStorage.setItem("test-token", data.data.token);
    const stored = localStorage.getItem("test-token");
    console.log("💾 LocalStorage test:", stored ? "OK" : "FAILED");

    return data;
  } catch (error) {
    console.error("💥 Network error:", error);
  }
};

export const debugAuthStore = () => {
  console.log("🔍 Auth Store Debug:");
  const store = useAuthStore.getState();
  console.log("👤 User:", store.user);
  console.log("🔑 Token:", store.token);
  console.log("🔒 Is Authenticated:", store.isAuthenticated);
  console.log("⏳ Is Loading:", store.isLoading);

  // Check localStorage
  const persistedData = localStorage.getItem("auth-store");
  console.log(
    "💾 Persisted data:",
    persistedData ? JSON.parse(persistedData) : "None"
  );

  return store;
};

export const testStoreLogin = async () => {
  console.log("🧪 Testing store login...");
  const { login } = useAuthStore.getState();

  try {
    await login("demo@example.com", "demo123");
    console.log("✅ Store login successful");
    debugAuthStore();
  } catch (error) {
    console.error("❌ Store login failed:", error);
  }
};

// Add to window for easy access in browser console
if (typeof window !== "undefined") {
  (window as any).debugLogin = debugLogin;
  (window as any).debugAuthStore = debugAuthStore;
  (window as any).testStoreLogin = testStoreLogin;
}

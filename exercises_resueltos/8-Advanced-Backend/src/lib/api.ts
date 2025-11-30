import axios from "axios";
import { useAuthStore } from "../store/useAuthStore"; // To handle logout on 401

// Determine the base URL from environment variables, defaulting for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending/receiving cookies
});

// Add a response interceptor to handle global errors, like 401 Unauthorized
api.interceptors.response.use(
  (response) => response, // Simply return response if it's successful
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Check if this is not a retry attempt to avoid infinite loops
      // (e.g. if you were implementing token refresh, which is not needed with httpOnly cookies directly)
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Mark it as retried

        // User is not authorized. This could be due to an expired/invalid session.
        // Perform logout action from the auth store.
        // This will update UI and redirect to login page (handled by routing logic).
        console.warn("Unauthorized access (401). Logging out.");
        useAuthStore.getState().logout(); // Call logout from the store

        // Optionally, redirect to login page or show a global message
        // window.location.href = '/login'; // Hard redirect, or use React Router's navigate

        // It's important to return a rejected promise or throw an error
        // to stop the original request's .then() or .catch() chain if needed.
        // Or, if a redirect is happening, this might not matter as much.
        return Promise.reject(error);
      }
    }

    // For other errors, just pass them on
    return Promise.reject(error);
  }
);

// Function to get the current authenticated user
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.data.user; // Backend returns { status, data: { user } }
};
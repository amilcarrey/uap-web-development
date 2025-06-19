// API configuration and utilities
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4322";

// Get token from localStorage (Zustand persist)
const getAuthToken = (): string | null => {
  try {
    const authStore = localStorage.getItem("auth-store");
    if (authStore) {
      const parsed = JSON.parse(authStore);
      return parsed.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
};

// Enhanced fetch with automatic token injection
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, config);

  // Handle 401 errors (unauthorized) - redirect to auth
  if (response.status === 401) {
    // Clear auth store on unauthorized
    localStorage.removeItem("auth-store");
    window.location.href = "/auth";
    throw new Error("Unauthorized");
  }

  return response;
};

// Typed API response helpers
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient(endpoint, { method: "GET" });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const apiPost = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiClient(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const apiPut = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await apiClient(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient(endpoint, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Try to parse JSON, but handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Failed to parse JSON response:", text);
    return {} as T;
  }
};

export { API_URL };

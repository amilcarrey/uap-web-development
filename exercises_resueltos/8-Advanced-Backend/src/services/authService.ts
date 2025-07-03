import { api } from '../lib/api'; // Using the configured axios instance
import { type User } from '../store/useAuthStore'; // Re-using the User type

interface AuthResponse {
  status: string;
  token?: string; // Backend might send token in body too, though we rely on cookie
  data: {
    user: User;
  };
}

interface LogoutResponse {
    status: string;
    message: string;
}

// Registration
export const registerUser = async (credentials: Record<string, string>) => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data.data.user; // Return the user object
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Login
export const loginUser = async (credentials: Record<string, string>) => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data.data.user; // Return the user object
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await api.post<LogoutResponse>('/auth/logout');
    return response.data;
  } catch (error: any) {
    // Even if logout API call fails, frontend should proceed to clear auth state
    console.error("Logout API call failed, but proceeding with client-side logout:", error);
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

// Get current user (me) - already in api.ts, but can be re-exported or called from here
// For consistency, let's keep it in api.ts as `getMe`
// export const getCurrentUser = async () => {
//   try {
//     const response = await api.get<AuthResponse>('/auth/me');
//     return response.data.data.user;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch user');
//   }
// };

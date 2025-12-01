// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../store/hooks';
import { resetUIState } from '../store/uiSlice';
import { authService } from '../services/authService';
import { type User, type UserSettings } from '../types';

interface AuthContextType {
    user: User | null;
    settings: UserSettings | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    // Verificar autenticación al cargar
    useEffect(() => {
        checkAuthOnMount();
    }, []);

    const checkAuthOnMount = async () => {
        // ✅ Evitar múltiples llamadas simultáneas
        if (isCheckingAuth) return;
        
        setIsCheckingAuth(true);
        setIsLoading(true);

        try {
        console.log('🔍 Checking authentication...');
        const profile = await authService.getProfile();
        console.log('✅ User authenticated:', profile.user);
        
        setUser(profile.user);
        
        // Solo obtener settings si el usuario está autenticado
        try {
            const userSettings = await authService.getUserSettings();
            setSettings(userSettings);
        } catch (settingsError) {
            console.warn('⚠️ Could not load user settings:', settingsError);
            // No fallar por settings, usar defaults
            setSettings({ refresh_interval: 5000, uppercase_descriptions: false, todos_per_page: 10 });
        }
        } catch (error: any) {
        console.log('❌ User not authenticated:', error.response?.status);
        // ✅ NO mostrar error si es 401 (usuario no autenticado es normal)
        if (error.response?.status !== 401) {
            console.error('Auth check error:', error);
        }
        setUser(null);
        setSettings(null);
        } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
        }
            
    }

    const login = async (email: string, password: string) => {
        try {
            console.log('🔐 Attempting login...');
            const response = await authService.login({ email, password });
            console.log('✅ Login successful:', response.user);
            
            // ✅ Resetear estado UI para empezar limpio con el nuevo usuario
            console.log('🔄 Resetting UI state for new user session...');
            dispatch(resetUIState());
            
            setUser(response.user);
            
            // ✅ Invalidar queries específicas para asegurar datos frescos del nuevo usuario
            console.log('🔄 Invalidating user-specific queries...');
            await queryClient.invalidateQueries({ queryKey: ['boards'] });
            await queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
            await queryClient.invalidateQueries({ queryKey: ['users'] });
            await queryClient.invalidateQueries({ queryKey: ['todos'] });
            
            try {
                const userSettings = await authService.getUserSettings();
                setSettings(userSettings);
            } catch (settingsError) {
                console.warn('⚠️ Could not load settings after login:', settingsError);
                setSettings({ refresh_interval: 5000, uppercase_descriptions: false, todos_per_page: 10 });
            }
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error; // Re-throw para que el componente pueda manejarlo
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            console.log('📝 Attempting registration...');
            const response = await authService.register({ username, email, password });
            console.log('✅ Registration successful:', response.user);
            
            setUser(response.user);
            
            // ✅ Limpiar caché y resetear estado UI para usuario nuevo
            console.log('🧹 Clearing cache and resetting UI state for new user...');
            queryClient.clear();
            dispatch(resetUIState());
            
            // Crear settings por defecto para nuevo usuario
            try {
                const userSettings = await authService.getUserSettings();
                setSettings(userSettings);
            } catch (settingsError) {
                console.warn('⚠️ Could not load settings after registration:', settingsError);
                setSettings({ refresh_interval: 5000, uppercase_descriptions: false, todos_per_page: 10 });
            }
        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Logging out...');
            await authService.logout();
            console.log('✅ Logout successful');
        } catch (error) {
            console.warn('⚠️ Logout request failed, clearing local state anyway:', error);
        } finally {
            // ✅ Limpiar completamente el caché de React Query
            console.log('🧹 Clearing React Query cache...');
            queryClient.clear();
            
            // ✅ Resetear completamente el estado UI de Redux
            console.log('🔄 Resetting UI state...');
            dispatch(resetUIState());
            
            // ✅ Siempre limpiar el estado local
            setUser(null);
            setSettings(null);
            
            console.log('🎯 Cache, UI state, and auth state cleared successfully');
        }
    };

    const updateSettings = async (newSettings: Partial<UserSettings>) => {
        if (!user) throw new Error('User not authenticated');
    
        const updatedSettings = await authService.updateUserSettings(newSettings);
        setSettings(updatedSettings);
    };

    const refreshProfile = async () => {
        // ✅ Solo refrescar si ya está autenticado
        if (!user) return;
        
        try {
            const profile = await authService.getProfile();
            setUser(profile.user);
        } catch (error) {
            console.error('Error refreshing profile:', error);
            // Si falla el refresh, cerrar sesión
            setUser(null);
            setSettings(null);
        }
    };

    const value: AuthContextType = {
        user,
        settings,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateSettings,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};
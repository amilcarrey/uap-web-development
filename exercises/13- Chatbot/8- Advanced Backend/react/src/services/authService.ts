import api from '../lib/api';
import { type RegisterData, type LoginData, type UserSettings, type User } from '../types'


export const authService = {
    async register(data: RegisterData): Promise<{ user: User }> {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration service error:', error);
            throw error;
        }
    },

    async login(data: LoginData): Promise<{ user: User }> {
        try {
            const response = await api.post('/auth/login', data);
            return response.data;
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout service error:', error);
            throw error;
        }
    },

    async getProfile(): Promise<{ user: User }> {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            // ✅ NO loggear error 401 como error crítico
            if (error.response?.status === 401) {
                throw new Error('Not authenticated');
            }
            console.error('Profile service error:', error);
            throw error;
        }
    },

    async getUserSettings(): Promise<UserSettings> {
        try {
            const response = await api.get('/auth/settings');
            return response.data;
        } catch (error) {
            console.error('Settings service error:', error);
            throw error;
        }
    },

    async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
        try {

            // // ✅ Normalizar tipos para asegurar que los booleanos no se envíen como números
            // const normalizedSettings = {
            //     ...settings,
            //     // Asegurar que uppercase_descriptions sea booleano
            //     ...(settings.uppercase_descriptions !== undefined && {
            //         uppercase_descriptions: Boolean(settings.uppercase_descriptions)
            //     }),
            //     // Asegurar que otros campos numéricos sean números
            //     ...(settings.refresh_interval !== undefined && {
            //         refresh_interval: Number(settings.refresh_interval)
            //     }),
            //     ...(settings.todos_per_page !== undefined && {
            //         todos_per_page: Number(settings.todos_per_page)
            //     })
            // };
            
            // console.log('📤 Sending normalized settings:', normalizedSettings);
            // const response = await api.put('/auth/settings', normalizedSettings);

            console.log('Updating user settings:', typeof settings.uppercase_descriptions);
            const response = await api.put('/auth/settings', settings);
            return response.data;
        } catch (error) {
            console.error('Update settings service error:', error);
            throw error;
        }
    },

    async getUserBoards(): Promise<Array<any>> {
        try {
            const response = await api.get('/auth/boards');
            return response.data;
        } catch (error) {
            console.error('User boards service error:', error);
            throw error;
        }
    },

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get('/auth/users');
            return response.data;
        } catch (error) {
            console.error('Get all users service error:', error);
            throw error;
        }
    }
};
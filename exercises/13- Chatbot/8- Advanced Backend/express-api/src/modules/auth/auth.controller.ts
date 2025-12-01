import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto, UpdateSettingsDto } from '../../types';

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: RegisterUserDto = req.body;

            // Valiaciones basicas de entrada HTTP
            if (!userData.email?.trim() || !userData.password || !userData.username?.trim()) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            // Validar formato de email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(userData.email.trim())) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }

            // Validar longitud minima de contrasenia
            if (userData.password.length < 6) {
                res.status(400).json({ error: 'Password must be at least 6 characters' });
                return;
            }

            // Validar formato de username
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(userData.username.trim())) {
                res.status(400).json({ 
                    error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' 
                });
                return;
            }

            // Sanitizar datos
            userData.email = userData.email.toLowerCase().trim();
            userData.username = userData.username.trim();

            // Llamar al Service
            const { user, token } = await this.authService.register(userData);

            res.cookie('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 60 * 1000 // 2 horas
            });

            res.status(201).json({ user })
        } catch (error) {
            console.error('Error registering user:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to register user' });
            }
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData: LoginUserDto = req.body;

            // Validaciones basicas de entrada HTTP
            if (!loginData.email || !loginData.password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            // Sanitizar email
            loginData.email = loginData.email.toLowerCase().trim();

            // Llamar al Service
            const { user, token } = await this.authService.login(loginData);

            // Configurar cookie HTTP-only
            res.cookie('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 60 * 1000 // 2 horas
            });

            res.json({ user })
        } catch (error) {
            console.error('Error logging in user:', error);
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to login' });
            }
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        res.clearCookie('auth-token');
        res.status(200).json({ message: 'Logged out successfully' });
    }

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user; // El usuario ya está inyectado por el middleware de autenticación
            if (!user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user info:', error);
            res.status(500).json({ error: 'Failed to fetch user info' });
        }
    }

    getUserSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user; // El usuario ya está inyectado por el middleware de autenticación
            if (!user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const settings = await this.authService.getUserSettings(user.id);
            if (!settings) {
                res.status(404).json({ error: 'Settings not found' });
                return;
            }
            res.json(settings);
        } catch (error) {
            console.error('Error fetching user settings:', error);
            res.status(500).json({ error: 'Failed to fetch user settings' });
        }
    }

    updateUserSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user; 

            if (!user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const settingsData: UpdateSettingsDto = req.body;

            // Validaciones basicas de entrada HTTP
            if (settingsData.refresh_interval !== undefined) {
                if (typeof settingsData.refresh_interval !== 'number') {
                    res.status(400).json({ error: 'refresh_interval must be a number' });
                    return;
                }
            }

            if (settingsData.uppercase_descriptions !== undefined) {
                if (typeof settingsData.uppercase_descriptions !== 'boolean') {
                    res.status(400).json({ error: 'uppercase_descriptions must be a boolean' });
                    return;
                }
            }

            if (settingsData.todos_per_page !== undefined) {
                if (typeof settingsData.todos_per_page !== 'number' || 
                    settingsData.todos_per_page < 1 || 
                    settingsData.todos_per_page > 100) {
                    res.status(400).json({ error: 'todos_per_page must be a number between 1 and 100' });
                    return;
                }
            }

            // Llamar al Service
            const updatedSettings = await this.authService.updateUserSettings(user.id, settingsData);

            if (!updatedSettings) {
                res.status(404).json({ error: 'Settings not found' });
                return;
            }

            res.json(updatedSettings);
        } catch (error) {
            console.error('Error updating user settings:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to update user settings' });
            }
        }
    }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.authService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };
}
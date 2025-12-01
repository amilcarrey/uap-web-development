import { AuthRepository } from "./auth.repository";
import { User, RegisterUserDto, LoginUserDto, UserSettings } from "../../types";
import jwt from "jsonwebtoken";

export class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
    
    constructor(private authRepository: AuthRepository) {}

    async register(userData: RegisterUserDto): Promise<{ user: User, token: string }> {
        const { username, email, password } = userData;

        // Validaciones de entrada en el controller
        // Validar formato de email en el controller

        // Validar si ya existe el usuario
        const emailExists = await this.authRepository.emailExists(email);
        if (emailExists) {
            throw new Error("Email already exists");
        }

        const usernameExists = await this.authRepository.usernameExists(username);
        if (usernameExists) {
            throw new Error("Username already exists");
        }

        // Validaciones de reglas de negocio complejas
        if (this.isWeakPassword(password)) {
            throw new Error('Password is too weak. Must contain uppercase, lowercase, and numbers');
        }

        if (this.isInvalidUsername(username)) {
            throw new Error('Username contains invalid characters');
        }

        // Crear usuario si pasa todas las validaciones
        const user = await this.authRepository.createUser(userData)
        const token  = this.generateToken(user);

        return { user, token };
    }

    async login(loginData: LoginUserDto): Promise<{ user: User, token: string }> {
        const { email, password } = loginData;

        // Validaciones de entrada
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        // Obtener usuario con password por email
        const userWithPassword = await this.authRepository.getUserByEmail(email);
        if (!userWithPassword) {
            throw new Error("User not found");
        }

        // Verificar contraseña
        const isPasswordValid = await this.authRepository.verifyPassword(password, userWithPassword.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        // Obtener usuario sin la password
        const user = await this.authRepository.getUserById(userWithPassword.id);
        if (!user) {
            throw new Error("User not found");
        }

        // Generar token
        const token = this.generateToken(user);

        return { user, token };
    }

    // Métodos privados para validaciones de negocio complejas
    private isWeakPassword(password: string): boolean {
        // Requiere al menos una mayúscula, una minúscula y un número
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return !(hasUpper && hasLower && hasNumber);
    }

    private isInvalidUsername(username: string): boolean {
        // Solo permite letras, números y guiones bajos
        const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
        return !validUsernameRegex.test(username);
    }

    async getAllUsers(): Promise<User[]> {
        return this.authRepository.getAllUsers();
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.authRepository.getUserById(id);
    }

    async getUserSettings(userId: number): Promise<UserSettings | undefined> {
        return this.authRepository.getUserSettings(userId);
    }

    async updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings> {
        // Validar que el usuario exista en el controller
        // Validar campos de configuración en el controller 

        // Validaciones de reglas de negocio
        if (settings.refresh_interval !== undefined) {
            if (settings.refresh_interval < 1000) {
                throw new Error('Refresh interval must be at least 1000ms');
            }
            if (settings.refresh_interval > 300000) { // 5 minutos máximo
                throw new Error('Refresh interval cannot exceed 5 minutes');
            }
        }

        // Actualizar configuraciones
        return await this.authRepository.updateUserSettings(userId, settings);
    }

    private generateToken(user: User): string {
        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username
        }

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: '2h', // Token válido por 2 horas
            issuer: 'todo-app'
        });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
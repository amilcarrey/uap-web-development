import database from "../../db/connection";
import { User, UserWithPassword, RegisterUserDto, UserSettings } from '../../types';
import { hash, verify} from 'argon2';

export class AuthRepository {
    async createUser(userData: RegisterUserDto): Promise<User> {
        const { username, email, password } = userData;

        // Hashear la contraseña
        const hashedPassword = await hash(password, {
            type: 2, //Argon2id
            memoryCost: 8192, // 8MB, aptos para esta app
            timeCost: 2, // 2 iteraciones, no es muy excesivo
            parallelism: 1,
        });

        // Insertar el nuevo usuario
        await database.run(
            `INSERT INTO users (username, email, password_hash, created_at, updated_at) 
            VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
            [username, email, hashedPassword]
        );

        // Obtener el ID del último usuario insertado
        const result = await database.get<{ id: number }>('SELECT last_insert_rowid() as id');
        const userId = result?.id || 0;

        // Crear configuraciones por defecto
        await database.run(
            `INSERT INTO user_settings (user_id, refresh_interval, uppercase_descriptions, todos_per_page, created_at, updated_at) 
            VALUES (?, 10000, 0, 10, datetime('now'), datetime('now'))`,
            [userId]
        );


        // Obtener el usuario recién creado
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error('Failed to create user');
        }
        
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return database.all<User>(
            `SELECT id, username, email, created_at, updated_at FROM users ORDER BY created_at ASC`
        );
    }

    async getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
        return database.get<UserWithPassword>(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
    }

    async getUserById(id: number): Promise<User | undefined> {
        return database.get<User>(
            `SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?`,
            [id]
        );
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        return database.get<User>(
            `SELECT id, username, email, created_at, updated_at FROM users WHERE username = ?`,
            [username]
        );
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return verify(hashedPassword, plainPassword);
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await database.get<{ id: number }>(
            `SELECT 1 FROM users WHERE email = ? LIMIT 1`,
            [email]
        );
        return !!user;
    }

    async usernameExists(username: string): Promise<boolean> {
        const user = await database.get<{ id: number }>(
            `SELECT 1 FROM users WHERE username = ? LIMIT 1`,
            [username]
        );
        return !!user;
    }

    async getUserSettings(userId: number): Promise<UserSettings | undefined> {
        return database.get<UserSettings>(
            `SELECT * FROM user_settings WHERE user_id = ?`,
            [userId]
        );
    }

    async updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings> {
        const updates: string[] = [];
        const params: any[] = [];

        if (settings.refresh_interval !== undefined) {
            updates.push('refresh_interval = ?');
            params.push(settings.refresh_interval);
        }

        if (settings.uppercase_descriptions !== undefined) {
            updates.push('uppercase_descriptions = ?');
            params.push(settings.uppercase_descriptions);
        }

        if (settings.todos_per_page !== undefined) {
            updates.push('todos_per_page = ?');
            params.push(settings.todos_per_page);
        }

        if (updates.length === 0) {
            throw new Error('No settings to update');
        }

        params.push(userId); // Agregar el userId al final de los parámetros

        // Actualizar
        await database.run(
            `UPDATE user_settings SET ${updates.join(', ')}, updated_at = datetime('now') WHERE user_id = ?`,
            params
        );

        const updatedSettings = await this.getUserSettings(userId);
        if (!updatedSettings) {
            throw new Error('Failed to update user settings');
        }
        return updatedSettings;
    }
} 
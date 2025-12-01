import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { hash } from 'argon2';
import dotenv from 'dotenv';
dotenv.config();

export class Database {
    private db: sqlite3.Database;
    private static instance: Database;
    private initialized: boolean = false;

    private constructor() {
        const dbPath = path.join(__dirname, '../../database.sqlite');
        const dbExists = fs.existsSync(dbPath);
        
        this.db = new sqlite3.Database(dbPath);
        
        if (!dbExists) {
            // Inicializar de forma síncrona al crear la instancia
            this.init().catch(err => {
                console.error('Error initializing database:', err);
            });
        } else {
            this.initialized = true;
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async run(sql: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row as T);
                }
            })
        })
    }

    async all<T>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as T[]);
                }
            })
        })
    }    
    
    private async init() {
        console.log('Initializing database schema...');

        // Tabla de Users
        await this.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    
        // Tabla de Boards
        await this.run(`
            CREATE TABLE IF NOT EXISTS boards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                owner_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        `);
        
        // Tabla de Todos
        await this.run(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                board_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
            )
        `);

        // Tabla de permisos
        await this.run(`
            CREATE TABLE IF NOT EXISTS board_permissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                board_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                permission_level TEXT NOT NULL CHECK (permission_level IN ('owner', 'editor', 'viewer')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                UNIQUE (board_id, user_id) -- Un usuario solo puede tener un permiso por tablero
            )
        `);

        // Tabla de settings del user
        await this.run(`
            CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                refresh_interval INTEGER DEFAULT 10000,
                uppercase_descriptions BOOLEAN DEFAULT 0,
                todos_per_page INTEGER DEFAULT 10,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `);
        
        // Migración: Agregar columna todos_per_page si no existe
        try {
            await this.run(`
                ALTER TABLE user_settings 
                ADD COLUMN todos_per_page INTEGER DEFAULT 10
            `);
            console.log('Migration: Added todos_per_page column to user_settings');
        } catch (error) {
            // La columna ya existe o hubo otro error - esto es normal en SQLite
            console.log('todos_per_page column already exists or migration not needed');
        }
        
        // Insertar un usuario de prueba con contraseña hasgeada
        const hashedPassword = await hash('demo123', {
            type: 2, //Argon2id
            memoryCost: 8192, // 8MB, aptos para esta app
            timeCost: 2, // 2 iteraciones, no es muy excesivo
            parallelism: 1,
        })
        await this.run(`
            INSERT OR IGNORE INTO users (username, email, password_hash)
            VALUES ('demo', 'demo@example.com', ?) 
        `, [hashedPassword]);

        // Obtener usuario demo creado
        const user = await this.get<{ id: number }>(
            `SELECT id FROM users WHERE username = ?`,
            ['demo']
        );

        if (user) {
            // Insertar tablero demo
            await this.run(
                `INSERT INTO boards (name, owner_id) VALUES (?, ?)`,
                ['Demo Board', user.id]
            );
            // Obtener tablero demo creado
            const board = await this.get<{ id: number }>(
                `SELECT id FROM boards WHERE owner_id = ? ORDER BY id DESC LIMIT 1`,
                [user.id]
            );

            if (board) {
                // Crear permiso de propietario
                await this.run(`
                    INSERT OR IGNORE INTO board_permissions (board_id, user_id, permission_level)
                    VALUES (?, ?, 'owner')
                `, [board.id, user.id]);

                // Crear todos demo
                await this.run(
                    `INSERT INTO todos (board_id, text, completed) VALUES (?, ?, ?)`,
                    [board.id, 'Primer TODO', 0]
                );
                await this.run(
                    `INSERT INTO todos (board_id, text, completed) VALUES (?, ?, ?)`,
                    [board.id, 'Segundo TODO', 1]
                );
                await this.run(
                    `INSERT INTO todos (board_id, text, completed) VALUES (?, ?, ?)`,
                    [board.id, 'Tercer TODO', 0]
                );

                // Crear configuraciones por defecto para el usuario
                await this.run(`
                    INSERT OR IGNORE INTO user_settings (user_id, refresh_interval, uppercase_descriptions, todos_per_page)
                    VALUES (?, 10000, 0, 10)
                `, [user.id]);
            }
        }
        
        this.initialized = true;
        console.log('Database initialized successfully');
    }

    close(): void {
    this.db.close();
    }
}

const database = Database.getInstance();
export default database;
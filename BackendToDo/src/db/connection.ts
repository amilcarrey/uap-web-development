import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export class Database {
    private db: sqlite3.Database;

    constructor(){
        const dbPath = path.join(__dirname, "../../database.sqlite");
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    private async init(){
        await this.run(`
            CREATE TABLE IF NOT EXISTS tareas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                descripcion TEXT NOT NULL,
                completada BOOLEAN DEFAULT FALSE,
                idTablero TEXT NOT NULL
            )
        `);

        await this.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        await this.run(`
            CREATE TABLE IF NOT EXISTS tableros (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                alias TEXT UNIQUE NOT NULL
            )
        `);

        // Poblar datos iniciales si no existen
        const tableros = await this.query("SELECT COUNT(*) as count FROM tableros");
        if (tableros[0].count === 0) {
            await this.run("INSERT INTO tableros (id, nombre, alias) VALUES (?, ?, ?)", 
                ["tb-1", "Personal", "personal"]);
            await this.run("INSERT INTO tableros (id, nombre, alias) VALUES (?, ?, ?)", 
                ["tb-2", "Configuracion", "configuracion"]);
        }

        const tareas = await this.query("SELECT COUNT(*) as count FROM tareas");
        if (tareas[0].count === 0) {
            await this.run("INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)", 
                ["Limpiar pieza", false, "tb-1"]);
            await this.run("INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)", 
                ["Barrer sala", false, "tb-1"]);
            await this.run("INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)", 
                ["Lavar los platos", false, "tb-1"]);
            await this.run("INSERT INTO tareas (descripcion, completada, idTablero) VALUES (?, ?, ?)", 
                ["Bañarme", false, "tb-1"]);
        }
    }

    run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    query(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}
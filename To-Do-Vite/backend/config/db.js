const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear la base de datos en el directorio del proyecto
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos SQLite:', err.message);
    } else {
        initializeDatabase();
    }
});

// Función para inicializar las tablas
const initializeDatabase = () => {
    // Habilitar foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Crear tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Crear tabla de tableros
    db.run(`
        CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Crear tabla de usuarios de tableros
    db.run(`
        CREATE TABLE IF NOT EXISTS board_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            board_id INTEGER,
            user_id INTEGER,
            role TEXT DEFAULT 'member',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            UNIQUE(board_id, user_id)
        )
    `);

    // Crear tabla de tareas
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0,
            board_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
        )
    `);

    // Crear tabla de enlaces compartidos
    db.run(`
        CREATE TABLE IF NOT EXISTS shared_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            board_id INTEGER,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
        )
    `);

    // Crear tabla de ajustes de usuario
    db.run(`
        CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            refetch_interval INTEGER DEFAULT 30,
            items_per_page INTEGER DEFAULT 10,
            uppercase_tasks BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    // Crear usuario admin por defecto si no existe
    db.get('SELECT * FROM users WHERE username = ?', ['luca'], (err, row) => {
        if (err) {
            console.error('Error al verificar usuario admin:', err);
        } else if (!row) {
            const bcrypt = require('bcrypt');
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)', 
                ['luca', hashedPassword, 1], (err) => {
                if (err) {
                    console.error('Error al crear usuario admin:', err);
                }
            });
        }
    });
};

// Función helper para promisificar las consultas
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve({ rows });
            }
        });
    });
};

// Función helper para consultas que devuelven una sola fila
const queryOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve({ rows: row ? [row] : [] });
            }
        });
    });
};

// Función helper para consultas de inserción/actualización
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ 
                    rows: [{ id: this.lastID }],
                    rowCount: this.changes 
                });
            }
        });
    });
};

module.exports = {
    db,
    query,
    queryOne,
    run
}; 
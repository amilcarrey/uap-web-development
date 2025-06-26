// src/db/connection.ts
import sql, { ConnectionPool } from "mssql";
//import { database as config } from "../../config/database"; // tu config
import  dbConfig from './dbconfig'// Make sure the file is named exactly 'dbconfig.ts'


class Database {
  private pool: ConnectionPool | undefined;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      this.pool = await sql.connect(dbConfig);
      console.log("Conectado a SQL Server");
    } catch (error) {
      console.error("Error al conectar a SQL Server:", error);
    }
  }

  async run(query: string, params: any[] = []): Promise<void> {
    if (!this.pool) throw new Error("Base de datos no conectada");

    const request = this.pool.request();
    params.forEach((param, index) => {
      request.input(`p${index}`, param);
    });

    await request.query(this.replaceParams(query, params.length));
  }

  async get<T>(query: string, params: any[] = []): Promise<T | undefined> {
    if (!this.pool) throw new Error("Base de datos no conectada");

    const request = this.pool.request();
    params.forEach((param, index) => {
      request.input(`p${index}`, param);
    });

    const result = await request.query<T>(this.replaceParams(query, params.length));
    return result.recordset[0];
  }

  async all<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) throw new Error("Base de datos no conectada");

    const request = this.pool.request();
    params.forEach((param, index) => {
      request.input(`p${index}`, param);
    });

    const result = await request.query<T>(this.replaceParams(query, params.length));
    return result.recordset;
  }

  private replaceParams(query: string, count: number): string {
    // Convierte los ? a @p0, @p1, etc.
    for (let i = 0; i < count; i++) {
      query = query.replace("?", `@p${i}`);
    }
    return query;
  }

  close(): void {
    this.pool?.close();
  }
}

export const database = new Database();

// import sql from "mssql";
// import dbConfig from './Dbconfig'; // Make sure the file is named exactly 'dbconfig.ts'



// class Database {
//   private pool!: sql.ConnectionPool;

  //   constructor(private config: sql.config) {}

  //   async connect(): Promise<void> {
  //     try {
  //       this.pool = await sql.connect(this.config);
  //       console.log("Conectado a SQL Server");
//     } catch (err) {
//       console.error("Error de conexión a la base de datos:", err);
//       throw err;
//     }
//   }

//   async run(query: string, params: any[] = []): Promise<void> {
//     const request = this.pool.request();
//     params.forEach((p, i) => {
//       request.input(`p${i}`, p);
//     });
//     await request.query(query);
//   }

//   async get<T>(query: string, params: any[] = []): Promise<T | undefined> {
//     const request = this.pool.request();
//     params.forEach((p, i) => {
//       request.input(`p${i}`, p);
//     });
//     const result = await request.query(query);
//     return result.recordset[0] as T;
//   }

//   async all<T>(query: string, params: any[] = []): Promise<T[]> {
//     const request = this.pool.request();
//     params.forEach((p, i) => {
//       request.input(`p${i}`, p);
//     });
//     const result = await request.query(query);
//     return result.recordset as T[];
//   }

//   async close(): Promise<void> {
//     await this.pool.close();
//   }
// }

// export const database = new Database(dbConfig);

//ESTABA ANTES DE LOS PROFESSSS
// //empiezan con mayusculaaa, en el types empiezan xith lowercase
// import sqlite3 from "sqlite3";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config();

// class Database {
//   private db: sqlite3.Database;

//   // constructor() {
//   //   const dbPath = path.join(__dirname, "../../database2.sqlite");
//   //   this.db = new sqlite3.Database(dbPath);
//   //   // Aca podemos condicionalmente crear las tablas si no existen con una variable de entorno
//   //   this.init();
//   // }
//   constructor() {
//   const dbPath = path.join(__dirname, "../../database2.sqlite");
//   this.db = new sqlite3.Database(dbPath);
//   this.init().then(() => {
//     console.log("Inicialización de la base de datos completa.");
//   });
//   // Después de crear la base de datos
// this.db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
//   if (err) console.error(err);
//   else console.log("Tablas en la base de datos:", rows);
// });
// }

//   private async init() {
//     if (process.env.POPULATE_DB === "true") {
// await this.run(`
//   CREATE TABLE IF NOT EXISTS Users (
//     Id TEXT PRIMARY KEY,
//     Username TEXT NOT NULL UNIQUE,
//     PasswordHash TEXT NOT NULL
//   )
// `);

// await this.run(`
//   CREATE TABLE IF NOT EXISTS Boards (
//     Id TEXT PRIMARY KEY,
//     Name TEXT NOT NULL,
//     OwnerId TEXT NOT NULL,
//     FOREIGN KEY (OwnerId) REFERENCES Users(Id) ON DELETE CASCADE
//   )
// `);

// await this.run(`
//   CREATE TABLE IF NOT EXISTS Reminders (
//     Id TEXT PRIMARY KEY,
//     Name TEXT NOT NULL,
//     Completed INTEGER DEFAULT 0,
//     BoardId TEXT NOT NULL,
//     CreatedBy TEXT,
//     UpdatedBy TEXT,
//     CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (BoardId) REFERENCES Boards(Id) ON DELETE CASCADE,
//     FOREIGN KEY (CreatedBy) REFERENCES Users(Id) ON DELETE SET NULL,
//     FOREIGN KEY (UpdatedBy) REFERENCES Users(Id) ON DELETE SET NULL
//   )
// `);

// await this.run(`
//   CREATE TABLE IF NOT EXISTS Permissions (
//     Id TEXT PRIMARY KEY,
//     UserId TEXT NOT NULL,
//     BoardId TEXT NOT NULL,
//     AccessLevel TEXT NOT NULL CHECK (AccessLevel IN ('owner','full_access', 'viewer')),
//     CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE (UserId, BoardId),
//     FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
//     FOREIGN KEY (BoardId) REFERENCES Boards(Id) ON DELETE CASCADE
//   )
// `);

// await this.run(`
//   CREATE TABLE IF NOT EXISTS UserSettings (
//     UserId TEXT PRIMARY KEY,
//     RefreshInterval INTEGER DEFAULT 30,
//     ShowUppercase INTEGER DEFAULT 0,
//     CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
//   )
// `);
// await this.run(`
//   INSERT OR IGNORE INTO users (id, username, password_hash)
//   VALUES 
//     ('u1', 'floppy', 'hashed123'),
//     ('u2', 'admin', 'hashed456');
// `);

// await this.run(`
//   INSERT OR IGNORE INTO boards (id, name, owner_id)
//   VALUES 
//     ('b1', 'Personal', 'u1'),
//     ('b2', 'Trabajo', 'u2');
// `);

// await this.run(`
//   INSERT OR IGNORE INTO reminders (id, name, completed, board_id, created_by, updated_by)
//   VALUES 
//     ('t1', 'Estudiar SQLite', 0, 'b1', 'u1', 'u1'),
//     ('t2', 'Preparar presentación', 1, 'b2', 'u2', 'u2');
// `);

// await this.run(`
//   INSERT OR IGNORE INTO permissions (id, user_id, board_id, access_level)
//   VALUES 
//     ('p1', 'u1', 'b1', 'full_access'),
//     ('p2', 'u2', 'b2', 'full_access'),
//     ('p3', 'u1', 'b2', 'viewer');
// `);

// await this.run(`
//   INSERT OR IGNORE INTO user_settings (user_id, refresh_interval, show_uppercase)
//   VALUES 
//     ('u1', 15, 1),
//     ('u2', 30, 0);
// `);
//     }
//   }

//   async run(sql: string, params: any[] = []): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.db.run(sql, params, function (err) {
//         if (err) reject(err);
//         else resolve();
//       });
//     });
//   }

//   async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
//     return new Promise((resolve, reject) => {
//       this.db.get(sql, params, (err, row) => {
//         if (err) reject(err);
//         else resolve(row as T);
//       });
//     });
//   }

//   async all<T>(sql: string, params: any[] = []): Promise<T[]> {
//     return new Promise((resolve, reject) => {
//       this.db.all(sql, params, (err, rows) => {
//         if (err) reject(err);
//         else resolve(rows as T[]);
//       });
//     });
//   }

//   close(): void {
//     this.db.close();
//   }
// }

// export const database = new Database();


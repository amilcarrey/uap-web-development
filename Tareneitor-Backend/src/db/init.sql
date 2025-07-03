-- Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INTEGER PRIMARY KEY,
    nombre_usuario TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configuraciones
CREATE TABLE IF NOT EXISTS Configuraciones (
    id_config INTEGER PRIMARY KEY,
    usuario_id INTEGER UNIQUE,
    auto_refresh_interval INTEGER,
    vista_preferida TEXT,
    otras_preferencias TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
);

-- Tableros
CREATE TABLE IF NOT EXISTS Tableros (
    id_tablero INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    propietario_id INTEGER,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (propietario_id) REFERENCES Usuarios(id_usuario)
);

-- Permisos
CREATE TABLE IF NOT EXISTS Permisos (
    usuario_id INTEGER,
    tablero_id INTEGER,
    permiso TEXT CHECK (permiso IN ('propietario', 'editor', 'lector')),
    PRIMARY KEY (usuario_id, tablero_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (tablero_id) REFERENCES Tableros(id_tablero)
);

-- Tareas
CREATE TABLE IF NOT EXISTS Tareas (
    id_tarea INTEGER PRIMARY KEY,
    contenido TEXT NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    tablero_id INTEGER,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tablero_id) REFERENCES Tableros(id_tablero)
);

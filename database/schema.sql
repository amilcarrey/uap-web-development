-- Estructura de la base de datos para To-Do App
-- Ejecutar este script después de crear la base de datos 'todo_app'

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tabla de tableros
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Personal', 'Universidad')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de relación usuarios-tableros
CREATE TABLE IF NOT EXISTS board_users (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    UNIQUE(board_id, user_id)
);

-- Tabla de enlaces compartidos
CREATE TABLE IF NOT EXISTS shared_links (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
CREATE INDEX IF NOT EXISTS idx_board_users_board_id ON board_users(board_id);
CREATE INDEX IF NOT EXISTS idx_board_users_user_id ON board_users(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_links(token);
CREATE INDEX IF NOT EXISTS idx_shared_links_board_id ON shared_links(board_id);

-- Insertar usuario admin por defecto (cambiar la contraseña)
-- Esta es la contraseña hasheada para 'admin123' - ¡CÁMBIALA!
INSERT INTO users (username, password) VALUES 
('luca', '$2b$10$rQZ8K9mN2pL4vX7wY1sA3eB6cD8fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA0') 
ON CONFLICT (username) DO NOTHING; 
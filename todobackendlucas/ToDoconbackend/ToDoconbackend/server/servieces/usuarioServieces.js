import pool from "../db/db.js";
import bcrypt from "bcrypt";

// Crear usuario
export const crearUsuarioService = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) throw new Error("Faltan datos requeridos");
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [nombre, email, password_hash]
  );
  return result.rows[0];
};

// Obtener todos los usuarios
export const obtenerUsuariosService = async () => {
  const result = await pool.query("SELECT * FROM usuarios");
  return result.rows;
};

// Obtener usuario por ID
export const obtenerUsuarioPorIdService = async (id) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
  return result.rows[0];
};

// Actualizar usuario
export const actualizarUsuarioService = async (id, { nombre, email, password }) => {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "UPDATE usuarios SET nombre = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *",
    [nombre, email, password_hash, id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

// Eliminar usuario
export const eliminarUsuarioService = async (id) => {
  const result = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
  return result.rowCount > 0;
};

// Obtener usuario por email (para login)
export const obtenerUsuarioPorEmailService = async (email) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return result.rows[0];
};

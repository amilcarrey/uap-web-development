// userService.js
import pool from "../db/db.js";
import bcrypt from "bcrypt";

export async function crearUsuarioService({ username, email, password }) {
  console.log("En service crearUsuarioService:", username, email);
  const password_hash = await bcrypt.hash(password, 10);
  console.log("Password hasheado:", password_hash);
  const result = await pool.query(
    "INSERT INTO usuarios (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password_hash]
  );
  console.log("Query INSERT ejecutada. Result:", result.rows[0]);
  return result.rows[0];
}

export async function obtenerUsuariosService() {
  const result = await pool.query("SELECT * FROM usuarios");
  return result.rows;
}

export async function obtenerUsuarioPorIdService(id) {
  const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
  return result.rows[0];
}

export async function eliminarUsuarioService(id) {
  const result = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
  return result.rowCount > 0;
}

export async function buscarUsuarioPorEmail(email) {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

export async function validarPassword(user, password) {
  return await bcrypt.compare(password, user.password_hash);
}

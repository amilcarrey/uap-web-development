import { Usuario } from "../models/types"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Database } from "../db/connection";

const db = new Database();

export async function registrarUsuario(nombre: string, email: string, password: string): Promise<Usuario | null> {
  // Verificar si el usuario ya existe
  const existe = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  if (existe.length > 0) return null;

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario
  const nuevoUsuario = await db.run("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)", [nombre, email, hashedPassword]);
  return { id: nuevoUsuario.lastID, nombre, email, password: hashedPassword };  
}

export async function autenticarUsuario(email: string, password: string): Promise<{ token: string } | null> {
  // Buscar el usuario por email
  const usuarios = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  if (usuarios.length === 0) return null;

  // Verificar la contraseña
  const usuario = usuarios[0];
  const passwordMatch = await bcrypt.compare(password, usuario.password);
  if (!passwordMatch) return null;

  // Generar el token
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  return { token };
}

export async function obtenerUsuarioPorId(id: string): Promise<Usuario | null> {
  const usuarios = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return usuarios.length > 0 ? usuarios[0] as Usuario : null;
}   

export async function obtenerUsuarios(): Promise<Usuario[]> {
  return db.query("SELECT * FROM usuarios");
}   

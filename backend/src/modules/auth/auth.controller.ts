import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { CreateUserRequest, LoginRequest } from "./auth.dto";
import db from "../../db/knex";
import { AuthRequest } from "../../middleware/auth.middleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = new AuthService(new AuthRepository());

export const register = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    const user = await authService.register(userData);
    res.status(201).json(user);
  } catch (err: any) {
    const status = err.message === "El usuario ya existe" ? 409 : 400;
    res.status(status).json({ error: err.message || "Error en el registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  // Validaciones específicas
  if (!nombre && !email) {
    return res
      .status(400)
      .json({ error: "Debes ingresar tu nombre de usuario o email." });
  }
  if (!password) {
    return res.status(400).json({ error: "Debes ingresar tu contraseña." });
  }

  // Buscar usuario por nombre o email
  const user = await db("users")
    .where(function () {
      if (nombre) this.where("nombre", nombre);
      if (email) this.orWhere("email", email);
    })
    .first();

  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado." });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }

  // Generar JWT y setear cookie
  const token = jwt.sign(
    { userId: user.id, nombre: user.nombre },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ nombre: user.nombre, role: user.role });
};

export const me = (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) throw new Error("No autenticado");
    res.json({ nombre: req.nombre, userId: req.userId });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "No autenticado" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const borrarCuenta = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) throw new Error("No autenticado");

    // 1. Obtener todos los tableros donde el usuario es propietario
    const tableros = await db("tableros").where({ userId }).select("id");

    // 2. Eliminar tareas de esos tableros
    const tableroIds = tableros.map((t) => t.id);
    if (tableroIds.length > 0) {
      await db("tareas").whereIn("tableroId", tableroIds).delete();
      await db("tablero_usuarios").whereIn("tablero_id", tableroIds).delete();
      await db("tableros").whereIn("id", tableroIds).delete();
    }

    // 3. Eliminar relaciones de compartición donde el usuario es colaborador
    await db("tablero_usuarios").where({ usuario_id: userId }).delete();

    // 4. Eliminar fondos y configuración del usuario
    await db("user_fondos").where({ user_id: userId }).delete();
    await db("user_config").where({ user_id: userId }).delete();

    // 5. Finalmente, eliminar el usuario
    await db("users").where({ id: userId }).delete();

    res.clearCookie("token");
    res.json({ mensaje: "Cuenta eliminada" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error al borrar cuenta" });
  }
};
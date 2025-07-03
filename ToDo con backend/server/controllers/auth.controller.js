import {
  crearUsuarioService,
  obtenerUsuariosService,
  obtenerUsuarioPorIdService,
  eliminarUsuarioService,
  buscarUsuarioPorEmail,
  validarPassword,
} from "../servieces/userServieces.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

const generateToken = (user) =>
  jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

export async function registerUser(req, res) {
  const { username, email, password } = req.body;
  console.log("Llega al controller de registro", req.body);
  try {
    const existingUser = await buscarUsuarioPorEmail(email);
    console.log("Resultado buscarUsuarioPorEmail:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    const newUser = await crearUsuarioService({ username, email, password });
    console.log("Resultado crearUsuarioService:", newUser);

    const token = generateToken(newUser);
    const { password_hash, ...userSinHash } = newUser;
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userSinHash,
    });
  } catch (error) {
    console.error("Error en registerUser:", error);
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await obtenerUsuariosService();
    const usersSinHash = users.map(({ password_hash, ...user }) => user);
    res.status(200).json({ users: usersSinHash });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await obtenerUsuarioPorIdService(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    const { password_hash, ...userSinHash } = user;
    res.status(200).json({ user: userSinHash });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const result = await eliminarUsuarioService(id);
    if (!result)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await buscarUsuarioPorEmail(email);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isValidPassword = await validarPassword(user, password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = generateToken(user);
    const { password_hash, ...userSinHash } = user;
    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ message: "Inicio de sesión exitoso", user: userSinHash });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Sesión cerrada con éxito" });
}

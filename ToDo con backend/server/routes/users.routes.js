import {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";

const usuarioRoutes = () => {
  const router = Router();

  // Rutas de usuarios
  router.get("/", authMiddleware, getUsers);
  router.get("/:id", authMiddleware, getUserById);

  router.delete("/:id", authMiddleware, deleteUser);

  // Ruta de registro de usuario
  router.post("/register", registerUser);

  // Ruta de inicio de sesión
  router.post("/login", loginUser);

  // Ruta de cierre de sesión
  router.post("/logout", authMiddleware, logoutUser);

  // Ruta para obtener el usuario actual
  router.get("/me", authMiddleware, (req, res) => {
    const { password_hash, ...userSinHash } = req.user;
    res.status(200).json({ user: userSinHash });
  });

  return router;
};

export default usuarioRoutes;

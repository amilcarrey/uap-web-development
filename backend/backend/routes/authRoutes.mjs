import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../db.mjs";
const router = express.Router();

const JWT_SECRET = "secretito"; // ← deberías usar .env

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const db = await connectDB();

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.status(201).send("Usuario creado");
  } catch (err) {
    res.status(400).json({ error: "Usuario ya existe" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await connectDB();
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "2h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Login correcto" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout exitoso");
});

export default router;
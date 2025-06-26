import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "reflect-metadata";

import "./middleware/auth.middleware";

import { tableroRoutes } from "./routes/tableros.route";
import { tareasRoutes } from "./routes/tareas.routes";
import { authRoutes } from "./routes/auth.route";
import { permissionsRoutes } from "./routes/permissions.route";

import { requestLogger } from "./middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "http://localhost:4321",
  credentials: true,
}));
app.options("*", cors({
  origin: "http://localhost:4321",
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(requestLogger);


app.use("/api/auth", authRoutes);
app.use("/api/tableros", tableroRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/permissions", permissionsRoutes);


app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});


if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientPath = path.resolve(__dirname, "..", "frontend", "dist");

  app.use(express.static(clientPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}


app.use("*", (_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


app.use(errorHandler);


function printRoutes(stack: any[], prefix = "") {
  stack.forEach((layer) => {
    if (layer.route) {
      const path = prefix + layer.route.path;
      const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
      console.log(`${methods} ${path}`);
    } else if (layer.name === "router" && layer.handle.stack) {
      const nestedPrefix = layer.regexp?.source
        ?.replace(/^\\/, "")
        .replace(/\\\/\?\(\?=\\\/\|\$\)/, "")
        .replace(/\\\//g, "/") || "";
      printRoutes(layer.handle.stack, prefix + nestedPrefix);
    }
  });
}

console.log("Rutas cargadas en el servidor:");
printRoutes(app._router.stack);


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🩺 Health check disponible en /health`);
});


process.on("SIGTERM", () => {
  console.log("⏹ SIGTERM recibido, cerrando servidor...");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("⏹ SIGINT recibido, cerrando servidor...");
  process.exit(0);
});

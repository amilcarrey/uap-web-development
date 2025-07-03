// Test simple para verificar el servidor
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware para capturar rutas no encontradas
app.use("*", (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Ruta no encontrada",
    method: req.method,
    url: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
  console.log("Rutas disponibles:");
  console.log("  GET  /test");
  console.log("  POST /api/users/register");
});

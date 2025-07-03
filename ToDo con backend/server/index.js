import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 3000;

//middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Permite enviar cookies
  })
);

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", {
    "content-type": req.headers["content-type"],
    cookie: req.headers["cookie"] ? "presente" : "ausente",
    origin: req.headers["origin"],
  });
  console.log("Body:", req.body);
  next();
});

//rutas
import tareaRoutes from "./routes/tarea.routes.js";
import tableroRoutes from "./routes/tableros.routes.js";
import usuarioRoutes from "./routes/users.routes.js";

app.use("/api", tareaRoutes());
app.use("/api", tableroRoutes());
app.use("/api/users", usuarioRoutes());

// Rutas de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "API funcionando correctamente", timestamp: new Date() });
});

app.post("/api/test-tablero", (req, res) => {
  console.log("Test tablero - Body recibido:", req.body);
  res.json({
    message: "Ruta de prueba tablero",
    received: req.body,
    authenticated: !!req.cookies.token,
  });
});

//ruta de inicio
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

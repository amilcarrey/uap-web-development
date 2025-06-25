import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/connection";
import routes from "./routes";
import { requestLogger } from "./middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for frontend integration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173", // Default Vite dev server port
    "http://localhost:4321", // Alternative frontend port
    "http://localhost:3000", // Common React dev port
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "The Old Stand TO-DO",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      boards: "/api/boards",
      tasks: "/api/tasks",
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log("1- ARRANCANDO BD");
    await initializeDatabase(); // MAKING SURE THAT THE connection.ts WORKS PROPERLY
    console.log("3- BD OK");

    app.listen(PORT, () => {
      console.log(`4- BACKEND DE EXPRESS: http://localhost:${PORT}`);
      console.log(
        `DOCUMENTACION DE LA API - http://localhost:${PORT}/api/health`
      );
      console.log(
        `5- FRONTEND REACT: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
    });
  } catch (error) {
    console.error("❌ ERROR PARA CONTACTAR EL BACKEND", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n HASTA LA PROXIMA");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n HASTA LA PROXIMA");
  process.exit(0);
});

// Start the server
startServer();

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/connection";
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for frontend integration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Default Vite dev server port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(requestLogger); // Temporarily disable

// Routes
console.log("Adding routes individually...");

try {
  console.log("Adding user routes...");
  const userRoutes = require("./routes/user.routes").default;
  app.use("/api/users", userRoutes);
  console.log("✓ User routes added successfully");
} catch (error) {
  console.error(
    "✗ Error adding user routes:",
    error instanceof Error ? error.message : String(error)
  );
}

try {
  console.log("Adding board routes...");
  const boardRoutes = require("./routes/board.routes").default;
  app.use("/api/boards", boardRoutes);
  console.log("✓ Board routes added successfully");
} catch (error) {
  console.error(
    "✗ Error adding board routes:",
    error instanceof Error ? error.message : String(error)
  );
}

try {
  console.log("Adding task routes...");
  const taskRoutes = require("./routes/task.routes").default;
  app.use("/api/tasks", taskRoutes);
  console.log("✓ Task routes added successfully");
} catch (error) {
  console.error(
    "✗ Error adding task routes:",
    error instanceof Error ? error.message : String(error)
  );
}

// Basic test route
app.get("/", (_req, res) => {
  res.json({
    message: "Todo Backend API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      boards: "/api/boards",
      tasks: "/api/tasks",
    },
  });
});

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    console.log("Database initialized successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

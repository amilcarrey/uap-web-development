import express from "express";
import cors from "cors";
//import { wallRoutes } from "./routes/board.route";
import { requestLogger } from "./middleware/request-logger.middleware";
import { authRoutes } from "./routes/auth.route";
//import { boardRoutes } from "./routes/board.route";
import { reminderRoutes } from "./routes/reminder.route";
import {permissionRoutes} from "./routes/permission.route";
import {userSettingsRoutes} from "./routes/userSettings.route";
import  {boardRoutes} from "./routes/board.route";
import cookieParser from "cookie-parser";




const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173'], 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers you want to allow
};

app.use(cors(corsOptions));
// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cookieParser("secret"));

// Routes
//app.use("/api/walls", wallRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes)
app.use("/api/reminder", reminderRoutes)
app.use("/api/permission", permissionRoutes);
app.use("/api/user-settings", userSettingsRoutes);
// app.us"("/api/messages", messageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  //console.log(`Health check: http://localhost:${PORT}/health`);
  //console.log ("la bd is running", dbConfig);
});




const { Connection, Request: TediousRequest } = require('tedious');


 
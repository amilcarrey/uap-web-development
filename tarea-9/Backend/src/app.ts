import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";

export const createApp = () => {
  const app = express();

  // ⚡ habilitar CORS
  app.use(cors({
    origin: "http://localhost:5173" // permite solo tu frontend
  }));

  app.use(express.json());
  app.use("/api", apiRouter);

  // health
  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

  // error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error(err);
    res.status(500).json({ error: err?.message ?? "Internal server error" });
  });

  return app;
};

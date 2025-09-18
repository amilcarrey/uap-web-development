import app from "./app"; // donde exportes tu app de express
import { runMigrations } from "./db/migrations";

const PORT = process.env.PORT || 3000;

export async function startServer() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

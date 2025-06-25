import express from "express";
import router from "./routes";
import cors from "cors";
import { requestLogger } from "./middleware/request-logger.middleware";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8008;

app.use(cors({
  origin: "http://localhost:5173", // o el puerto de tu frontend
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

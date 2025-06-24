import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();
const PORT = 8008;

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

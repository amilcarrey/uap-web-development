import express from "express";
import cors from "cors";
import { books } from "./routes/books.js";
import { reviews } from "./routes/reviews.js";


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));


app.get("/", (_req, res) => res.send("BookVerse API"));
app.use("/api/books", books);
app.use("/api/reviews", reviews);


const PORT = 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
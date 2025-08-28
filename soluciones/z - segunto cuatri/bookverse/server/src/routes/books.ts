import { Router } from "express";
import { getBook, searchBooks } from "../services/googleBooks.js";


export const books = Router();


// GET /api/books/search?q=...
books.get("/search", async (req, res) => {
    try {
        const q = String(req.query.q || "").trim();
        if (!q) return res.status(400).json({ error: "Falta query q" });
        const result = await searchBooks(q);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});


// GET /api/books/:id
books.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await getBook(id);
        res.json(result);
    } catch (e: any) {
        res.status(404).json({ error: e.message });
    }
});
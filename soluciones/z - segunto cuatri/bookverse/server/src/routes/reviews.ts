import { Router } from "express";
import { InMemoryReviewRepo } from "../infra/reviewRepo.js";
import { ReviewService } from "../domain/reviewService.js";


const repo = new InMemoryReviewRepo();
const service = new ReviewService(repo);


export const reviews = Router();


// Helper para leer X-User-Id
function requireUserId(req: any) {
    const userId = String(req.header("X-User-Id") || "").trim();
    if (!userId) throw new Error("X-User-Id requerido");
    return userId;
}


// GET /api/reviews?bookId=...
reviews.get("/", async (req, res) => {
    try {
        const bookId = String(req.query.bookId || "").trim();
        if (!bookId) return res.status(400).json({ error: "Falta bookId" });
        const items = await service.listForBook(bookId);
        res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});


// POST /api/reviews
reviews.post("/", async (req, res) => {
    try {
        const userId = requireUserId(req);
        const created = await service.create(req.body, userId);
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});


// POST /api/reviews/:id/vote { value: 1 | -1 }
reviews.post("/:id/vote", async (req, res) => {
    try {
        const userId = requireUserId(req);
        const value = Number(req.body?.value);
        if (value !== 1 && value !== -1) return res.status(400).json({ error: "value debe ser 1 o -1" });
        const updated = await service.vote(req.params.id, userId, value);
        res.json(updated);
    } catch (e: any) {
        const msg = e.message || "Error";
        const code = msg.includes("no encontrada") ? 404 : 400;
        res.status(code).json({ error: msg });
    }
});
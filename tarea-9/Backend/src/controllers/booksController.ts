// src/controllers/booksController.ts

import { Request, Response } from "express";
import * as gb from "../services/googleBooksService.js";
import * as reviewsService from "../services/reviewsService.js";

// Buscar libros en Google Books
export async function searchBooks(req: Request, res: Response) {
  const q = String(req.query.q || "");
  try {
    const items = await gb.searchBooks(q);
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Error al buscar libros" });
  }
}

// Obtener un libro por ID
export async function getBook(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const item = await gb.getBookById(id);
    if (!item) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Error al obtener libro" });
  }
}

// Obtener reseñas de un libro
export async function getBookReviews(req: Request, res: Response) {
  const bookId = req.params.id;
  try {
    const reviews = await reviewsService.getReviewsForBook(bookId);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Error al obtener reseñas" });
  }
}

// Crear una reseña
export async function createReview(req: Request, res: Response) {
  try {
    const { userId, bookId, rating, content } = req.body;

    if (!bookId || !rating || !content) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const review = await reviewsService.createReview({
      userId: userId ?? "anon",
      bookId,
      rating,
      content,
    });

    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Error al crear reseña" });
  }
}

// Votar reseña
export async function voteReview(req: Request, res: Response) {
  try {
    const reviewId = Number(req.params.id);
    const { userId, vote } = req.body;

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ error: "El voto debe ser 1 o -1" });
    }

    const updated = await reviewsService.voteReview(
      reviewId,
      String(userId ?? "anon"),
      vote
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Error al votar reseña" });
  }
}

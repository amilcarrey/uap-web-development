// src/controllers/reviewsController.ts
import { Request, Response } from "express";
import * as reviewsService from "../services/reviewsService.js";

// Crear una reseña
export const createReview = async (req: Request, res: Response) => {
  try {
    const { bookId, rating, content, userId } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ error: "Faltan datos obligatorios: bookId o rating" });
    }

    const review = await reviewsService.createReview({
      userId: userId ?? "anonymous",
      bookId,
      rating,
      content,
    });

    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Listar reseñas de un libro
export const listReviews = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ error: "Falta el bookId en los parámetros" });
    }

    const reviews = await reviewsService.getReviewsForBook(bookId);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

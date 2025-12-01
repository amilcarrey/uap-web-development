// src/services/reviewsService.ts
// Servicio de reseñas en memoria para prototipado.
// En producción reemplazar por repositorio/DB.

export type Review = {
  id: number;
  userId: string;
  bookId: string;
  rating: number; // 1..5
  content?: string;
  createdAt: string;
  votes: { userId: string; vote: 1 | -1 }[];
};

let REVIEWS: Review[] = [];
let nextId = 1;

// Crear reseña
export const createReview = async (payload: {
  userId?: string;
  bookId: string;
  rating: number;
  content?: string;
}): Promise<Review> => {
  const userId = payload.userId ?? "anonymous";

  if (!payload.bookId) {
    throw new Error("El campo bookId es obligatorio");
  }
  if (
    !Number.isInteger(payload.rating) ||
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    throw new Error("La calificación debe ser un entero entre 1 y 5");
  }

  const r: Review = {
    id: nextId++,
    userId,
    bookId: payload.bookId,
    rating: payload.rating,
    content: payload.content,
    createdAt: new Date().toISOString(),
    votes: [],
  };

  REVIEWS.push(r);
  return r;
};

// Obtener reseñas de un libro
export const getReviewsForBook = async (
  bookId: string
): Promise<
  {
    id: number;
    userId: string;
    rating: number;
    content?: string;
    createdAt: string;
    score: number;
    votesCount: number;
  }[]
> => {
  return REVIEWS.filter((r) => r.bookId === bookId).map((r) => ({
    id: r.id,
    userId: r.userId,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt,
    score: r.votes.reduce((s, v) => s + v.vote, 0),
    votesCount: r.votes.length,
  }));
};

// Votar reseña
export const voteReview = async (
  reviewId: number,
  userId: string,
  vote: 1 | -1
): Promise<{ id: number; score: number; votesCount: number }> => {
  const review = REVIEWS.find((r) => r.id === reviewId);
  if (!review) throw new Error("Reseña no encontrada");

  const existing = review.votes.find((v) => v.userId === userId);

  if (existing) {
    if (existing.vote === vote) {
      // mismo voto => eliminar (toggle)
      review.votes = review.votes.filter((v) => v.userId !== userId);
    } else {
      // cambiar voto
      existing.vote = vote;
    }
  } else {
    review.votes.push({ userId, vote });
  }

  return {
    id: review.id,
    score: review.votes.reduce((s, v) => s + v.vote, 0),
    votesCount: review.votes.length,
  };
};

// Solo para tests
export const _resetForTests = () => {
  REVIEWS = [];
  nextId = 1;
};

// src/services/reviewsService.ts
export interface Review {
  id: string;
  bookId: string;
  user: string;
  text: string;
  rating: number;
  votes: number;
  userVotes?: Record<string, number>;
}

// Obtener reseñas de un libro
export async function getReviews(bookId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?bookId=${bookId}`);
  if (!res.ok) throw new Error("Error cargando reseñas");
  return res.json();
}

// Crear nueva reseña
export async function postReview(
  bookId: string,
  user: string,
  text: string,
  rating: number
): Promise<Review> {
  const res = await fetch(`/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, user, text, rating }),
  });
  if (!res.ok) throw new Error("Error creando reseña");
  return res.json();
}

// Votar una reseña (1 o -1)
export async function voteReviewApi(
  reviewId: string,
  vote: number,
  user: string
): Promise<Review> {
  const res = await fetch(`/api/reviews`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId, vote, user }),
  });
  if (!res.ok) throw new Error("Error votando la reseña");
  return res.json();
}

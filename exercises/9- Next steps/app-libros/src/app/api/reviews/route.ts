import { NextRequest, NextResponse } from "next/server";

// Simularemos un almacenamiento en memoria
let reviews: any[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json([], { status: 200 });

  const bookReviews = reviews.filter(r => r.bookId === bookId);
  return NextResponse.json(bookReviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { bookId, user, text, rating } = body;

  if (!bookId || !text || !rating) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const review = {
    id: Date.now().toString(),
    bookId,
    user,
    text,
    rating,
    votes: 0,
  };

  reviews.push(review);

  // 🔹 DEBUG: mostrar todas las reseñas guardadas en memoria
  console.log("Reseñas actuales en memoria:", reviews);

  return NextResponse.json(review);
}


export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { reviewId, vote, user } = body;

  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });

  // Evitamos que el mismo usuario vote varias veces en la misma reseña
  review.userVotes = review.userVotes || {};
  if (review.userVotes[user]) return NextResponse.json({ error: "Ya votaste" }, { status: 403 });

  review.votes += vote;
  review.userVotes[user] = vote;

  return NextResponse.json(review);
}

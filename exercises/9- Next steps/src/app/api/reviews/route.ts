import { NextRequest, NextResponse } from "next/server";
import { Review, CreateReview } from "@/types/review";

// Persistencia temporal en memoria
let reviews: Review[] = [];
let reviewCounter = 1;

// 👉 GET: listar reseñas por bookId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json([], { status: 200 });

  const bookReviews = reviews.filter(r => r.bookId === bookId);
  return NextResponse.json(bookReviews);
}

// 👉 POST: crear reseña nueva
export async function POST(req: NextRequest) {
  const data: CreateReview = await req.json();

  const newReview: Review = {
    id: reviewCounter.toString(),
    bookId: data.bookId,
    author: data.author,
    rating: data.rating,
    comment: data.comment,
    votesUp: 0,
    votesDown: 0,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  reviewCounter += 1;
  return NextResponse.json(newReview, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { reviewId, voteType } = await req.json();

  const review = reviews.find(r => r.id === reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (voteType === "up") review.votesUp += 1;
  else if (voteType === "down") review.votesDown += 1;

  return NextResponse.json(review, { status: 200 });
}

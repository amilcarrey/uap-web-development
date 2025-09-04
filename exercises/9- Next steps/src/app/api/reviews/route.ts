import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { CreateReview } from "@/types/review";

// GET: listar reseñas por bookId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json([], { status: 200 });

  const reviews = db
    .prepare("SELECT * FROM reviews WHERE bookId = ? ORDER BY createdAt DESC")
    .all(bookId);

  return NextResponse.json(reviews);
}

// POST: crear reseña nueva
export async function POST(req: NextRequest) {
  const data: CreateReview = await req.json();
  const stmt = db.prepare(`
    INSERT INTO reviews (bookId, author, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(data.bookId, data.author, data.rating, data.comment, new Date().toISOString());

  const review = db.prepare("SELECT * FROM reviews WHERE id = ?").get(info.lastInsertRowid);
  return NextResponse.json(review, { status: 201 });
}

// PATCH: votar reseña
export async function PATCH(req: NextRequest) {
  const { reviewId, voteType } = await req.json();
  const review = db.prepare("SELECT * FROM reviews WHERE id = ?").get(reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  if (voteType === "up") db.prepare("UPDATE reviews SET votesUp = votesUp + 1 WHERE id = ?").run(reviewId);
  else if (voteType === "down") db.prepare("UPDATE reviews SET votesDown = votesDown + 1 WHERE id = ?").run(reviewId);

  const updated = db.prepare("SELECT * FROM reviews WHERE id = ?").get(reviewId);
  return NextResponse.json(updated);
}

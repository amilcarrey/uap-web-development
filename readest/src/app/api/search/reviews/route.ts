import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: obtener todas las reseñas de un libro
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { bookId: Number(bookId) },
  });

  return NextResponse.json(reviews);
}

// POST: crear una nueva reseña
export async function POST(req: Request) {
  try {
    const { bookId, reviewer, rating, content } = await req.json();

    if (!bookId || !reviewer || !rating || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookId: Number(bookId),
        reviewer,
        rating: Number(rating),
        content,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

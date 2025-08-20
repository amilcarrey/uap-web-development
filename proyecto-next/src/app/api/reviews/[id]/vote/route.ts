import { NextResponse } from "next/server";
import { addVote, readReviews } from "@/lib/storage";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId, value } = await req.json();

  if (!userId || ![1, -1].includes(value)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const reviews = readReviews();
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  addVote(id, userId, value);

  const updatedReview = readReviews().find((r) => r.id === id);

  return NextResponse.json(updatedReview);
}

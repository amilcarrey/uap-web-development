import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Review } from "@/app/models/Review";
import { requireAuth } from "@/app/middleware/auth"; // <-- esta línea faltaba


export async function POST(req: Request) {
  try {
    const user = requireAuth(req);
    const { reviewId, vote } = await req.json();

    await connectMongo();

    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Reseña no encontrada");

    // Evitar votar varias veces por el mismo usuario
    if (!review.voters) review.voters = [];
    if (review.voters.includes(user.id)) throw new Error("Ya votaste esta reseña");

    review.votes += vote;
    review.voters.push(user.id);
    await review.save();

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

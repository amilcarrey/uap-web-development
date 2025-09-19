import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongo";
import { Review } from "@/app/models/Review";
import { requireAuth } from "@/app/middleware/auth";

export async function POST(req: Request) {
  try {
    const user = requireAuth(req); // usuario autenticado
    const { bookId, rating, comment } = await req.json();

    await connectMongo();

    const review = await Review.create({
      bookId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      votes: 0,
    });

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

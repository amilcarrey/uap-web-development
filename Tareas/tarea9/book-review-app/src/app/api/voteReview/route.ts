import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { reviewId, delta } = await req.json();

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { votes: { increment: delta } },
  });

  return NextResponse.json(updated);
}

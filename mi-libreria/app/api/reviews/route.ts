import { NextResponse } from 'next/server';
import { reviewSchema } from '@/lib/review.locals';

// Simple in-memory store for demo (replace with DB for production)
const reviewsStore: Record<string, any[]> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const volumeId = searchParams.get('volumeId');
  if (!volumeId) {
    return NextResponse.json({ error: 'Missing volumeId' }, { status: 400 });
  }
  return NextResponse.json(reviewsStore[volumeId] || []);
}

export async function POST(request: Request) {
  const { volumeId, rating, content } = await request.json();
  if (!volumeId || !rating || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    const review = reviewSchema.parse({
      id: String(Date.now() + Math.random()),
      rating,
      content,
      createdAt: Date.now(),
      up: 0,
      down: 0,
    });
    if (!reviewsStore[volumeId]) reviewsStore[volumeId] = [];
    reviewsStore[volumeId].unshift(review);
    return NextResponse.json(review);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid review' }, { status: 400 });
  }
}

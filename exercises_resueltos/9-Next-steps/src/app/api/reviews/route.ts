import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/types';

// Simulación de base de datos en memoria
let reviews: Review[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');
  
  if (bookId) {
    const bookReviews = reviews.filter(review => review.bookId === bookId);
    return NextResponse.json(bookReviews);
  }
  
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json();
    
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0
    };
    
    reviews.push(newReview);
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { reviewId, vote } = await request.json();
    
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    if (vote === 'upvote') {
      reviews[reviewIndex].upvotes += 1;
    } else if (vote === 'downvote') {
      reviews[reviewIndex].downvotes += 1;
    }
    
    return NextResponse.json(reviews[reviewIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating review' },
      { status: 500 }
    );
  }
}
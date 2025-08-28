import { NextRequest, NextResponse } from 'next/server';
import { Review, PaginatedResponse } from '@/types';

// Simulación de base de datos en memoria (en producción usarías una base de datos real)
let reviews: Review[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let filteredReviews = reviews;
    
    if (bookId) {
      filteredReviews = reviews.filter(review => review.bookId === bookId);
    }
    
    // Ordenar por utilidad (upvotes - downvotes) y luego por fecha (más recientes primero)
    filteredReviews.sort((a, b) => {
      const aScore = a.upvotes - a.downvotes;
      const bScore = b.upvotes - b.downvotes;
      
      if (bScore !== aScore) {
        return bScore - aScore;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    const response: PaginatedResponse<Review> = {
      data: paginatedReviews,
      total: filteredReviews.length,
      page,
      limit,
      totalPages: Math.ceil(filteredReviews.length / limit)
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json();
    
    // Validación básica
    if (!reviewData.bookId || !reviewData.author || !reviewData.title || !reviewData.content) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }
    
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
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { reviewId, vote } = await request.json();
    
    if (!reviewId || !vote || (vote !== 'upvote' && vote !== 'downvote')) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }
    
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
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
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la reseña' },
      { status: 500 }
    );
  }
}

// Método DELETE opcional para desarrollo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    
    if (bookId) {
      reviews = reviews.filter(review => review.bookId !== bookId);
    } else {
      reviews = [];
    }
    
    return NextResponse.json({ message: 'Reseñas eliminadas correctamente' });
  } catch (error) {
    console.error('Error deleting reviews:', error);
    return NextResponse.json(
      { error: 'Error al eliminar las reseñas' },
      { status: 500 }
    );
  }
}
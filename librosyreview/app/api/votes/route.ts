import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { VoteService } from '@/app/lib/models/Vote';
import { verifyToken } from '@/app/lib/middleware/auth';
import { z } from 'zod';

// Esquema de validación para el toggle de voto
const voteSchema = z.object({
  reviewId: z.string().min(1, 'ID de reseña requerido'),
  voteType: z.enum(['like', 'dislike'], {
    errorMap: () => ({ message: 'Tipo de voto debe ser like o dislike' })
  })
});

/**
 * POST /api/votes
 * Maneja el toggle de votos (like/dislike) en reseñas
 * Requiere autenticación JWT
 */
export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar autenticación
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido' },
        { status: 401 }
      );
    }

    const userId = authResult.userId;

    // Parsear y validar el cuerpo de la petición
    const body = await request.json();
    const validationResult = voteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { reviewId, voteType } = validationResult.data;

    // Ejecutar toggle de voto usando el servicio
    const result = await VoteService.toggleVote(userId, reviewId, voteType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      vote: result.vote,
      reviewStats: result.reviewStats
    });

  } catch (error) {
    console.error('Error en POST /api/votes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/votes?reviewId=xxx
 * Obtiene el estado de voto del usuario para una reseña específica
 * Requiere autenticación JWT
 */
export async function GET(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar autenticación
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido' },
        { status: 401 }
      );
    }

    const userId = authResult.userId;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID de reseña requerido' },
        { status: 400 }
      );
    }

    // Buscar voto existente del usuario para esta reseña
    const existingVote = await VoteService.getUserVoteForReview(userId, reviewId);

    return NextResponse.json({
      hasVoted: !!existingVote,
      voteType: existingVote?.voteType || null
    });

  } catch (error) {
    console.error('Error en GET /api/votes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
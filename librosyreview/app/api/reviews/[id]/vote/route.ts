import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import { withAuth } from '../../../../lib/middleware/auth-helpers';
import { VoteService, VoteValidationSchema } from '../../../../lib/models/Vote';
import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * POST /api/reviews/[id]/vote
 * Crear, actualizar o eliminar voto en una reseña
 * 
 * @param request - Datos del voto { voteType: 'like' | 'dislike' }
 * @param params - Parámetros de la URL { id: string }
 * @returns Resultado de la operación de voto
 */
export const POST = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    const { id: reviewId } = params;
    
    // Validar que el ID de reseña sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID de reseña inválido'
        },
        { status: 400 }
      );
    }
    
    // Obtener y validar datos del cuerpo de la petición
    const body = await request.json();
    
    // Validar estructura de datos con Zod
    const voteTypeSchema = z.object({
      voteType: z.enum(['like', 'dislike'], {
        errorMap: () => ({ message: 'Tipo de voto debe ser "like" o "dislike"' })
      })
    });
    
    const { voteType } = voteTypeSchema.parse(body);
    
    // Verificar que la reseña existe y está activa
    const Review = (await import('../../../../lib/models/Review')).default;
    
    const existingReview = await Review.findOne({ _id: reviewId, isActive: true });
    
    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reseña no encontrada'
        },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario no esté votando su propia reseña
    if (existingReview.userId.toString() === user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'No puedes votar tu propia reseña'
        },
        { status: 403 }
      );
    }
    
    // Procesar voto usando el servicio
    const voteResult = await VoteService.toggleVote(user.id, reviewId, voteType);
    
    if (!voteResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: voteResult.message
        },
        { status: 400 }
      );
    }
    
    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: voteResult.message,
        data: {
          vote: voteResult.vote,
          reviewStats: voteResult.reviewStats
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al procesar voto:', error);
    
    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: `Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al procesar voto'
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/reviews/[id]/vote
 * Obtener voto del usuario actual para una reseña específica
 * 
 * @param request - Petición HTTP
 * @param params - Parámetros de la URL { id: string }
 * @returns Voto del usuario o null si no ha votado
 */
export const GET = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    const { id: reviewId } = params;
    
    // Validar que el ID de reseña sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID de reseña inválido'
        },
        { status: 400 }
      );
    }
    
    // Obtener voto del usuario para esta reseña
    const userVote = await VoteService.getUserVoteForReview(user.id, reviewId);
    
    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Voto obtenido exitosamente',
        data: {
          vote: userVote
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al obtener voto:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al obtener voto'
      },
      { status: 500 }
    );
  }
});
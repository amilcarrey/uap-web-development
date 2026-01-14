import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { ReviewUpdateSchema } from '../../../lib/models/Review';
import { withAuth, withOptionalAuth } from '../../../lib/middleware/auth-helpers';
import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * GET /api/reviews/[id]
 * Obtener reseña específica por ID - Acceso público
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de la URL { id: string }
 * @returns Reseña con información completa del usuario
 */
export const GET = withOptionalAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    const { id } = params;
    
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID de reseña inválido'
        },
        { status: 400 }
      );
    }
    
    // Buscar reseña por ID
    const Review = (await import('../../../lib/models/Review')).default;
    
    const review = await Review.findOne({ _id: id, isActive: true })
      .populate('userId', 'nombre email')
      .lean();
    
    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reseña no encontrada'
        },
        { status: 404 }
      );
    }
    
    // Respuesta exitosa con reseña
    return NextResponse.json(
      {
        success: true,
        message: 'Reseña obtenida exitosamente',
        data: {
          review
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al obtener reseña:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al obtener reseña'
      },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/reviews/[id]
 * Actualizar reseña - Solo el autor puede actualizar
 * 
 * @param request - Datos actualizados de la reseña
 * @param params - Parámetros de la URL { id: string }
 * @returns Reseña actualizada
 */
export const PUT = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    const { id } = params;
    
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
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
    
    // Validar estructura de datos con Zod (campos opcionales)
    const validatedData = ReviewUpdateSchema.parse(body);
    
    // Verificar que hay datos para actualizar
    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No se proporcionaron datos para actualizar'
        },
        { status: 400 }
      );
    }
    
    // Buscar reseña y verificar ownership
    const Review = (await import('../../../lib/models/Review')).default;
    
    const existingReview = await Review.findOne({ _id: id, isActive: true });
    
    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reseña no encontrada'
        },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario es el autor de la reseña
    if (existingReview.userId.toString() !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'No tienes permisos para actualizar esta reseña'
        },
        { status: 403 }
      );
    }
    
    // Actualizar reseña
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('userId', 'nombre email');
    
    // Respuesta exitosa con reseña actualizada
    return NextResponse.json(
      {
        success: true,
        message: 'Reseña actualizada exitosamente',
        data: {
          review: updatedReview
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al actualizar reseña:', error);
    
    // Manejo específico de errores de validación Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al actualizar reseña'
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/reviews/[id]
 * Eliminar reseña (soft delete) - Solo el autor puede eliminar
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de la URL { id: string }
 * @returns Confirmación de eliminación
 */
export const DELETE = withAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    const { id } = params;
    
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID de reseña inválido'
        },
        { status: 400 }
      );
    }
    
    // Buscar reseña y verificar ownership
    const Review = (await import('../../../lib/models/Review')).default;
    
    const existingReview = await Review.findOne({ _id: id, isActive: true });
    
    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reseña no encontrada'
        },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario es el autor de la reseña
    if (existingReview.userId.toString() !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'No tienes permisos para eliminar esta reseña'
        },
        { status: 403 }
      );
    }
    
    // Soft delete: marcar como inactiva
    await Review.findByIdAndUpdate(id, { 
      isActive: false,
      updatedAt: new Date()
    });
    
    // También eliminar todos los votos asociados (opcional)
    const Vote = (await import('../../../lib/models/Vote')).default;
    await Vote.deleteMany({ reviewId: id });
    
    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Reseña eliminada exitosamente',
        data: {
          deletedReviewId: id
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al eliminar reseña:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al eliminar reseña'
      },
      { status: 500 }
    );
  }
});
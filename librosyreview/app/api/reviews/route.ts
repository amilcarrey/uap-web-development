import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db';
import { ReviewService, ReviewValidationSchema } from '../../lib/models/Review';
import { withAuth, withOptionalAuth } from '../../lib/middleware/auth-helpers';
import { z } from 'zod';

/**
 * POST /api/reviews
 * Crear nueva reseña - Requiere autenticación
 * 
 * @param request - Datos de la reseña (bookId, title, content, rating, bookTitle, bookAuthor, bookImage?)
 * @returns Reseña creada con información del usuario
 */
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Obtener y validar datos del cuerpo de la petición
    const body = await request.json();
    
    // Agregar userId del usuario autenticado
    const reviewData = {
      ...body,
      userId: user.id
    };
    
    // Validar estructura de datos con Zod
    const validatedData = ReviewValidationSchema.parse(reviewData);
    
    // Crear nueva reseña usando el servicio
    const newReview = await ReviewService.createReview(validatedData);
    
    // Poblar información del usuario para la respuesta
    await newReview.populate('userId', 'nombre email');
    
    // Respuesta exitosa con reseña creada
    return NextResponse.json(
      {
        success: true,
        message: 'Reseña creada exitosamente',
        data: {
          review: newReview
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Error al crear reseña:', error);
    
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
    
    // Manejo de errores de duplicado (usuario ya reseñó este libro)
    if (error instanceof Error && error.message.includes('Ya has reseñado')) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 409 } // Conflict
      );
    }
    
    // Error genérico del servidor
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al crear reseña'
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/reviews
 * Listar reseñas con filtros y paginación - Acceso público
 * 
 * Query params:
 * - page: número de página (default: 1)
 * - limit: elementos por página (default: 10, max: 50)
 * - bookId: filtrar por libro específico
 * - userId: filtrar por usuario específico
 * - rating: filtrar por calificación mínima
 * - sortBy: ordenar por 'createdAt', 'rating', 'likesCount' (default: 'createdAt')
 * - sortOrder: 'asc' o 'desc' (default: 'desc')
 */
export const GET = withOptionalAuth(async (request: NextRequest, user) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Extraer parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const bookId = searchParams.get('bookId');
    const userId = searchParams.get('userId');
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    
    // Construir filtros de búsqueda
    const filters: any = { isActive: true };
    
    if (bookId) filters.bookId = bookId;
    if (userId) filters.userId = userId;
    if (rating) filters.rating = { $gte: parseInt(rating) };
    
    // Validar campo de ordenamiento
    const validSortFields = ['createdAt', 'rating', 'likesCount', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    // Calcular skip para paginación
    const skip = (page - 1) * limit;
    
    // Obtener reseñas con filtros y paginación
    const Review = (await import('../../lib/models/Review')).default;
    
    const [reviews, total] = await Promise.all([
      Review.find(filters)
        .populate('userId', 'nombre email')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filters)
    ]);
    
    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Respuesta exitosa con reseñas y metadatos
    return NextResponse.json(
      {
        success: true,
        message: 'Reseñas obtenidas exitosamente',
        data: {
          reviews,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage
          },
          filters: {
            bookId,
            userId,
            rating,
            sortBy: sortField,
            sortOrder: sortOrder === 1 ? 'asc' : 'desc'
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error al obtener reseñas:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al obtener reseñas'
      },
      { status: 500 }
    );
  }
});
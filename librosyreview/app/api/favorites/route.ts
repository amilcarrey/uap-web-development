import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { FavoriteService } from '@/app/lib/models/Favorite';
import { verifyToken } from '@/app/lib/middleware/auth';
import { z } from 'zod';

// Esquema de validación para agregar favorito
const addFavoriteSchema = z.object({
  bookId: z.string().min(1, 'ID de libro requerido'),
  bookTitle: z.string().min(1, 'Título del libro requerido'),
  bookAuthor: z.string().min(1, 'Autor del libro requerido'),
  bookCover: z.string().url('URL de portada inválida').optional(),
  bookDescription: z.string().optional()
});

/**
 * POST /api/favorites
 * Agregar un libro a favoritos del usuario
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
    const validationResult = addFavoriteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const favoriteData = {
      userId,
      ...validationResult.data
    };

    // Agregar a favoritos usando el servicio
    const result = await FavoriteService.addFavorite(favoriteData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
      favorite: result.favorite
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/favorites
 * Obtener todos los favoritos del usuario
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

    // Obtener favoritos del usuario
    const result = await FavoriteService.getUserFavorites(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      favorites: result.favorites,
      count: result.favorites?.length || 0
    });

  } catch (error) {
    console.error('Error en GET /api/favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites?bookId=xxx
 * Eliminar un libro de favoritos
 * Requiere autenticación JWT
 */
export async function DELETE(request: NextRequest) {
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
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json(
        { error: 'ID de libro requerido' },
        { status: 400 }
      );
    }

    // Eliminar de favoritos usando el servicio
    const result = await FavoriteService.removeFavorite(userId, bookId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message
    });

  } catch (error) {
    console.error('Error en DELETE /api/favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
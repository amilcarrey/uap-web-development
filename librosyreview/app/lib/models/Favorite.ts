import mongoose, { Document, Schema, Types } from 'mongoose';
import { z } from 'zod';

// Esquema de validación con Zod para favoritos
export const FavoriteValidationSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  bookId: z.string().min(1, 'ID de libro requerido'),
  bookTitle: z.string().min(1, 'Título del libro requerido').trim(),
  bookAuthor: z.string().min(1, 'Autor del libro requerido').trim(),
  bookImage: z.string().url('URL de imagen inválida').optional(),
  status: z.enum(['want_to_read', 'currently_reading', 'read'], {
    errorMap: () => ({ message: 'Estado debe ser "want_to_read", "currently_reading" o "read"' })
  }).default('want_to_read'),
  notes: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional()
});

// Interface para el documento de MongoDB
export interface IFavorite extends Document {
  userId: Types.ObjectId;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage?: string;
  status: ReadingStatus;
  notes?: string;
  addedAt: Date;
  updatedAt: Date;
}

// Esquema de Mongoose con múltiples índices
const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID de usuario requerido'],
    index: true
  },
  bookId: {
    type: String,
    required: [true, 'ID de libro requerido'],
    index: true
  },
  status: {
    type: String,
    enum: ['want_to_read', 'currently_reading', 'read'],
    default: 'want_to_read',
    index: true
  }
  bookTitle: {
    type: String,
    required: [true, 'Título del libro requerido'],
    trim: true
  },
  bookAuthor: {
    type: String,
    required: [true, 'Autor del libro requerido'],
    trim: true
  },
  bookImage: {
    type: String,
    validate: {
      validator: function(url: string) {
        if (!url) return true;
        return /^https?:\/\/.+/.test(url);
      },
      message: 'URL de imagen inválida'
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
    trim: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: false, updatedAt: true },
  versionKey: false
});

// Índices compuestos para optimización
favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, status: 1, addedAt: -1 });
favoriteSchema.index({ userId: 1, addedAt: -1 });

// Crear y exportar el modelo
const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;

// Servicio para manejo de favoritos
export class FavoriteService {
  /**
   * Agregar libro a favoritos o actualizar si ya existe
   */
  static async addToFavorites(favoriteData: FavoriteInput): Promise<IFavorite> {
    try {
      // Validar datos
      const validatedData = FavoriteValidationSchema.parse(favoriteData);
      
      // Buscar si ya existe
      const existingFavorite = await Favorite.findOne({
        userId: validatedData.userId,
        bookId: validatedData.bookId
      });
      
      if (existingFavorite) {
        // Actualizar existente
        Object.assign(existingFavorite, validatedData);
        await existingFavorite.save();
        return existingFavorite;
      } else {
        // Crear nuevo
        const favorite = new Favorite(validatedData);
        await favorite.save();
        return favorite;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }
  
  /**
   * Obtener favoritos de usuario con filtros
   */
  static async getUserFavorites(
    userId: string, 
    status?: ReadingStatus, 
    page: number = 1, 
    limit: number = 20
  ) {
    try {
      const skip = (page - 1) * limit;
      const filter: any = { userId };
      
      if (status) {
        filter.status = status;
      }
      
      const favorites = await Favorite.find(filter)
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Favorite.countDocuments(filter);
      
      return {
        favorites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Error al obtener favoritos');
    }
  }
  
  /**
   * Eliminar de favoritos
   */
  static async removeFromFavorites(userId: string, bookId: string): Promise<boolean> {
    try {
      const result = await Favorite.findOneAndDelete({ userId, bookId });
      return !!result;
    } catch (error) {
      throw new Error('Error al eliminar de favoritos');
    }
  }
  
  /**
   * Verificar si un libro está en favoritos
   */
  static async isBookInFavorites(userId: string, bookId: string): Promise<IFavorite | null> {
    try {
      return await Favorite.findOne({ userId, bookId });
    } catch (error) {
      throw new Error('Error al verificar favoritos');
    }
  }
}
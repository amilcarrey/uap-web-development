import mongoose, { Document, Schema, Types } from 'mongoose';
import { z } from 'zod';

// Esquema de validación con Zod para reseñas
export const ReviewValidationSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  bookId: z.string().min(1, 'ID de libro requerido'),
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),
  content: z.string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(2000, 'La reseña no puede exceder 2000 caracteres')
    .trim(),
  rating: z.number()
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5')
    .int('La calificación debe ser un número entero'),
  bookTitle: z.string().min(1, 'Título del libro requerido').trim(),
  bookAuthor: z.string().min(1, 'Autor del libro requerido').trim(),
  bookImage: z.string().url('URL de imagen inválida').optional()
});

// Esquema para actualización (campos opcionales)
export const ReviewUpdateSchema = ReviewValidationSchema.partial().omit({ userId: true, bookId: true });

// Tipos TypeScript
export type ReviewInput = z.infer<typeof ReviewValidationSchema>;
export type ReviewUpdate = z.infer<typeof ReviewUpdateSchema>;

// Interface para el documento de MongoDB
export interface IReview extends Document {
  userId: Types.ObjectId;
  bookId: string;
  title: string;
  content: string;
  rating: number;
  bookTitle: string;
  bookAuthor: string;
  bookImage?: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Esquema de Mongoose
const reviewSchema = new Schema<IReview>({
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
  title: {
    type: String,
    required: [true, 'Título de reseña requerido'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  content: {
    type: String,
    required: [true, 'Contenido de reseña requerido'],
    trim: true,
    minlength: [10, 'La reseña debe tener al menos 10 caracteres'],
    maxlength: [2000, 'La reseña no puede exceder 2000 caracteres']
  },
  rating: {
    type: Number,
    required: [true, 'Calificación requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
    validate: {
      validator: Number.isInteger,
      message: 'La calificación debe ser un número entero'
    }
  },
  bookTitle: {
    type: String,
    required: [true, 'Título del libro requerido'],
    trim: true,
    index: true
  },
  bookAuthor: {
    type: String,
    required: [true, 'Autor del libro requerido'],
    trim: true,
    index: true
  },
  bookImage: {
    type: String,
    validate: {
      validator: function(url: string) {
        if (!url) return true; // Campo opcional
        return /^https?:\/\/.+/.test(url);
      },
      message: 'URL de imagen inválida'
    }
  },
  likesCount: {
    type: Number,
    default: 0,
    min: [0, 'Los likes no pueden ser negativos']
  },
  dislikesCount: {
    type: Number,
    default: 0,
    min: [0, 'Los dislikes no pueden ser negativos']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices compuestos para optimización
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true }); // Un usuario solo puede reseñar un libro una vez
reviewSchema.index({ bookId: 1, createdAt: -1 }); // Reseñas por libro ordenadas por fecha
reviewSchema.index({ rating: -1, createdAt: -1 }); // Reseñas por calificación
reviewSchema.index({ likesCount: -1 }); // Reseñas más populares
reviewSchema.index({ isActive: 1, createdAt: -1 }); // Reseñas activas

// Método para calcular promedio de calificaciones por libro
reviewSchema.statics.getBookAverageRating = async function(bookId: string) {
  try {
    const result = await this.aggregate([
      { $match: { bookId, isActive: true } },
      {
        $group: {
          _id: '$bookId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    return result.length > 0 ? {
      averageRating: Math.round(result[0].averageRating * 10) / 10, // Redondear a 1 decimal
      totalReviews: result[0].totalReviews
    } : { averageRating: 0, totalReviews: 0 };
  } catch (error) {
    throw new Error('Error al calcular promedio de calificaciones');
  }
};

// Crear y exportar el modelo
const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;

// Servicio para manejo de reseñas
export class ReviewService {
  /**
   * Crear nueva reseña con validación
   */
  static async createReview(reviewData: ReviewInput): Promise<IReview> {
    try {
      // Validar datos con Zod
      const validatedData = ReviewValidationSchema.parse(reviewData);
      
      // Verificar si el usuario ya reseñó este libro
      const existingReview = await Review.findOne({
        userId: validatedData.userId,
        bookId: validatedData.bookId,
        isActive: true
      });
      
      if (existingReview) {
        throw new Error('Ya has reseñado este libro');
      }
      
      // Crear nueva reseña
      const review = new Review(validatedData);
      await review.save();
      
      return review;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }
  
  /**
   * Obtener reseñas por libro con paginación
   */
  static async getReviewsByBook(bookId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const reviews = await Review.find({ bookId, isActive: true })
        .populate('userId', 'nombre email')
        .sort({ likesCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Review.countDocuments({ bookId, isActive: true });
      
      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Error al obtener reseñas');
    }
  }
}
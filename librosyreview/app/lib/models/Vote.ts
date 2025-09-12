import mongoose, { Document, Schema, Types } from 'mongoose';
import { z } from 'zod';

// Tipos para votaciones
export type VoteType = 'like' | 'dislike';

export interface VoteInput {
  userId: string;
  reviewId: string;
  voteType: VoteType;
}

// Esquema de validación con Zod para votaciones
export const VoteValidationSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  reviewId: z.string().min(1, 'ID de reseña requerido'),
  voteType: z.enum(['like', 'dislike'], {
    errorMap: () => ({ message: 'Tipo de voto debe ser "like" o "dislike"' })
  })
});

// Interface para el documento de MongoDB
export interface IVote extends Document {
  userId: Types.ObjectId;
  reviewId: Types.ObjectId;
  voteType: VoteType;
  createdAt: Date;
}

// Esquema de Mongoose con índices optimizados
const voteSchema = new Schema<IVote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID de usuario requerido'],
    index: true
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: [true, 'ID de reseña requerido'],
    index: true
  },
  voteType: {
    type: String,
    enum: ['like', 'dislike'],
    required: [true, 'Tipo de voto requerido']
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false
});

// Índice compuesto único: un usuario solo puede votar una vez por reseña
voteSchema.index({ userId: 1, reviewId: 1 }, { unique: true });
voteSchema.index({ reviewId: 1, voteType: 1 }); // Para contar votos por tipo

// Middleware post-save para actualizar contadores en Review
voteSchema.post('save', async function() {
  try {
    await updateReviewVoteCounts(this.reviewId);
  } catch (error) {
    console.error('Error actualizando contadores de votos:', error);
  }
});

// Middleware post-remove para actualizar contadores en Review
voteSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      await updateReviewVoteCounts(doc.reviewId);
    } catch (error) {
      console.error('Error actualizando contadores de votos:', error);
    }
  }
});

// Función auxiliar para actualizar contadores
async function updateReviewVoteCounts(reviewId: Types.ObjectId) {
  const Review = mongoose.model('Review');
  
  const likesCount = await Vote.countDocuments({ reviewId, voteType: 'like' });
  const dislikesCount = await Vote.countDocuments({ reviewId, voteType: 'dislike' });
  
  await Review.findByIdAndUpdate(reviewId, {
    likesCount,
    dislikesCount
  });
}

// Crear y exportar el modelo
const Vote = mongoose.models.Vote || mongoose.model<IVote>('Vote', voteSchema);

export default Vote;

// Servicio para manejo de votaciones
export class VoteService {
  /**
   * Crear o actualizar voto
   */
  static async toggleVote(userId: string, reviewId: string, voteType: VoteType): Promise<{
    success: boolean;
    message: string;
    vote?: IVote;
    reviewStats?: { likesCount: number; dislikesCount: number };
  }> {
    try {
      // Validar datos
      const voteData = { userId, reviewId, voteType };
      const validatedData = VoteValidationSchema.parse(voteData);
      
      // Buscar voto existente
      const existingVote = await Vote.findOne({
        userId: validatedData.userId,
        reviewId: validatedData.reviewId
      });
      
      let result;
      if (existingVote) {
        if (existingVote.voteType === validatedData.voteType) {
          // Mismo tipo de voto: eliminar
          await Vote.findByIdAndDelete(existingVote._id);
          result = { action: 'removed', message: 'Voto eliminado' };
        } else {
          // Diferente tipo: actualizar
          existingVote.voteType = validatedData.voteType;
          await existingVote.save();
          result = { action: 'updated', vote: existingVote, message: 'Voto actualizado' };
        }
      } else {
        // Nuevo voto: crear
        const newVote = new Vote(validatedData);
        await newVote.save();
        result = { action: 'created', vote: newVote, message: 'Voto creado' };
      }
      
      // Obtener estadísticas actualizadas de la reseña
      const likesCount = await Vote.countDocuments({ reviewId, voteType: 'like' });
      const dislikesCount = await Vote.countDocuments({ reviewId, voteType: 'dislike' });
      
      return {
        success: true,
        message: result.message,
        vote: result.vote,
        reviewStats: { likesCount, dislikesCount }
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: `Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`
        };
      }
      return {
        success: false,
        message: 'Error interno al procesar voto'
      };
    }
  }
  
  /**
   * Obtener voto de usuario para una reseña específica
   */
  static async getUserVoteForReview(userId: string, reviewId: string): Promise<IVote | null> {
    try {
      return await Vote.findOne({ userId, reviewId });
    } catch (error) {
      throw new Error('Error al obtener voto del usuario');
    }
  }
}
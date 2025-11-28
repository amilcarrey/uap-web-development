import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { VoteService, VoteValidationSchema } from '../app/lib/models/Vote';
import Vote from '../app/lib/models/Vote';
import Review from '../app/lib/models/Review';

// Mock de mongoose
vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: {
        isValid: vi.fn()
      }
    },
    models: {},
    model: vi.fn()
  }
}));

// Mock del modelo Vote
vi.mock('../app/lib/models/Vote', async () => {
  const actual = await vi.importActual('../app/lib/models/Vote');
  return {
    ...actual,
    default: {
      findOne: vi.fn(),
      findByIdAndDelete: vi.fn(),
      countDocuments: vi.fn(),
      create: vi.fn(),
      prototype: {
        save: vi.fn()
      }
    }
  };
});

// Mock del modelo Review
vi.mock('../app/lib/models/Review', () => ({
  default: {
    findByIdAndUpdate: vi.fn()
  }
}));

const mockVote = vi.mocked(Vote);
const mockReview = vi.mocked(Review);

describe('VoteService', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockReviewId = '507f1f77bcf86cd799439012';
  const mockVoteId = '507f1f77bcf86cd799439013';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toggleVote', () => {
    it('debería crear un nuevo voto cuando no existe voto previo', async () => {
      // Arrange
      const voteType = 'like';
      const mockNewVote = {
        _id: mockVoteId,
        userId: mockUserId,
        reviewId: mockReviewId,
        voteType,
        save: vi.fn().mockResolvedValue(true)
      };

      mockVote.findOne.mockResolvedValue(null);
      mockVote.countDocuments
        .mockResolvedValueOnce(1) // likesCount
        .mockResolvedValueOnce(0); // dislikesCount
      
      // Mock constructor
      const MockVoteConstructor = vi.fn().mockImplementation(() => mockNewVote);
      vi.mocked(Vote).mockImplementation(MockVoteConstructor as any);

      // Act
      const result = await VoteService.toggleVote(mockUserId, mockReviewId, voteType);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Voto creado');
      expect(result.vote).toBe(mockNewVote);
      expect(result.reviewStats).toEqual({ likesCount: 1, dislikesCount: 0 });
      expect(mockVote.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        reviewId: mockReviewId
      });
      expect(mockNewVote.save).toHaveBeenCalled();
    });

    it('debería eliminar voto cuando ya existe el mismo tipo de voto', async () => {
      // Arrange
      const voteType = 'like';
      const existingVote = {
        _id: mockVoteId,
        userId: mockUserId,
        reviewId: mockReviewId,
        voteType: 'like'
      };

      mockVote.findOne.mockResolvedValue(existingVote);
      mockVote.findByIdAndDelete.mockResolvedValue(existingVote);
      mockVote.countDocuments
        .mockResolvedValueOnce(0) // likesCount después de eliminar
        .mockResolvedValueOnce(0); // dislikesCount

      // Act
      const result = await VoteService.toggleVote(mockUserId, mockReviewId, voteType);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Voto eliminado');
      expect(result.reviewStats).toEqual({ likesCount: 0, dislikesCount: 0 });
      expect(mockVote.findByIdAndDelete).toHaveBeenCalledWith(existingVote._id);
    });

    it('debería actualizar voto cuando existe diferente tipo de voto', async () => {
      // Arrange
      const voteType = 'like';
      const existingVote = {
        _id: mockVoteId,
        userId: mockUserId,
        reviewId: mockReviewId,
        voteType: 'dislike',
        save: vi.fn().mockResolvedValue(true)
      };

      mockVote.findOne.mockResolvedValue(existingVote);
      mockVote.countDocuments
        .mockResolvedValueOnce(1) // likesCount después de actualizar
        .mockResolvedValueOnce(0); // dislikesCount después de actualizar

      // Act
      const result = await VoteService.toggleVote(mockUserId, mockReviewId, voteType);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Voto actualizado');
      expect(result.vote).toBe(existingVote);
      expect(existingVote.voteType).toBe('like');
      expect(existingVote.save).toHaveBeenCalled();
      expect(result.reviewStats).toEqual({ likesCount: 1, dislikesCount: 0 });
    });

    it('debería manejar errores de validación de Zod', async () => {
      // Act
      const result = await VoteService.toggleVote('', mockReviewId, 'like');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Datos inválidos');
    });

    it('debería manejar errores internos', async () => {
      // Arrange
      mockVote.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await VoteService.toggleVote(mockUserId, mockReviewId, 'like');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error interno al procesar voto');
    });

    describe('Casos extremos', () => {
      it('debería validar tipos de voto inválidos', async () => {
        // Act
        const result = await VoteService.toggleVote(mockUserId, mockReviewId, 'invalid' as any);

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toContain('Datos inválidos');
      });

      it('debería manejar IDs de usuario vacíos', async () => {
        // Act
        const result = await VoteService.toggleVote('', mockReviewId, 'like');

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toContain('ID de usuario requerido');
      });

      it('debería manejar IDs de reseña vacíos', async () => {
        // Act
        const result = await VoteService.toggleVote(mockUserId, '', 'like');

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toContain('ID de reseña requerido');
      });
    });
  });

  describe('getUserVoteForReview', () => {
    it('debería retornar el voto del usuario para una reseña específica', async () => {
      // Arrange
      const expectedVote = {
        _id: mockVoteId,
        userId: mockUserId,
        reviewId: mockReviewId,
        voteType: 'like'
      };

      mockVote.findOne.mockResolvedValue(expectedVote);

      // Act
      const result = await VoteService.getUserVoteForReview(mockUserId, mockReviewId);

      // Assert
      expect(result).toBe(expectedVote);
      expect(mockVote.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        reviewId: mockReviewId
      });
    });

    it('debería retornar null cuando no existe voto', async () => {
      // Arrange
      mockVote.findOne.mockResolvedValue(null);

      // Act
      const result = await VoteService.getUserVoteForReview(mockUserId, mockReviewId);

      // Assert
      expect(result).toBeNull();
    });

    it('debería manejar errores de base de datos', async () => {
      // Arrange
      mockVote.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(VoteService.getUserVoteForReview(mockUserId, mockReviewId))
        .rejects.toThrow('Error al obtener voto del usuario');
    });
  });
});

describe('VoteValidationSchema', () => {
  it('debería validar datos correctos', () => {
    const validData = {
      userId: '507f1f77bcf86cd799439011',
      reviewId: '507f1f77bcf86cd799439012',
      voteType: 'like' as const
    };

    const result = VoteValidationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debería rechazar userId vacío', () => {
    const invalidData = {
      userId: '',
      reviewId: '507f1f77bcf86cd799439012',
      voteType: 'like' as const
    };

    const result = VoteValidationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debería rechazar reviewId vacío', () => {
    const invalidData = {
      userId: '507f1f77bcf86cd799439011',
      reviewId: '',
      voteType: 'like' as const
    };

    const result = VoteValidationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debería rechazar voteType inválido', () => {
    const invalidData = {
      userId: '507f1f77bcf86cd799439011',
      reviewId: '507f1f77bcf86cd799439012',
      voteType: 'invalid'
    };

    const result = VoteValidationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debería rechazar campos faltantes', () => {
    const invalidData = {
      userId: '507f1f77bcf86cd799439011'
      // reviewId y voteType faltantes
    };

    const result = VoteValidationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
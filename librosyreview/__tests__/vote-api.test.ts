import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '../app/api/reviews/[id]/vote/route';
import { VoteService } from '../app/lib/models/Vote';
import Review from '../app/lib/models/Review';
import mongoose from 'mongoose';

// Mock de dependencias
vi.mock('../app/lib/db', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true)
}));

vi.mock('../app/lib/middleware/auth-helpers', () => ({
  withAuth: vi.fn((handler) => {
    return async (request: NextRequest, context: any) => {
      const mockUser = { id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      return handler(request, mockUser, context);
    };
  })
}));

vi.mock('../app/lib/models/Vote', () => ({
  VoteService: {
    toggleVote: vi.fn(),
    getUserVoteForReview: vi.fn()
  }
}));

vi.mock('../app/lib/models/Review', () => ({
  default: {
    findOne: vi.fn()
  }
}));

vi.mock('mongoose', () => ({
  default: {
    Types: {
      ObjectId: {
        isValid: vi.fn()
      }
    }
  }
}));

const mockVoteService = vi.mocked(VoteService);
const mockReview = vi.mocked(Review);
const mockMongoose = vi.mocked(mongoose);

describe('Vote API Endpoints', () => {
  const mockReviewId = '507f1f77bcf86cd799439012';
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    vi.clearAllMocks();
    mockMongoose.Types.ObjectId.isValid.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/reviews/[id]/vote', () => {
    it('debería crear un voto exitosamente', async () => {
      // Arrange
      const mockReviewData = {
        _id: mockReviewId,
        userId: '507f1f77bcf86cd799439013', // Diferente al usuario que vota
        isActive: true
      };

      const mockVoteResult = {
        success: true,
        message: 'Voto creado',
        vote: {
          _id: 'vote123',
          userId: mockUserId,
          reviewId: mockReviewId,
          voteType: 'like'
        },
        reviewStats: { likesCount: 1, dislikesCount: 0 }
      };

      mockReview.findOne.mockResolvedValue(mockReviewData);
      mockVoteService.toggleVote.mockResolvedValue(mockVoteResult);

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Voto creado');
      expect(responseData.data.vote).toBeDefined();
      expect(responseData.data.reviewStats).toEqual({ likesCount: 1, dislikesCount: 0 });
      expect(mockVoteService.toggleVote).toHaveBeenCalledWith(mockUserId, mockReviewId, 'like');
    });

    it('debería rechazar ID de reseña inválido', async () => {
      // Arrange
      mockMongoose.Types.ObjectId.isValid.mockReturnValue(false);

      const request = new NextRequest('http://localhost/api/reviews/invalid/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: 'invalid' } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('ID de reseña inválido');
    });

    it('debería rechazar reseña no encontrada', async () => {
      // Arrange
      mockReview.findOne.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Reseña no encontrada');
    });

    it('debería rechazar voto en propia reseña', async () => {
      // Arrange
      const mockReviewData = {
        _id: mockReviewId,
        userId: mockUserId, // Mismo usuario que intenta votar
        isActive: true
      };

      mockReview.findOne.mockResolvedValue(mockReviewData);

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('No puedes votar tu propia reseña');
    });

    it('debería rechazar tipo de voto inválido', async () => {
      // Arrange
      const mockReviewData = {
        _id: mockReviewId,
        userId: '507f1f77bcf86cd799439013',
        isActive: true
      };

      mockReview.findOne.mockResolvedValue(mockReviewData);

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'invalid' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Datos inválidos');
    });

    it('debería manejar errores del servicio de votos', async () => {
      // Arrange
      const mockReviewData = {
        _id: mockReviewId,
        userId: '507f1f77bcf86cd799439013',
        isActive: true
      };

      const mockVoteResult = {
        success: false,
        message: 'Error al procesar voto'
      };

      mockReview.findOne.mockResolvedValue(mockReviewData);
      mockVoteService.toggleVote.mockResolvedValue(mockVoteResult);

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Error al procesar voto');
    });

    it('debería manejar errores internos del servidor', async () => {
      // Arrange
      mockReview.findOne.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/reviews/123/vote', {
        method: 'POST',
        body: JSON.stringify({ voteType: 'like' })
      });

      // Act
      const response = await POST(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Error interno del servidor al procesar voto');
    });

    describe('Casos extremos', () => {
      it('debería manejar cuerpo de petición vacío', async () => {
        const request = new NextRequest('http://localhost/api/reviews/123/vote', {
          method: 'POST',
          body: JSON.stringify({})
        });

        const response = await POST(request, { params: { id: mockReviewId } });
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData.success).toBe(false);
      });

      it('debería manejar JSON malformado', async () => {
        const request = new NextRequest('http://localhost/api/reviews/123/vote', {
          method: 'POST',
          body: 'invalid json'
        });

        const response = await POST(request, { params: { id: mockReviewId } });
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData.success).toBe(false);
      });
    });
  });

  describe('GET /api/reviews/[id]/vote', () => {
    it('debería obtener voto del usuario exitosamente', async () => {
      // Arrange
      const mockVote = {
        _id: 'vote123',
        userId: mockUserId,
        reviewId: mockReviewId,
        voteType: 'like'
      };

      mockVoteService.getUserVoteForReview.mockResolvedValue(mockVote);

      const request = new NextRequest('http://localhost/api/reviews/123/vote');

      // Act
      const response = await GET(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Voto obtenido exitosamente');
      expect(responseData.data.vote).toStrictEqual(mockVote);
      expect(mockVoteService.getUserVoteForReview).toHaveBeenCalledWith(mockUserId, mockReviewId);
    });

    it('debería retornar null cuando no hay voto', async () => {
      // Arrange
      mockVoteService.getUserVoteForReview.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/reviews/123/vote');

      // Act
      const response = await GET(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.vote).toBeNull();
    });

    it('debería rechazar ID de reseña inválido', async () => {
      // Arrange
      mockMongoose.Types.ObjectId.isValid.mockReturnValue(false);

      const request = new NextRequest('http://localhost/api/reviews/invalid/vote');

      // Act
      const response = await GET(request, { params: { id: 'invalid' } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('ID de reseña inválido');
    });

    it('debería manejar errores del servicio', async () => {
      // Arrange
      mockVoteService.getUserVoteForReview.mockRejectedValue(new Error('Service error'));

      const request = new NextRequest('http://localhost/api/reviews/123/vote');

      // Act
      const response = await GET(request, { params: { id: mockReviewId } });
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Error interno del servidor al obtener voto');
    });
  });
});
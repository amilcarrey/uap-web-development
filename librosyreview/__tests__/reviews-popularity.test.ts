import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../app/api/reviews/route';
import Review from '../app/lib/models/Review';
import mongoose from 'mongoose';

// Mock de dependencias
vi.mock('../app/lib/db', () => ({
  connectToDatabase: vi.fn().mockResolvedValue(true)
}));

vi.mock('../app/lib/models/Review', () => ({
  default: {
    find: vi.fn(),
    aggregate: vi.fn(),
    countDocuments: vi.fn()
  }
}));

const mockReview = vi.mocked(Review);

describe('Reviews API - Sistema de Popularidad', () => {
  const mockReviewsData = [
    {
      _id: '1',
      userId: 'user1',
      userName: 'Usuario 1',
      bookId: 'book1',
      rating: 5,
      comment: 'Excelente libro',
      likesCount: 15,
      dislikesCount: 3,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      _id: '2',
      userId: 'user2',
      userName: 'Usuario 2',
      bookId: 'book1',
      rating: 4,
      comment: 'Muy bueno',
      likesCount: 8,
      dislikesCount: 2,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      isActive: true
    },
    {
      _id: '3',
      userId: 'user3',
      userName: 'Usuario 3',
      bookId: 'book1',
      rating: 2,
      comment: 'No me gustó',
      likesCount: 2,
      dislikesCount: 10,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      isActive: true
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Ordenamiento por Popularidad', () => {
    it('debería ordenar reseñas por popularidad descendente', async () => {
      // Arrange
      const expectedPopularityOrder = [
        { ...mockReviewsData[0], popularityScore: 12 }, // 15 - 3 = 12
        { ...mockReviewsData[1], popularityScore: 6 },  // 8 - 2 = 6
        { ...mockReviewsData[2], popularityScore: -8 }  // 2 - 10 = -8
      ];

      mockReview.aggregate.mockResolvedValue(expectedPopularityOrder);
      mockReview.countDocuments.mockResolvedValue(3);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity&sortOrder=desc');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.reviews).toHaveLength(3);
      
      // Verificar que están ordenados por popularidad descendente
      expect(responseData.data.reviews[0].popularityScore).toBe(12);
      expect(responseData.data.reviews[1].popularityScore).toBe(6);
      expect(responseData.data.reviews[2].popularityScore).toBe(-8);

      // Verificar que se llamó aggregate con la pipeline correcta
      expect(mockReview.aggregate).toHaveBeenCalledWith([
        { $match: { isActive: true } },
        {
          $addFields: {
            popularityScore: { $subtract: ['$likesCount', '$dislikesCount'] }
          }
        },
        { $sort: { popularityScore: -1 } },
        { $skip: 0 },
        { $limit: 10 }
      ]);
    });

    it('debería ordenar reseñas por popularidad ascendente', async () => {
      // Arrange
      const expectedPopularityOrder = [
        { ...mockReviewsData[2], popularityScore: -8 }, // 2 - 10 = -8
        { ...mockReviewsData[1], popularityScore: 6 },  // 8 - 2 = 6
        { ...mockReviewsData[0], popularityScore: 12 }  // 15 - 3 = 12
      ];

      mockReview.aggregate.mockResolvedValue(expectedPopularityOrder);
      mockReview.countDocuments.mockResolvedValue(3);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity&sortOrder=asc');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar que están ordenados por popularidad ascendente
      expect(responseData.data.reviews[0].popularityScore).toBe(-8);
      expect(responseData.data.reviews[1].popularityScore).toBe(6);
      expect(responseData.data.reviews[2].popularityScore).toBe(12);

      // Verificar que se llamó aggregate con orden ascendente
      expect(mockReview.aggregate).toHaveBeenCalledWith([
        { $match: { isActive: true } },
        {
          $addFields: {
            popularityScore: { $subtract: ['$likesCount', '$dislikesCount'] }
          }
        },
        { $sort: { popularityScore: 1 } },
        { $skip: 0 },
        { $limit: 10 }
      ]);
    });

    it('debería combinar filtros con ordenamiento por popularidad', async () => {
      // Arrange
      const filteredResults = [mockReviewsData[0]];
      mockReview.aggregate.mockResolvedValue(filteredResults);
      mockReview.countDocuments.mockResolvedValue(1);

      const url = new URL('http://localhost/api/reviews?bookId=book1&userId=user1&sortBy=popularity&sortOrder=desc');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar que se aplicaron los filtros correctos
      expect(mockReview.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            isActive: true,
            bookId: 'book1',
            userId: 'user1'
          } 
        },
        {
          $addFields: {
            popularityScore: { $subtract: ['$likesCount', '$dislikesCount'] }
          }
        },
        { $sort: { popularityScore: -1 } },
        { $skip: 0 },
        { $limit: 10 }
      ]);
    });

    it('debería manejar paginación con ordenamiento por popularidad', async () => {
      // Arrange
      const paginatedResults = [mockReviewsData[1]];
      mockReview.aggregate.mockResolvedValue(paginatedResults);
      mockReview.countDocuments.mockResolvedValue(3);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity&page=2&limit=1');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.pagination.currentPage).toBe(2);
      expect(responseData.data.pagination.totalPages).toBe(3);
      
      // Verificar que se aplicó skip correcto para página 2
      expect(mockReview.aggregate).toHaveBeenCalledWith([
        { $match: { isActive: true } },
        {
          $addFields: {
            popularityScore: { $subtract: ['$likesCount', '$dislikesCount'] }
          }
        },
        { $sort: { popularityScore: -1 } },
        { $skip: 1 }, // (page - 1) * limit = (2 - 1) * 1 = 1
        { $limit: 1 }
      ]);
    });

    it('debería manejar reseñas con popularidad cero', async () => {
      // Arrange
      const reviewsWithZeroPopularity = [
        {
          ...mockReviewsData[0],
          likesCount: 5,
          dislikesCount: 5,
          popularityScore: 0
        },
        {
          ...mockReviewsData[1],
          likesCount: 0,
          dislikesCount: 0,
          popularityScore: 0
        }
      ];

      mockReview.aggregate.mockResolvedValue(reviewsWithZeroPopularity);
      mockReview.countDocuments.mockResolvedValue(2);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.reviews).toHaveLength(2);
      
      // Verificar que ambas tienen popularidad 0
      responseData.data.reviews.forEach((review: any) => {
        expect(review.popularityScore).toBe(0);
      });
    });

    it('debería manejar reseñas con popularidad negativa', async () => {
      // Arrange
      const reviewsWithNegativePopularity = [
        {
          ...mockReviewsData[0],
          likesCount: 1,
          dislikesCount: 10,
          popularityScore: -9
        },
        {
          ...mockReviewsData[1],
          likesCount: 0,
          dislikesCount: 5,
          popularityScore: -5
        }
      ];

      mockReview.aggregate.mockResolvedValue(reviewsWithNegativePopularity);
      mockReview.countDocuments.mockResolvedValue(2);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity&sortOrder=desc');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar orden descendente (menos negativo primero)
      expect(responseData.data.reviews[0].popularityScore).toBe(-5);
      expect(responseData.data.reviews[1].popularityScore).toBe(-9);
    });
  });

  describe('Fallback a Ordenamiento Normal', () => {
    it('debería usar find() para otros tipos de ordenamiento', async () => {
      // Arrange
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockReviewsData)
      };

      mockReview.find.mockReturnValue(mockQuery as any);
      mockReview.countDocuments.mockResolvedValue(3);

      const url = new URL('http://localhost/api/reviews?sortBy=createdAt&sortOrder=desc');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar que se usó find() en lugar de aggregate()
      expect(mockReview.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockReview.aggregate).not.toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it('debería usar find() cuando no se especifica sortBy', async () => {
      // Arrange
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockReviewsData)
      };

      mockReview.find.mockReturnValue(mockQuery as any);
      mockReview.countDocuments.mockResolvedValue(3);

      const url = new URL('http://localhost/api/reviews');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Verificar que se usó find() con ordenamiento por defecto
      expect(mockReview.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockReview.aggregate).not.toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('Manejo de Errores', () => {
    it('debería manejar errores en aggregate para popularidad', async () => {
      // Arrange
      mockReview.aggregate.mockRejectedValue(new Error('Database error'));

      const url = new URL('http://localhost/api/reviews?sortBy=popularity');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Error interno del servidor');
    });

    it('debería manejar aggregate que retorna null', async () => {
      // Arrange
      mockReview.aggregate.mockResolvedValue(null);
      mockReview.countDocuments.mockResolvedValue(0);

      const url = new URL('http://localhost/api/reviews?sortBy=popularity');
      const request = new NextRequest(url);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.reviews).toEqual([]);
    });
  });

  describe('Validación de Parámetros', () => {
    it('debería rechazar sortBy inválido', async () => {
      const url = new URL('http://localhost/api/reviews?sortBy=invalid');
      const request = new NextRequest(url);

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('sortBy debe ser uno de');
    });

    it('debería rechazar sortOrder inválido', async () => {
      const url = new URL('http://localhost/api/reviews?sortBy=popularity&sortOrder=invalid');
      const request = new NextRequest(url);

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('sortOrder debe ser');
    });
  });
});
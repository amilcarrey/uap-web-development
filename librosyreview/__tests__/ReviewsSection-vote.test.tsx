import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewsSection } from '../app/components/ReviewsSection';
import { useSession } from 'next-auth/react';

// Mock de dependencias
vi.mock('next-auth/react', () => ({
  useSession: vi.fn()
}));

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockUseSession = vi.mocked(useSession);

describe('ReviewsSection - Sistema de Votación', () => {
  const mockReviews = [
    {
      _id: '1',
      userId: 'user1',
      userName: 'Usuario Test',
      bookId: 'book1',
      rating: 5,
      comment: 'Excelente libro',
      likesCount: 10,
      dislikesCount: 2,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      userId: 'user2',
      userName: 'Otro Usuario',
      bookId: 'book1',
      rating: 3,
      comment: 'Regular',
      likesCount: 5,
      dislikesCount: 8,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z'
    }
  ];

  const mockSession = {
    user: {
      id: 'currentUser',
      email: 'test@example.com',
      name: 'Usuario Actual'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated'
    });

    // Mock inicial para cargar reseñas
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews,
          totalPages: 1,
          currentPage: 1
        }
      })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Funcionalidad de Like', () => {
    it('debería enviar like correctamente y actualizar el estado', async () => {
      // Arrange
      const updatedReview = {
        ...mockReviews[0],
        likesCount: 11
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Voto registrado',
          data: {
            vote: { voteType: 'like' },
            reviewStats: { likesCount: 11, dislikesCount: 2 }
          }
        })
      });

      render(<ReviewsSection bookId="book1" />);

      // Esperar a que se carguen las reseñas
      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const likeButton = screen.getAllByText('👍')[0];
      fireEvent.click(likeButton);

      // Assert
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/reviews/1/vote',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteType: 'like' })
          })
        );
      });

      // Verificar que el contador se actualiza
      await waitFor(() => {
        expect(screen.getByText('11')).toBeInTheDocument();
      });
    });

    it('debería manejar errores al hacer like', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'No puedes votar tu propia reseña'
        })
      });

      // Mock de console.error para verificar que se registra el error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const likeButton = screen.getAllByText('👍')[0];
      fireEvent.click(likeButton);

      // Assert
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error al dar like:',
          'No puedes votar tu propia reseña'
        );
      });

      consoleSpy.mockRestore();
    });

    it('debería manejar errores de red al hacer like', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const likeButton = screen.getAllByText('👍')[0];
      fireEvent.click(likeButton);

      // Assert
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error al dar like:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Funcionalidad de Dislike', () => {
    it('debería enviar dislike correctamente y actualizar el estado', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Voto registrado',
          data: {
            vote: { voteType: 'dislike' },
            reviewStats: { likesCount: 10, dislikesCount: 3 }
          }
        })
      });

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const dislikeButton = screen.getAllByText('👎')[0];
      fireEvent.click(dislikeButton);

      // Assert
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/reviews/1/vote',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteType: 'dislike' })
          })
        );
      });

      // Verificar que el contador se actualiza
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('debería manejar errores al hacer dislike', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Error al procesar voto'
        })
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const dislikeButton = screen.getAllByText('👎')[0];
      fireEvent.click(dislikeButton);

      // Assert
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error al dar dislike:',
          'Error al procesar voto'
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Visualización de Estadísticas', () => {
    it('debería mostrar correctamente los contadores de likes y dislikes', async () => {
      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Verificar que se muestran los contadores correctos
      expect(screen.getByText('10')).toBeInTheDocument(); // likes de la primera reseña
      expect(screen.getByText('2')).toBeInTheDocument();  // dislikes de la primera reseña
      expect(screen.getByText('5')).toBeInTheDocument();  // likes de la segunda reseña
      expect(screen.getByText('8')).toBeInTheDocument();  // dislikes de la segunda reseña
    });

    it('debería mostrar el puntaje de popularidad correctamente', async () => {
      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Verificar puntajes de popularidad (likesCount - dislikesCount)
      // Primera reseña: 10 - 2 = 8
      // Segunda reseña: 5 - 8 = -3
      expect(screen.getByText('Popularidad: 8')).toBeInTheDocument();
      expect(screen.getByText('Popularidad: -3')).toBeInTheDocument();
    });

    it('debería manejar contadores en cero correctamente', async () => {
      // Arrange
      const reviewsWithZeros = [{
        ...mockReviews[0],
        likesCount: 0,
        dislikesCount: 0
      }];

      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            reviews: reviewsWithZeros,
            totalPages: 1,
            currentPage: 1
          }
        })
      });

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Verificar que se muestran ceros
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Popularidad: 0')).toBeInTheDocument();
    });
  });

  describe('Estados de Autenticación', () => {
    it('debería deshabilitar botones cuando no hay sesión', async () => {
      // Arrange
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act & Assert
      const likeButtons = screen.getAllByText('👍');
      const dislikeButtons = screen.getAllByText('👎');

      likeButtons.forEach(button => {
        expect(button.closest('button')).toBeDisabled();
      });

      dislikeButtons.forEach(button => {
        expect(button.closest('button')).toBeDisabled();
      });
    });

    it('debería habilitar botones cuando hay sesión válida', async () => {
      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act & Assert
      const likeButtons = screen.getAllByText('👍');
      const dislikeButtons = screen.getAllByText('👎');

      likeButtons.forEach(button => {
        expect(button.closest('button')).not.toBeDisabled();
      });

      dislikeButtons.forEach(button => {
        expect(button.closest('button')).not.toBeDisabled();
      });
    });
  });

  describe('Casos Extremos', () => {
    it('debería manejar respuesta vacía del servidor', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act
      const likeButton = screen.getAllByText('👍')[0];
      fireEvent.click(likeButton);

      // Assert
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('debería manejar múltiples clics rápidos', async () => {
      // Arrange
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Voto registrado',
          data: {
            vote: { voteType: 'like' },
            reviewStats: { likesCount: 11, dislikesCount: 2 }
          }
        })
      });

      render(<ReviewsSection bookId="book1" />);

      await waitFor(() => {
        expect(screen.getByText('Excelente libro')).toBeInTheDocument();
      });

      // Act - Múltiples clics rápidos
      const likeButton = screen.getAllByText('👍')[0];
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);

      // Assert - Solo debería hacer una llamada por cada clic
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(4); // 1 inicial + 3 clics
      });
    });
  });
});
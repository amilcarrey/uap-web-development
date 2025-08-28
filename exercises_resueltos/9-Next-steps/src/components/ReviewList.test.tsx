import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewList from './ReviewList';

// Extender expect con los matchers de jest-dom
import '@testing-library/jest-dom';

describe('ReviewList', () => {
  const mockOnVote = vi.fn();
  const mockReviews = [
    {
      id: '1',
      bookId: 'test-123',
      author: 'User 1',
      rating: 5,
      title: 'Great Book',
      content: 'Excellent read! '.repeat(10), // Long content
      createdAt: new Date('2024-01-01'),
      upvotes: 10,
      downvotes: 2
    },
    {
      id: '2',
      bookId: 'test-123',
      author: 'User 2',
      rating: 3,
      title: 'Average Book',
      content: 'It was okay',
      createdAt: new Date('2024-01-02'),
      upvotes: 5,
      downvotes: 5
    }
  ];

  beforeEach(() => {
    mockOnVote.mockClear();
  });

  it('should display no reviews message', () => {
    render(<ReviewList reviews={[]} onVote={mockOnVote} />);
    expect(screen.getByText(/aún no hay reseñas/i)).toBeInTheDocument();
  });

  it('should display reviews with expandable content', async () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />);
    
    expect(screen.getByText('Great Book')).toBeInTheDocument();
    expect(screen.getByText('Average Book')).toBeInTheDocument();
    
    // Should show "Ver más" for long content
    const viewMoreButton = screen.getByText('Ver más');
    expect(viewMoreButton).toBeInTheDocument();
    
    await userEvent.click(viewMoreButton);
    expect(screen.getByText('Ver menos')).toBeInTheDocument();
  });

  it('should handle voting', async () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />);
    
    const upvoteButtons = screen.getAllByTitle(/esta reseña es útil/i);
    await userEvent.click(upvoteButtons[0]);
    
    expect(mockOnVote).toHaveBeenCalledWith('1', 'upvote');
  });

  it('should show voting state during vote', async () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />);
    
    const upvoteButtons = screen.getAllByTitle(/esta reseña es útil/i);
    await userEvent.click(upvoteButtons[0]);
    
    // Verificar que se muestra el estado de carga
    expect(screen.getByText('Procesando voto...')).toBeInTheDocument();
  });

  it('should display helpful score information', () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />);
    
    // Debería mostrar información de utilidad para la primera reseña
    expect(screen.getByText(/8 personas encontraron esta reseña útil/i)).toBeInTheDocument();
  });
});
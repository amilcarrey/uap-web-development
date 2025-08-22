import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewList from '../components/ReviewList';
import * as localStorage from '../lib/localStorage';

vi.mock('../lib/localStorage', () => ({
  getReviews: vi.fn(),
  voteReview: vi.fn(),
}));

describe('ReviewList', () => {
  const bookId = 'book1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders no reviews message when empty', () => {
    vi.mocked(localStorage.getReviews).mockReturnValue([]);
    render(<ReviewList bookId={bookId} />);
    expect(screen.getByTestId('no-reviews')).toHaveTextContent('No hay reseñas aún.');
  });

  it('renders reviews sorted by votes', () => {
    const reviews = [
      { id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 2 },
      { id: 2, name: 'Ana', rating: 4, text: 'Good', votes: 5 },
    ];
    vi.mocked(localStorage.getReviews).mockReturnValue(reviews);
    render(<ReviewList bookId={bookId} />);
    const reviewElements = screen.getAllByTestId('review-name');
    expect(reviewElements[0]).toHaveTextContent('Por: Ana');
    expect(reviewElements[1]).toHaveTextContent('Por: Juan');
  });

  it('calls voteReview on thumbs up', async () => {
    const reviews = [{ id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 0 }];
    vi.mocked(localStorage.getReviews).mockReturnValue(reviews);
    render(<ReviewList bookId={bookId} />);
    await fireEvent.click(screen.getAllByTestId('thumbs-up')[0]);
    expect(localStorage.voteReview).toHaveBeenCalledWith(bookId, 1, 1);
  });

  it('calls voteReview on thumbs down', async () => {
    const reviews = [{ id: 1, name: 'Juan', rating: 5, text: 'Great!', votes: 0 }];
    vi.mocked(localStorage.getReviews).mockReturnValue(reviews);
    render(<ReviewList bookId={bookId} />);
    await fireEvent.click(screen.getAllByTestId('thumbs-down')[0]);
    expect(localStorage.voteReview).toHaveBeenCalledWith(bookId, 1, -1);
  });

  it('displays anonymous if name is missing', () => {
    const reviews = [{ id: 1, rating: 5, text: 'Great!', votes: 0 }];
    vi.mocked(localStorage.getReviews).mockReturnValue(reviews);
    render(<ReviewList bookId={bookId} />);
    expect(screen.getByTestId('review-name')).toHaveTextContent('Por: Anónimo');
  });
});
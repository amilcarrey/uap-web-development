import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from '../components/ReviewForm';
import * as localStorage from '../lib/localStorage';

vi.mock('../lib/localStorage', () => ({
  saveReview: vi.fn(),
}));

const reloadMock = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: reloadMock },
  writable: true,
});

describe('ReviewForm', () => {
  const bookId = 'book1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders name, rating, and text inputs', () => {
    render(<ReviewForm bookId={bookId} />);
    expect(screen.getByLabelText(/Tu nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('star')).toHaveLength(5);
    expect(screen.getByRole('button', { name: /Enviar Reseña/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    render(<ReviewForm bookId={bookId} />);
    await userEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Por favor, completa todos los campos: nombre, calificación y reseña.'
    );
    expect(localStorage.saveReview).not.toHaveBeenCalled();
  });

  it('submits valid form and clears inputs', async () => {
    render(<ReviewForm bookId={bookId} />);
    await userEvent.type(screen.getByLabelText(/Tu nombre/i), 'Juan');
    await userEvent.click(screen.getAllByTestId('star')[3]);
    await userEvent.type(screen.getByPlaceholderText(/Escribe tu reseña/i), 'Gran libro');
    await userEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));
    expect(localStorage.saveReview).toHaveBeenCalledWith(bookId, {
      name: 'Juan',
      rating: 4,
      text: 'Gran libro',
    });
    expect(screen.getByLabelText(/Tu nombre/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toHaveValue('');
    expect(reloadMock).toHaveBeenCalled();
  });

  it('does not submit if name is missing', async () => {
    render(<ReviewForm bookId={bookId} />);
    await userEvent.click(screen.getAllByTestId('star')[3]);
    await userEvent.type(screen.getByPlaceholderText(/Escribe tu reseña/i), 'Gran libro');
    await userEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Por favor, completa todos los campos: nombre, calificación y reseña.'
    );
    expect(localStorage.saveReview).not.toHaveBeenCalled();
  });

  it('does not submit if rating is missing', async () => {
    render(<ReviewForm bookId={bookId} />);
    await userEvent.type(screen.getByLabelText(/Tu nombre/i), 'Juan');
    await userEvent.type(screen.getByPlaceholderText(/Escribe tu reseña/i), 'Gran libro');
    await userEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Por favor, completa todos los campos: nombre, calificación y reseña.'
    );
    expect(localStorage.saveReview).not.toHaveBeenCalled();
  });

  it('does not submit if text is missing', async () => {
    render(<ReviewForm bookId={bookId} />);
    await userEvent.type(screen.getByLabelText(/Tu nombre/i), 'Juan');
    await userEvent.click(screen.getAllByTestId('star')[3]);
    await userEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Por favor, completa todos los campos: nombre, calificación y reseña.'
    );
    expect(localStorage.saveReview).not.toHaveBeenCalled();
  });
});
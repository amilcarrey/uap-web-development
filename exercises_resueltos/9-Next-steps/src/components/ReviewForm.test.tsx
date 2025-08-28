import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './ReviewForm';

// Extender expect con los matchers de jest-dom
import '@testing-library/jest-dom';

describe('ReviewForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    bookId: 'test-123',
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render all form fields', () => {
    render(<ReviewForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/título de la reseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reseña/i)).toBeInTheDocument();
    expect(screen.getByText(/calificación/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<ReviewForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /enviar reseña/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/nombre/i)).toBeInvalid();
  });

  it('should submit form with correct data', async () => {
    render(<ReviewForm {...defaultProps} />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/título de la reseña/i), 'Great Book!');
    await userEvent.type(screen.getByLabelText(/reseña/i), 'This book was amazing!');
    
    // Select 5 stars - encontrar todos los botones de estrella
    const starButtons = screen.getAllByRole('button');
    const fiveStarButton = starButtons[4]; // 5th star
    await userEvent.click(fiveStarButton);

    const submitButton = screen.getByRole('button', { name: /enviar reseña/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      bookId: 'test-123',
      author: 'Test User',
      title: 'Great Book!',
      content: 'This book was amazing!',
      rating: 5
    });
  });

  it('should handle rating selection correctly', async () => {
    render(<ReviewForm {...defaultProps} />);
    
    const starButtons = screen.getAllByRole('button');
    
    // Select 3 stars
    await userEvent.click(starButtons[2]);
    
    // Verificar que se seleccionaron 3 estrellas
    expect(starButtons[0].textContent).toBe('★');
    expect(starButtons[1].textContent).toBe('★');
    expect(starButtons[2].textContent).toBe('★');
    expect(starButtons[3].textContent).toBe('☆');
    expect(starButtons[4].textContent).toBe('☆');
  });

  it('should clear form after successful submission', async () => {
    render(<ReviewForm {...defaultProps} />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/título de la reseña/i), 'Great Book!');
    await userEvent.type(screen.getByLabelText(/reseña/i), 'This book was amazing!');
    
    // Select rating
    const starButtons = screen.getAllByRole('button');
    await userEvent.click(starButtons[4]);

    const submitButton = screen.getByRole('button', { name: /enviar reseña/i });
    await userEvent.click(submitButton);

    // Verificar que los campos se limpiaron después del envío
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/título de la reseña/i)).toHaveValue('');
    expect(screen.getByLabelText(/reseña/i)).toHaveValue('');
  });

  it('should show loading state when submitting', async () => {
    // Mock onSubmit que se demora
    const slowSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<ReviewForm bookId="test-123" onSubmit={slowSubmit} />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/título de la reseña/i), 'Great Book!');
    await userEvent.type(screen.getByLabelText(/reseña/i), 'This book was amazing!');
    
    const submitButton = screen.getByRole('button', { name: /enviar reseña/i });
    await userEvent.click(submitButton);

    // Verificar que el botón se deshabilita durante el envío
    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toContain('Enviando...');
  });
});
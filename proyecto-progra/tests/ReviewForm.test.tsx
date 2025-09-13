import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewForm from '../src/components/Reseña';

const mockOnSubmit = vi.fn();

describe('ReviewForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renderiza el formulario y permite escribir una reseña', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Reseña/i)).toBeTruthy();
  });

  it('envía una reseña válida', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Excelente libro!' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).toHaveBeenCalledWith({ rating: 1, text: 'Excelente libro!' });
  });

  it('incrementa votos positivos y negativos en cada reseña', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Muy bueno' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    fireEvent.click(screen.getAllByText('👍')[1]);
    const upVoteSpan = screen.getAllByText((content, element) => {
      return !!element && element.tagName.toLowerCase() === 'span' && content === '1';
    })[0];
    expect(upVoteSpan).toBeTruthy();
    fireEvent.click(screen.getAllByText('👎')[1]);
    const downVoteSpan = screen.getAllByText((content, element) => {
      return !!element && element.tagName.toLowerCase() === 'span' && content === '1';
    })[1];
    expect(downVoteSpan).toBeTruthy();
  });

  it('no permite enviar reseña vacía', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).not.toHaveBeenCalledWith({ rating: 1, text: '' });
  });

  it('no permite enviar reseña con solo espacios', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: '   ' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('permite enviar reseña con calificación máxima', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getAllByText('★')[4]);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Excelente!' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).toHaveBeenCalledWith({ rating: 5, text: 'Excelente!' });
  });

  it('permite enviar reseña con calificación mínima', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getAllByText('★')[0]);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Malo' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(mockOnSubmit).toHaveBeenCalledWith({ rating: 1, text: 'Malo' });
  });

  it('muestra correctamente varias reseñas enviadas', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Primera reseña' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    fireEvent.change(screen.getByLabelText(/Reseña/i), { target: { value: 'Segunda reseña' } });
    fireEvent.click(screen.getAllByText(/Enviar Reseña/i)[0]);
    expect(screen.getByText('Primera reseña')).toBeTruthy();
    expect(screen.getByText('Segunda reseña')).toBeTruthy();
  });
});

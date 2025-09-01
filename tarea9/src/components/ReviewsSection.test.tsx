import React from "react";
/// <reference types="vitest" />
/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsSection from './ReviewsSection';

describe('ReviewsSection', () => {
  it('debe mostrar "Aún no hay reseñas." si no hay reseñas', () => {
    render(<ReviewsSection bookId="1" />);
    expect(screen.getByText(/aún no hay reseñas/i)).toBeInTheDocument();
  });

  it('debe permitir agregar una reseña con texto y calificación', () => {
    render(<ReviewsSection bookId="1" />);
    fireEvent.change(screen.getByPlaceholderText(/escribe tu reseña/i), { target: { value: 'Excelente libro' } });
    fireEvent.click(screen.getAllByText('★')[3]); // 4 estrellas
    fireEvent.click(screen.getByRole('button', { name: /enviar reseña/i }));
    expect(screen.getByText('Excelente libro')).toBeInTheDocument();
    expect(screen.getAllByText('★').filter(e => e.className.includes('text-yellow-400')).length).toBe(4);
  });

});

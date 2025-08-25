// --- Tests unitarios para la lógica de reseñas locales ---
// Prueban la creación, recuperación y votación de reseñas usando localStorage
import { describe, it, expect, beforeEach } from 'vitest';
import { createReview, getReviews, voteReview } from '../review.locals';

describe('Reseñas locales', () => {
  // Antes de cada test, limpio el localStorage para que no haya datos previos
  beforeEach(() => {
    localStorage.clear();
  });

  // Test: crear y recuperar una reseña
  it('crea y recupera una reseña', () => {
    const r = createReview('book1', { rating: 5, content: 'Excelente libro' });
    const reviews = getReviews('book1');
    expect(reviews).toHaveLength(1); // Debe haber una reseña
    expect(reviews[0].content).toBe('Excelente libro'); // El contenido debe coincidir
  });

  // Test: votar una reseña a favor y en contra
  it('vota una reseña a favor y en contra', () => {
    const r = createReview('book1', { rating: 4, content: 'Bueno' });
    voteReview('book1', r.id, 1); // Voto positivo
    let reviews = getReviews('book1');
    expect(reviews[0].up).toBe(1); // Debe tener un voto positivo
    voteReview('book1', r.id, -1); // Voto negativo
    reviews = getReviews('book1');
    expect(reviews[0].down).toBe(1); // Debe tener un voto negativo
  });

  // Test: no vota si el id no existe
  it('no vota si el id no existe', () => {
    createReview('book1', { rating: 3, content: 'Regular' });
    voteReview('book1', 'no-existe', 1); // Intento votar un id inexistente
    const reviews = getReviews('book1');
    expect(reviews[0].up).toBe(0); // No debe cambiar nada
  });

  // Agrega más edge cases aquí...
});
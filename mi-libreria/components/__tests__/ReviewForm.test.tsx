// --- Test unitario para el formulario de reseñas ---
// Prueba que el formulario muestre error si el contenido es muy corto
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '../ReviewForm';

describe('ReviewForm', () => {
  // Test: muestra error si el contenido es muy corto
  it('muestra error si el contenido es muy corto', () => {
    render(<ReviewForm volumeId="book1" />);
    // Simulo que el usuario escribe una reseña muy corta y selecciona puntaje
    fireEvent.change(screen.getByPlaceholderText(/escribí tu reseña/i), { target: { value: 'ok' } });
    fireEvent.change(screen.getByLabelText(/puntaje/i), { target: { value: '5' } });
    // Envío el formulario
    fireEvent.submit(screen.getByTestId('review-form'));
    // Debe aparecer el mensaje de error
    expect(screen.getByText(/al menos 5 caracteres/i)).toBeInTheDocument();
  });

  // Más tests de edge cases...
});
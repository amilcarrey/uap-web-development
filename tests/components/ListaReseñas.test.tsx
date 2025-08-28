import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListaReseñas from '../../components/ListaReseñas';
import { vi } from 'vitest';

global.fetch = vi.fn();

const mockReseñas = [
  { id: 1, calificacion: 4, likes: 2, dislikes: 1, contenido: 'Muy bueno' },
  { id: 2, calificacion: 3, likes: 1, dislikes: 0, contenido: 'Aceptable' },
];

describe('ListaReseñas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra mensaje si no hay reseñas', () => {
    render(<ListaReseñas libroId="123" reseñas={[]} />);
    expect(screen.getByText(/no hay reseñas aún/i)).toBeInTheDocument();
  });

  it('renderiza las reseñas correctamente', () => {
    render(<ListaReseñas libroId="123" reseñas={mockReseñas} />);
    expect(screen.getByText('Muy bueno')).toBeInTheDocument();
    expect(screen.getByText('Aceptable')).toBeInTheDocument();
    expect(screen.getByText('★★★★')).toBeInTheDocument();
    expect(screen.getByText('★★★')).toBeInTheDocument();
  });

  it('no hace nada si no se pasa setReseñas al votar', async () => {
    render(<ListaReseñas libroId="123" reseñas={mockReseñas} />);
    const likeButton = screen.getAllByText(/👍/i)[0];
    fireEvent.click(likeButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('actualiza likes y llama fetch al votar positivo', async () => {
    const setReseñas = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({ ok: true });

    render(<ListaReseñas libroId="123" reseñas={mockReseñas} setReseñas={setReseñas} />);

    const likeButtons = screen.getAllByText(/👍/i);
    fireEvent.click(likeButtons[0]);

    expect(setReseñas).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/resenas/1/votar',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'UP' }),
        })
      );
    });
  });

  it('actualiza dislikes y llama fetch al votar negativo', async () => {
    const setReseñas = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({ ok: true });

    render(<ListaReseñas libroId="123" reseñas={mockReseñas} setReseñas={setReseñas} />);

    const dislikeButtons = screen.getAllByText(/👎/i);
    fireEvent.click(dislikeButtons[0]);

    expect(setReseñas).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/resenas/1/votar',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'DOWN' }),
        })
      );
    });
  });

  it('maneja error en fetch sin lanzar excepción', async () => {
    const setReseñas = vi.fn();
    (global.fetch as any).mockRejectedValueOnce(new Error('fail'));

    render(<ListaReseñas libroId="123" reseñas={mockReseñas} setReseñas={setReseñas} />);

    const likeButtons = screen.getAllByText(/👍/i);
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

  });
});

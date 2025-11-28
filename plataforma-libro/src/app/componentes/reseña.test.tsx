import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { Reseña } from '../tipos/libro';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReseñaComponente from './reseña';
import * as ResenasActions from '../../actions/resenas.actions';

// Mockeo de server actions
vi.mock('../../actions/resenas.actions', () => ({
  getReseñasByLibro: vi.fn(),
  agregarReseña: vi.fn(),
  votarReseña: vi.fn(),
}));

describe('ReseñaComponente', () => {
  const libroId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra "No hay reseñas aún" cuando no hay reseñas', async () => {
    (ResenasActions.getReseñasByLibro as any).mockResolvedValue([]);

    render(await ReseñaComponente({ libroId }));

    expect(screen.getByText('No hay reseñas aún.')).toBeInTheDocument();
  });

  it('muestra reseñas existentes correctamente', async () => {
    const mockReseñas: Reseña[] = [
      {
        id: '1',
        idLibro: libroId,
        usuario: 'Pepe',
        comentario: 'Excelente libro',
        valoracion: 5,
        likes: 2,
        dislikes: 0,
      },
      {
        id: '2',
        idLibro: libroId,
        usuario: 'Ana',
        comentario: 'No me gustó',
        valoracion: 2,
        likes: 0,
        dislikes: 1,
      },
    ];
    (ResenasActions.getReseñasByLibro as any).mockResolvedValue(mockReseñas);

    render(await ReseñaComponente({ libroId }));

    expect(screen.getByText('Pepe')).toBeInTheDocument();
    expect(screen.getByText('5 Estrellas')).toBeInTheDocument();
    expect(screen.getByText('Excelente libro')).toBeInTheDocument();

    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('2 Estrellas')).toBeInTheDocument();
    expect(screen.getByText('No me gustó')).toBeInTheDocument();
  });

  it('invoca agregarReseña al enviar el formulario', async () => {
    (ResenasActions.getReseñasByLibro as any).mockResolvedValue([]);
    (ResenasActions.agregarReseña as any).mockResolvedValue({ success: true });

    render(await ReseñaComponente({ libroId }));

    const inputUsuario = screen.getByPlaceholderText('Tu nombre');
    const textarea = screen.getByPlaceholderText('Escribe tu reseña aquí');
    const boton = screen.getByText('Agregar Reseña');

    await userEvent.type(inputUsuario, 'Pepe');
    await userEvent.type(textarea, 'Me encantó');
    await userEvent.click(boton);

    // Solo verificamos que la acción del servidor se llamó
    expect(ResenasActions.agregarReseña).toHaveBeenCalled();
  });

  it('invoca votarReseña al hacer like/dislike', async () => {
    const mockReseñas: Reseña[] = [
      {
        id: '1',
        idLibro: libroId,
        usuario: 'Pepe',
        comentario: 'Muy bueno',
        valoracion: 4,
        likes: 0,
        dislikes: 0,
      },
    ];
    (ResenasActions.getReseñasByLibro as any).mockResolvedValue(mockReseñas);

    render(await ReseñaComponente({ libroId }));

    const botonesLike = screen.getByText(/👍 0/);
    const botonesDislike = screen.getByText(/👎 0/);

    await userEvent.click(botonesLike);
    await userEvent.click(botonesDislike);

    expect(ResenasActions.votarReseña).toHaveBeenCalledTimes(2);
  });
});

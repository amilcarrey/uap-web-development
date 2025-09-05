import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Principal from './page';
import * as ServerActions from '../actions/server-actions';

// Mock del componente Carta
vi.mock('../app/componentes/portada', () => ({
  default: ({ libro }: any) => <div data-testid="carta">{libro.titulo}</div>,
}));

// Mock de la acción fetchBooks
vi.mock('../actions/server-actions', () => ({
  fetchBooks: vi.fn(),
}));

describe('Página Principal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el título principal', async () => {
    (ServerActions.fetchBooks as any).mockResolvedValue([]);

    render(await Principal({}));

    expect(screen.getByText(/Bienvenido a la biblioteca virtual Justito/i)).toBeInTheDocument();
    expect(screen.getByText(/porque te ofrecemos lo justo para leer/i)).toBeInTheDocument();
  });

  it('muestra los libros recibidos de fetchBooks', async () => {
    const librosMock = [
      { id: '1', titulo: 'Libro 1' },
      { id: '2', titulo: 'Libro 2' },
    ];
    (ServerActions.fetchBooks as any).mockResolvedValue(librosMock);

    render(await Principal({}));

    const cartas = screen.getAllByTestId('carta');
    expect(cartas).toHaveLength(2);
    expect(cartas[0]).toHaveTextContent('Libro 1');
    expect(cartas[1]).toHaveTextContent('Libro 2');
  });

  it('maneja array vacío de libros', async () => {
    (ServerActions.fetchBooks as any).mockResolvedValue([]);

    render(await Principal({}));

    expect(screen.queryAllByTestId('carta')).toHaveLength(0);
  });

  it('usa correctamente la query de searchParams', async () => {
    const librosMock = [{ id: '3', titulo: 'Libro Buscado' }];
    (ServerActions.fetchBooks as any).mockResolvedValue(librosMock);

    const searchParams = { q: 'Buscado' };
    render(await Principal({ searchParams }));

    const carta = screen.getByTestId('carta');
    expect(carta).toHaveTextContent('Libro Buscado');
    expect(ServerActions.fetchBooks).toHaveBeenCalledWith('Buscado');
  });
});

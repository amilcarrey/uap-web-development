import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../page';
import { describe, it, beforeEach, vi, expect } from 'vitest';

describe('App de Reseñas de Libros', () => {
  // Limpiar mocks y localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza el buscador y lista vacía inicialmente', () => {
    render(<Page />);
    expect(screen.getByPlaceholderText('Buscar libro...')).toBeInTheDocument();
    expect(screen.queryByText('Libro 1')).not.toBeInTheDocument();
  });

  it('busca libros y muestra resultados', async () => {
    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Buscar libro' }));

    const libro = await screen.findByText('Libro 1');
    expect(libro).toBeInTheDocument();
  });

  it('agrega una reseña correctamente', async () => {
    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Buscar libro' }));

    const enviarBtn = await screen.findByText('Enviar');

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Usuario1' } });
    fireEvent.change(screen.getByPlaceholderText('Escribe tu reseña'), { target: { value: 'Muy bueno' } });
    fireEvent.click(enviarBtn);

    const contenedorReseñas = screen.getByTestId('reseñas-lista'); // Solo las reseñas
    expect(contenedorReseñas).toHaveTextContent('Usuario1');
    expect(contenedorReseñas).toHaveTextContent('Muy bueno');
  });

  it('no agrega reseña si nombre o comentario está vacío', async () => {
    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Buscar libro' }));

    const enviarBtn = await screen.findByText('Enviar');

    // Solo nombre
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Usuario1' } });
    fireEvent.change(screen.getByPlaceholderText('Escribe tu reseña'), { target: { value: '' } });
    fireEvent.click(enviarBtn);
    expect(screen.queryByTestId('reseñas-lista')).not.toHaveTextContent('Usuario1');

    // Solo comentario
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Escribe tu reseña'), { target: { value: 'Hola' } });
    fireEvent.click(enviarBtn);
    expect(screen.queryByTestId('reseñas-lista')).not.toHaveTextContent('Hola');
  });

  it('vota reseña correctamente', async () => {
    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Buscar libro' }));

    const enviarBtn = await screen.findByText('Enviar');

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Usuario1' } });
    fireEvent.change(screen.getByPlaceholderText('Escribe tu reseña'), { target: { value: 'Muy bueno' } });
    fireEvent.click(enviarBtn);

    const upvoteBtn = screen.getByText('👍');
    const downvoteBtn = screen.getByText('👎');

    fireEvent.click(upvoteBtn);
    expect(screen.getByText('1 votos')).toBeInTheDocument();

    fireEvent.click(downvoteBtn);
    expect(screen.getByText('0 votos')).toBeInTheDocument();
  });

  it('renderiza libro sin autores o sin imagen correctamente', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              {
                id: '2',
                volumeInfo: { title: 'Libro sin autor', description: '', imageLinks: {} },
              },
            ],
          }),
      })
    );

    render(<Page />);
    fireEvent.change(screen.getByPlaceholderText('Buscar libro...'), { target: { value: 'test' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Buscar libro' }));

    const libro = await screen.findByText('Libro sin autor');
    expect(libro).toBeInTheDocument();
    expect(screen.getByText('Desconocido')).toBeInTheDocument(); // matcher simple
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
  });
});

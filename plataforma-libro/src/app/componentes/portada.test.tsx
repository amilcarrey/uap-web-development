import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Carta from './portada';
import { describe, it, expect } from 'vitest';
import { Libro } from '../tipos/libro';

// Caso con portada definida
const libroConPortada: Libro = {
  id: '1',
  titulo: 'Libro con portada',
  autor: ['Autor Uno'],
  imagen: 'https://example.com/portada.jpg',
};

// Caso sin portada definida
const libroSinPortada: Libro = {
  id: '2',
  titulo: 'Libro sin portada',
  autor: ['Autor Desconocido'],
  imagen: undefined, //en caso q falte imagen
};

describe('Componente Carta', () => {
  it('muestra la portada cuando existe', () => {
    render(<Carta libro={libroConPortada} />);

    const imagen = screen.getByRole('img');
    expect(imagen).toHaveAttribute('src', libroConPortada.imagen);
    expect(imagen).toHaveAttribute('alt', libroConPortada.titulo);
  });

  it('usa la portada por defecto cuando no hay imagen', () => {
    render(<Carta libro={libroSinPortada} />);

    const imagen = screen.getByRole('img');
    expect(imagen).toHaveAttribute('src', '/images/default-book.jpg'); // 👈 por defecto
    expect(imagen).toHaveAttribute('alt', libroSinPortada.titulo);
  });
});

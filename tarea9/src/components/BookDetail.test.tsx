import React from "react";
/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import BookDetail from './BookDetail';
import { Book } from '../hooks/useBooksSearch';

describe('BookDetail', () => {
  const book: Book = {
    id: '1',
    title: 'React',
    authors: ['Dan Abramov'],
    publishedDate: '2020',
    description: 'Libro sobre React',
    thumbnail: 'img.jpg',
  };

  it('debe mostrar título, autor, fecha de publicación, descripción y portada', () => {
    render(<BookDetail book={book} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Dan Abramov')).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/Libro sobre React/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'img.jpg');
  });

  it('debe manejar el caso en que falten datos (sin autor, sin imagen)', () => {
    const bookSinDatos: Book = {
      id: '2',
      title: 'Sin datos',
      authors: [],
      publishedDate: '',
      description: '',
    };
    render(<BookDetail book={bookSinDatos} />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText(/Autor desconocido/)).toBeInTheDocument();
    expect(screen.getByText(/Sin descripción disponible/)).toBeInTheDocument();
  });
});

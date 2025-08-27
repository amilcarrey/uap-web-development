import React from "react";
/// <reference types="vitest" />
/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import BookList from './BookList';
import { Book } from '../hooks/useBooksSearch';
import { vi } from 'vitest';

describe('BookList', () => {
  const books: Book[] = [
    {
      id: '1',
      title: 'React',
      authors: ['Dan Abramov'],
      publishedDate: '2020',
      description: 'Libro sobre React',
      thumbnail: 'img.jpg',
    },
  ];

  it('debe renderizar una lista de libros con título, autor y portada', () => {
    render(<BookList books={books} onSelect={vi.fn()} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Dan Abramov')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'img.jpg');
  });

  it('si la lista está vacía debe mostrar un mensaje "No se encontraron libros."', () => {
    render(<BookList books={[]} onSelect={vi.fn()} />);
    expect(screen.getByText(/no se encontraron libros/i)).toBeInTheDocument();
  });

  it('debe llamar a onSelectBook cuando se hace click en "Ver detalles"', () => {
    const onSelect = vi.fn();
    render(<BookList books={books} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    expect(onSelect).toHaveBeenCalledWith(books[0]);
  });
});

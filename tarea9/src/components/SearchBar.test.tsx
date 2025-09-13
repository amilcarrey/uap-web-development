import React from "react";
/// <reference types="vitest" />
/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  it('debe renderizar un input y un botón', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText(/buscar libros/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('debe llamar a onSearch cuando el usuario escribe y presiona Enter', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/buscar libros/i);
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('react');
  });

  it('debe llamar a onSearch cuando el usuario da click en el botón', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/buscar libros/i);
    fireEvent.change(input, { target: { value: 'nextjs' } });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(onSearch).toHaveBeenCalledWith('nextjs');
  });
});

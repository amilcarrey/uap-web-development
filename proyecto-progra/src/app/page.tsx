"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
            thumbnail?: string;
        };
        publishedDate?: string;
        pageCount?: number;
        categories?: string[];
    };
}

export default function Home() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDefaultBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=programming`);
                const data = await res.json();
                if (data.items) {
                    setBooks(data.items);
                } else {
                    setBooks([]);
                    setError("No se encontraron libros.");
                }
            } catch (e) {
                setError("Error al obtener la información.");
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultBooks();
    }, []);

    const searchBooks = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.items) {
                setBooks(data.items);
            } else {
                setBooks([]);
                setError("No se encontraron libros.");
            }
        } catch (e) {
            setError("Error al obtener la información.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Buscador de Libros</h1>
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Buscar por título, autor o ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-80"
                />
                <button
                    onClick={searchBooks}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Buscar
                </button>
            </div>
            {loading && <p className="text-center text-gray-500">Cargando...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div
                        key={book.id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                    >
                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                        )}
                        <h2 className="text-xl font-semibold mb-2">{book.volumeInfo.title}</h2>
                        {book.volumeInfo.authors && (
                            <p className="text-gray-700 mb-2">
                                <strong>Autores:</strong> {book.volumeInfo.authors.join(', ')}
                            </p>
                        )}
                        <Link href={`/books/${book.id}`}>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Ver detalles
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
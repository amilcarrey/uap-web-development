"use client";

import React, { useState, useEffect } from 'react';
import ReviewForm from '../components/Reseña';

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

interface Review {
    rating: number;
    text: string;
    votes: number;
}

export default function Home() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Record<string, Review[]>>({});

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

    const handleReviewSubmit = (bookId: string, review: Review) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [bookId]: [...(prevReviews[bookId] || []), review],
        }));
    };

    const handleVote = (bookId: string, index: number, direction: 'up' | 'down') => {
    setReviews((prevReviews) => {
        const updatedReviews = [...(prevReviews[bookId] || [])];
        if (direction === 'up') {
            updatedReviews[index].votes += 1;
        } else {
            updatedReviews[index].votes -= 1;
        }
        return {
            ...prevReviews,
            [bookId]: updatedReviews,
        };
    });
};

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Buscador de Libros</h1>
            <div>
                <input
                    type="text"
                    placeholder="Buscar por título, autor o ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: '0.5rem', width: '300px' }}
                />
                <button onClick={searchBooks} style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
                    Buscar
                </button>
            </div>
            {loading && <p>Cargando...</p>}
            {error && <p>{error}</p>}
            <div style={{ marginTop: '2rem' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                                style={{ float: 'left', marginRight: '1rem' }}
                            />
                        )}
                        <h2>{book.volumeInfo.title}</h2>
                        {book.volumeInfo.authors && <p>Autores: {book.volumeInfo.authors.join(', ')}</p>}
                        {book.volumeInfo.publishedDate && <p>Publicado: {book.volumeInfo.publishedDate}</p>}
                        {book.volumeInfo.pageCount && <p>Páginas: {book.volumeInfo.pageCount}</p>}
                        {book.volumeInfo.description && (
                            <p>{book.volumeInfo.description.substring(0, 200)}...</p>
                        )}
                        <div style={{ clear: 'both' }}></div>

                        {/* Formulario de reseñas */}
                        <ReviewForm onSubmit={(review) => handleReviewSubmit(book.id, { ...review, votes: 0 })} />

                        {/* Mostrar reseñas asociadas al libro */}
                        <div>
                            <h3>Reseñas</h3>
                            {(reviews[book.id] || []).map((review, index) => (
                                <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                                    <p><strong>Calificación:</strong> {review.rating} estrellas</p>
                                    <p>{review.text}</p>
                                    <p><strong>Votos:</strong> {review.votes}</p>
                                    <button onClick={() => handleVote(book.id, index, 'up')} style={{ marginRight: '1rem' }}>
                                        👍 Votar a favor
                                    </button>
                                    <button onClick={() => handleVote(book.id, index, 'down')}>
                                        👎 Votar en contra
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
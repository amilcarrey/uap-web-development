"use client";

import React, { useState, useEffect } from 'react';
import ReviewForm from '../../../components/Reseña';

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

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setResolvedParams(resolved);
        };

        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        const fetchBookDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${resolvedParams.id}`);
                const data = await res.json();
                if (data) {
                    setBook(data);
                } else {
                    setError("No se encontró el libro.");
                }
            } catch (e) {
                setError("Error al obtener la información.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [resolvedParams]);

    const handleReviewSubmit = (review: { rating: number; text: string }) => {
        setReviews((prevReviews) => [...prevReviews, { ...review, votes: 0 }]);
    };

    const handleVote = (index: number, direction: 'up' | 'down') => {
        setReviews((prevReviews) => {
            const updatedReviews = [...prevReviews];
            if (direction === 'up') {
                updatedReviews[index].votes += 1;
            } else {
                updatedReviews[index].votes -= 1;
            }
            return updatedReviews;
        });
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            {book && (
                <>
                    <h1>{book.volumeInfo.title}</h1>
                    {book.volumeInfo.imageLinks?.thumbnail && (
                        <img
                            src={book.volumeInfo.imageLinks.thumbnail}
                            alt={book.volumeInfo.title}
                            style={{ float: 'left', marginRight: '1rem' }}
                        />
                    )}
                    {book.volumeInfo.authors && <p>Autores: {book.volumeInfo.authors.join(', ')}</p>}
                    {book.volumeInfo.publishedDate && <p>Publicado: {book.volumeInfo.publishedDate}</p>}
                    {book.volumeInfo.pageCount && <p>Páginas: {book.volumeInfo.pageCount}</p>}
                    {book.volumeInfo.description && <p>{book.volumeInfo.description}</p>}
                    <div style={{ clear: 'both' }}></div>

                    <ReviewForm onSubmit={handleReviewSubmit} />

                    <div>
                        <h3>Reseñas</h3>
                        {reviews.map((review, index) => (
                            <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                                <p><strong>Calificación:</strong> {review.rating} estrellas</p>
                                <p>{review.text}</p>
                                <p><strong>Votos:</strong> {review.votes}</p>
                                <button onClick={() => handleVote(index, 'up')} style={{ marginRight: '1rem' }}>
                                    👍
                                </button>
                                <button onClick={() => handleVote(index, 'down')}>
                                    👎
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
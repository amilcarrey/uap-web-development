'use client'

import { useState, useEffect } from 'react'
import BookSearch from '@/components/BookSearch'
import BookList from '@/components/BookList'
import BookDetails from '@/components/BookDetails'
import { Book, Review } from '@/types'

export default function Home() {
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string, searchType: string) => {
    setLoading(true)
    setError(null)
    
    try {
      let searchQuery = query
      if (searchType === 'isbn') {
        searchQuery = `isbn:${query}`
      } else if (searchType === 'author') {
        searchQuery = `inauthor:${query}`
      }
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20`
      )
      
      if (!response.ok) {
        throw new Error('Error al buscar libros')
      }
      
      const data = await response.json()
      const books: Book[] = data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        imageUrl: item.volumeInfo.imageLinks?.thumbnail,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories || []
      })) || []
      
      setSearchResults(books)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
    // Cargar reseñas desde localStorage
    const storedReviews = localStorage.getItem(`reviews-${book.id}`)
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews))
    } else {
      setReviews([])
    }
  }

  const handleAddReview = (review: Omit<Review, 'id' | 'votes'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      votes: 0
    }
    
    const updatedReviews = [...reviews, newReview]
    setReviews(updatedReviews)
    localStorage.setItem(`reviews-${selectedBook!.id}`, JSON.stringify(updatedReviews))
  }

  const handleVote = (reviewId: string, increment: number) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, votes: review.votes + increment } 
        : review
    )
    setReviews(updatedReviews)
    localStorage.setItem(`reviews-${selectedBook!.id}`, JSON.stringify(updatedReviews))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Descubre y Reseña tus Libros Favoritos
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explora millones de libros, lee reseñas de la comunidad y comparte tus propias opiniones.
        </p>
      </div>

      <BookSearch onSearch={handleSearch} loading={loading} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <BookList 
            books={searchResults} 
            onBookSelect={handleBookSelect}
            selectedBookId={selectedBook?.id}
          />
        </div>
        
        <div className="lg:col-span-1">
          {selectedBook ? (
            <BookDetails 
              book={selectedBook}
              reviews={reviews}
              onAddReview={handleAddReview}
              onVote={handleVote}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona un libro</h3>
              <p className="text-gray-500">Haz clic en un libro de la lista para ver sus detalles y reseñas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
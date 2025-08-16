'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Review } from '../types/index';
import { ReviewsService } from '../reviewService';
import DashboardHeader from '../components/DashboardHeader';
import StarRating from '../components/StarRating';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'saved'>('reviews');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      router.push('/welcome');
      return;
    }
    setCurrentUser(savedUser);
  }, [router]);

  // Cargar reseñas del usuario y libros guardados
  useEffect(() => {
    if (currentUser) {
      const allReviews = ReviewsService.getReviewsForBook(''); // Obtener todas las reseñas
      const userReviews = allReviews.filter(review => review.author === currentUser);
      setUserReviews(userReviews);
      
      // Cargar libros guardados
      const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
      setSavedBooks(savedBooks);
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    router.push('/welcome');
  };

  // Generar iniciales del usuario
  const initials = currentUser
    ? currentUser
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  if (!currentUser) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Información del perfil */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-2xl font-medium">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-light text-black mb-2">
                  {currentUser}
                </h1>
                <p className="text-gray-600">
                  {localStorage.getItem('userEmail') || 'usuario@ejemplo.com'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>📚 {userReviews.length} reseñas</span>
                  <span>⭐ {savedBooks.length} libros guardados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Mis Reseñas ({userReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Libros Guardados ({savedBooks.length})
            </button>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-light text-black mb-6">
                Mis Reseñas
              </h2>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                                               <div>
                         <h3 className="font-medium text-black mb-1">
                           {review.bookTitle || review.bookId}
                         </h3>
                          <StarRating rating={review.rating} readonly />
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span>👍 {review.upvotes}</span>
                        <span>👎 {review.downvotes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    No tienes reseñas aún
                  </h3>
                  <p className="text-gray-600">
                    Comienza a calificar libros para ver tus reseñas aquí
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <h2 className="text-2xl font-light text-black mb-6">
                Libros Guardados
              </h2>
              {savedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedBooks.map((book) => (
                    <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-black mb-2">
                        {book.volumeInfo.title}
                      </h3>
                      {book.volumeInfo.authors && (
                        <p className="text-gray-600 text-sm mb-2">
                          {book.volumeInfo.authors.join(', ')}
                        </p>
                      )}
                      {book.volumeInfo.description && (
                        <p className="text-gray-500 text-sm">
                          {book.volumeInfo.description.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-black mb-2">
                    No tienes libros guardados
                  </h3>
                  <p className="text-gray-600">
                    Guarda tus libros favoritos para acceder a ellos fácilmente
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

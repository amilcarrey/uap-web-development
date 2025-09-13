import { useState } from 'react'
import { Review } from '@/types'

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, 'id' | 'votes'>) => void;
  onCancel: () => void;
  bookId: string;
}

interface ReviewFormData {
  author: string;
  rating: number;
  comment: string;
}

export default function ReviewForm({ onSubmit, onCancel, bookId }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    author: '',
    rating: 0,
    comment: ''
  })
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.rating === 0) {
      alert('Por favor selecciona una calificación')
      return
    }
    
    onSubmit({
      bookId: bookId,
      author: formData.author || 'Anónimo',
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString()
    })
    
    setFormData({ author: '', rating: 0, comment: '' })
  }

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const handleRatingHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`text-2xl ${
            i <= (hoverRating || formData.rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } transition-colors duration-200`}
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </button>
      )
    }
    return stars
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Escribe tu reseña</h3>
      
      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre (opcional)
        </label>
        <input
          type="text"
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Tu nombre"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación *
        </label>
        <div className="flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
          {renderStars()}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating > 0 ? `${formData.rating} estrella${formData.rating !== 1 ? 's' : ''}` : 'Selecciona una calificación'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Reseña *
        </label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Escribe tu reseña aquí..."
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Enviar Reseña
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
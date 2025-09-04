import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export interface StarRatingProps {
  value: number
  onChange: (val: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= (hover ?? value) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )
}
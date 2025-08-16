'use client';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  readonly = false 
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={`text-xl ${
            star <= rating 
              ? 'text-black' 
              : 'text-gray-300'
          } ${!readonly ? 'hover:text-gray-600 cursor-pointer' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

import React, { useState } from 'react';

interface ReviewInput {
    rating: number;
    text: string;
}

interface ReviewFormProps {
    onSubmit: (review: ReviewInput) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState<number>(1);
    const [text, setText] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ rating, text });
        setRating(1);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Calificación:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Reseña:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe tu reseña aquí..."
                ></textarea>
            </div>
            <button type="submit">Enviar Reseña</button>
        </form>
    );
};

export default ReviewForm;
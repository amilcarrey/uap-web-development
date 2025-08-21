import React, { useState } from 'react';

interface Review {
    rating: number;
    text: string;
}

interface ReviewFormProps {
    onSubmit: (review: Review) => void;
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
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div>
                <label>Calificación (1-5):</label>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(num => (
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
                    rows={4}
                    cols={50}
                    placeholder="Escribe tu reseña aquí..."
                ></textarea>
            </div>
            <button type="submit">Enviar Reseña</button>
        </form>
    );
};

export default ReviewForm;
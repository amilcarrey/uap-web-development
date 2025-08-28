import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewForm({
  bookId,
  onSubmit,
}: {
  bookId: string;
  onSubmit: (r: {
    rating: number;
    text: string;
    displayName: string;
  }) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState("Anónimo");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) {
      setError("La reseña es muy corta");
      return;
    }
    setError("");
    await onSubmit({ rating, text, displayName });
    setText("");
  }

  return (
    <form
      onSubmit={handle}
      style={{
        border: "1px solid #eee",
        padding: 12,
        borderRadius: 8,
        display: "grid",
        gap: 8,
      }}
    >
      <label>
        Tu nombre visible
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>
      <label>
        Calificación
        <StarRating value={rating} onChange={setRating} />
      </label>
      <label>
        Reseña
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué te pareció?"
          rows={4}
        />
      </label>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      <button type="submit">Publicar reseña</button>
    </form>
  );
}

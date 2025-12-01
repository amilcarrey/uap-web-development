// src/components/ReviewForm.tsx
import React, { useState } from "react";
import { api } from "../api/client";

type Props = {
  bookId: string;
  onSaved?: () => void;
};

export default function ReviewForm({ bookId, onSaved }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId) return;

    try {
      setSubmitting(true);
      await api.post("/reviews", { bookId, rating, content });
      setContent("");
      setRating(5);
      onSaved?.();
    } catch (err: any) {
      console.error(err);
      alert(`Error guardando reseña: ${err.message ?? "desconocido"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: "1rem" }}>
      <fieldset disabled={submitting} style={{ border: "1px solid #ccc", padding: "1rem" }}>
        <legend>Escribir Reseña</legend>

        <label>
          Calificación:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          >
            {[5, 4, 3, 2, 1].map((v) => (
              <option key={v} value={v}>
                {v} ⭐
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: "0.5rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu reseña..."
            rows={4}
            style={{ width: "100%", resize: "vertical" }}
          />
        </div>

        <button type="submit" disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Enviando..." : "Enviar reseña"}
        </button>
      </fieldset>
    </form>
  );
}

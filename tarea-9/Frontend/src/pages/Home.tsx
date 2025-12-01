import React, { useState } from "react";
import BookCard from "../components/BookCard";
import { useSearchBooks } from "../hooks/useSearchBooks";
import BookDetails from "../components/BookDetails";

type Heart = {
  id: number;
  top: number;
  left: number;
  size: number;
  rotation: number;
  xOffset: number;
  duration: number;
};

export default function Home() {
  const { search, results, loading } = useSearchBooks();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const handleSearch = () => {
    search(q);

    if (q.trim().toLowerCase() === "nimsi") {
      const newHearts: Heart[] = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        top: Math.random() * 100, // posición vertical inicial % de la pantalla
        left: Math.random() * 100, // posición horizontal inicial %
        size: 30 + Math.random() * 50,
        rotation: Math.random() * 360,
        xOffset: Math.random() * 40 - 20,
        duration: 3 + Math.random() * 4, // duración diferente para cada corazón
      }));
      setHearts(newHearts);

      setTimeout(() => setHearts([]), 6000); // desaparecen después de 6s
    }
  };

  return (
    <div style={{ padding: 16, position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <h1>Book Hub</h1>
      <div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Título, autor o ISBN"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // columnas adaptables
    gridTemplateRows: "repeat(2, auto)", // dos filas
    gap: "16px",
    marginTop: "16px",
  }}
>
  {results.map((r) => (
    <BookCard
      key={r.id}
      id={r.id}
      title={r.volumeInfo?.title}
      authors={r.volumeInfo?.authors}
      thumbnail={r.volumeInfo?.imageLinks?.thumbnail}
      onClick={setSelected}
    />
  ))}
</div>

      )}

      {selected && (
        <div style={{ marginTop: 24 }}>
          <BookDetails id={selected} />
        </div>
      )}

      {/* Corazones animados */}
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            top: `${h.top}%`,
            left: `${h.left}%`,
            fontSize: h.size,
            color: "red",
            transform: `rotate(${h.rotation}deg)`,
            animation: `floatHeart ${h.duration}s ease-in-out forwards`,
            pointerEvents: "none",
          }}
        >
          ❤️
        </div>
      ))}

      <style>
        {`
          @keyframes floatHeart {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            25% { transform: translate(10px, 25vh) rotate(90deg); }
            50% { transform: translate(-10px, 50vh) rotate(180deg); }
            75% { transform: translate(10px, 75vh) rotate(270deg); }
            100% { transform: translate(0px, 100vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

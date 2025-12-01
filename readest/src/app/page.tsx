"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Error buscando libros:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar por título, autor o ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading && <p className="text-gray-600">🔎 Buscando...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((book) => {
          const info = book.volumeInfo;
          return (
            <Link key={book.id} href={`/book/${book.id}`}>
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer">
                {info.imageLinks?.thumbnail && (
                  <img
                    src={info.imageLinks.thumbnail}
                    alt={info.title}
                    className="w-full h-60 object-cover rounded"
                  />
                )}
                <h2 className="font-bold mt-2">{info.title}</h2>
                <p className="text-sm text-gray-600">
                  {info.authors?.join(", ") || "Autor desconocido"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

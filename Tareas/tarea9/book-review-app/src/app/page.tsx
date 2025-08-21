"use client";
import { useState } from "react";
import { searchBooks } from "@/lib/googleBooks";
import Link from "next/link";
import { GoogleBook } from "@/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<GoogleBook[]>([]);

  async function handleSearch() {
    const data = await searchBooks(query);
    setBooks(data.items || []);
  }

  return (
    <div>
      <div className="mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
          Search
        </button>
      </div>

      <div>
        {books.map(b => (
          <div key={b.id} className="border p-4 mb-2 bg-white">
            <h2 className="font-bold">{b.volumeInfo.title}</h2>
            <p>{b.volumeInfo.authors?.join(", ")}</p>
            <Link href={`/book/${b.id}`} className="text-blue-600 underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

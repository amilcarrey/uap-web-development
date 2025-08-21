"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/books/search?q=${query}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md shadow-md bg-white rounded-lg overflow-hidden"
    >
      <input
        type="text"
        placeholder="Buscar libro por título, autor o ISBN..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-2 text-gray-700 outline-none"
      />
      <button
        type="submit"
        className="px-4 bg-purple-600 text-white hover:bg-purple-700 transition"
      >
        Buscar
      </button>
    </form>
  );
}

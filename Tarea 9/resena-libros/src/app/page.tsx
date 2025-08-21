"use client";

import Link from "next/link";
import { SearchForm } from "@/components/ui/searchForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function go(query: string) {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
   <section className="space-y-6 py-10">
      <h1 className="text-3xl font-bold">Descubrí libros</h1>
      <SearchForm />
      <p className="text-sm text-[#a0a0a0]">
        Ejemplos: <button onClick={() => go("harry potter")} className="underline">harry potter</button> ·
        <button onClick={() => go("inauthor:rowling")} className="underline ml-1">inauthor:rowling</button> ·
        <button onClick={() => go("isbn:9780439708180")} className="underline ml-1">isbn:9780439708180</button>
      </p>
    </section>
  );
}
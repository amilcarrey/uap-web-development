// src/app/page.tsx
// Server component
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-neutral-900 to-indigo-900">
      <section className="w-full max-w-2xl mx-auto space-y-12 bg-neutral-950/80 rounded-2xl shadow-2xl p-12 border border-neutral-800">
        <h1 className="text-6xl font-extrabold text-center text-indigo-400 drop-shadow mb-6">BookApp</h1>
        <p className="text-center text-neutral-300 mb-8 text-xl leading-relaxed">Buscá por <span className="font-semibold text-indigo-300">título</span>, <span className="font-semibold text-indigo-300">autor</span> o <span className="font-semibold text-indigo-300">ISBN</span>.<br /><span className="text-base text-neutral-400 mt-2 block">Ejemplo: <code className="bg-neutral-800 px-3 py-2 rounded text-lg">isbn:9780439708180</code></span></p>

        <form action="/search" className="flex gap-4">
          <input
            name="q"
            className="flex-1 rounded-xl border bg-neutral-900  py-4 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <button className="rounded-xl bg-indigo-600 px-8 py-4 text-xl font-bold text-white shadow hover:bg-indigo-500 transition">
            Buscar
          </button>
        </form>

        <div className="text-sm text-neutral-400 text-center mt-6 space-y-2">
          <div className="font-semibold text-indigo-300 text-lg mb-3">Tipos de búsqueda:</div>
          <div className="space-x-2">
            <code className="bg-neutral-800 px-3 py-2 rounded text-base">harry potter</code>{" "}
            <code className="bg-neutral-800 px-3 py-2 rounded text-base">inauthor:rowling</code>{" "}
            <code className="bg-neutral-800 px-3 py-2 rounded text-base">isbn:978...</code>
          </div>
        </div>
      </section>
    </main>
  );
}

// app/page.tsx
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16">
      {/* fondo suave violeta */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      </div>

      {/* tarjeta principal centrada */}
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-violet-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
        <h1 className="text-2xl md:text-3xl font-bold pastel-title text-center">
          Descubrí, calificá y compartí libros
        </h1>
        <p className="text-sm pastel-title text-center">
          Buscá por título, autor o ISBN.
        </p>
        <div className="w-full flex flex-col items-center">
          <div className="max-w-lg w-full pastel-title">
            <SearchBar placeholder="Ej: harry potter, inauthor:rowling, isbn:9780439708180" />
          </div>
          <div className="mt-2 pastel-title text-lg font-semibold">⌘K Buscar</div>
        </div>
        <p className="text-xs text-violet-500 text-center">
          Tip: probá <em>harry potter</em>, <em>inauthor:rowling</em> o <em>isbn:9780439708180</em>.
        </p>
      </div>
    </section>
  );
}

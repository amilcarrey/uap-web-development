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

      {/* tarjeta principal */}
      <div className="grid items-center gap-10 rounded-3xl border border-violet-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:grid-cols-2 md:p-12">
        {/* texto + buscador */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-violet-700 md:text-6xl">
            Descubrí, calificá y compartí libros
          </h1>

          <p className="text-base text-violet-600 md:text-lg">
            Buscá por título, autor o ISBN. Datos en tiempo real desde Google Books, con una
            interfaz limpia y rápida.
          </p>

          <div className="max-w-lg">
            <SearchBar placeholder="Ej: harry potter, inauthor:rowling, isbn:9780439708180" />
          </div>

          <p className="text-xs text-violet-500">
            Tip: probá <em>harry potter</em>, <em>inauthor:rowling</em> o{' '}
            <em>isbn:9780439708180</em>.
          </p>
        </div>

        {/* panel de features */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-violet-50/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="relative">
              <div className="mb-4 text-sm font-medium text-violet-700">Características</div>

              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="rounded-2xl border border-violet-200 bg-white/70 p-4 backdrop-blur">
                  <div className="text-2xl">🔎</div>
                  <div className="mt-1 font-semibold text-violet-700">Búsqueda avanzada</div>
                  <div className="text-xs text-violet-500">título, autor, ISBN</div>
                </li>

                <li className="rounded-2xl border border-violet-200 bg-white/70 p-4 backdrop-blur">
                  <div className="text-2xl">📘</div>
                  <div className="mt-1 font-semibold text-violet-700">Portadas y detalles</div>
                  <div className="text-xs text-violet-500">editorial, páginas, fechas</div>
                </li>

                <li className="rounded-2xl border border-violet-200 bg-white/70 p-4 backdrop-blur">
                  <div className="text-2xl">⭐</div>
                  <div className="mt-1 font-semibold text-violet-700">Reseñas locales</div>
                  <div className="text-xs text-violet-500">sin backend</div>
                </li>

                <li className="rounded-2xl border border-violet-200 bg-white/70 p-4 backdrop-blur">
                  <div className="text-2xl">⚡</div>
                  <div className="mt-1 font-semibold text-violet-700">Server Components</div>
                  <div className="text-xs text-violet-500">fetch en el servidor</div>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/search"
              className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-2.5 text-white shadow-lg transition hover:bg-violet-700"
            >
              Empezar a buscar
            </a>
            <a
              href="/search?q=harry%20potter"
              className="inline-flex items-center justify-center rounded-2xl border border-violet-300 bg-white/70 px-5 py-2.5 text-violet-700 shadow-sm backdrop-blur transition hover:bg-violet-50"
            >
              Probar con “harry potter”
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

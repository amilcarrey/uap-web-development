// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mundos en palabras',
  description: 'Busca libros con Google Books, mira detalles y deja reseñas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight text-lg">
              Mundos en palabras
            </a>
            <a href="/search" className="text-sm underline">Buscar</a>
          </nav>
        </header>

  <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

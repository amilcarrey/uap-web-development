import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Reviews',
  description: 'Plataforma de reseñas y descubrimiento de libros',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-white-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 font-semibold">Book Reviews</div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

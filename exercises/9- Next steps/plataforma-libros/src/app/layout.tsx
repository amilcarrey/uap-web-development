import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'App de Reseñas de Libros',
  description: 'Descubre y reseña libros',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Reseñas de Libros facheras</h1>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-500 p-4 text-center">
          © 2025 App de libros bien fachera
        </footer>
      </body>
    </html>
  );
}
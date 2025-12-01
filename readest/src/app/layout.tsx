import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "App de Reseñas de Libros",
  description: "Descubrí libros, compartí reseñas y votá tus favoritas",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-blue-600 text-white p-4 shadow">
          <h1 className="text-2xl font-bold"> Reseñas de Libros</h1>
        </header>

        <main className="container mx-auto p-4">{children}</main>

        <footer className="bg-gray-200 text-center py-4 mt-8">
          <p className="text-sm">Hecho en Next.js</p>
        </footer>
      </body>
    </html>
  );
}

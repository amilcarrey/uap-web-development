import SearchBox from "@/components/SearchBox";
import "./globals.css";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-purple-800 text-center">
        📚 Reseñas de Libros
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
        Descubre nuevos libros, explora reseñas de la comunidad y comparte tu opinión.
      </p>
      <SearchBox />
    </main>
  );
}

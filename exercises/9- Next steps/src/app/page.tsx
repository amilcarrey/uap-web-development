import SearchBar from "../components/SearchBar";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Descubre y reseña tus libros favoritos
      </h1>
      <SearchBar />
    </div>
  );
}

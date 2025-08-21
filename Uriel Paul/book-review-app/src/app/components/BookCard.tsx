import Link from "next/link";
import { GoogleBook } from "../lib/googleBooks";

export default function BookCard({ book }: { book: GoogleBook }) {
  const { title, authors, imageLinks } = book.volumeInfo;
  return (
    <Link href={`/book/${book.id}`} className="border p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={imageLinks?.thumbnail || "/no-cover.png"}
        alt={title}
        className="h-60 w-full object-cover mb-3"
      />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{authors?.join(", ")}</p>
    </Link>
  );
}

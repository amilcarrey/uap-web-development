import { describe, it, expect, vi } from "vitest";
import { getBooks } from "../app/search/page"; // ajusta la ruta si hace falta
import { Book } from "../types/book";

// Mock global fetch
const mockBooksResponse = {
  items: [
    {
      id: "1",
      volumeInfo: {
        title: "Harry Potter",
        authors: ["J.K. Rowling"],
        description: "Libro de magia",
        publishedDate: "1997",
        pageCount: 500,
        categories: ["Fantasía"],
        imageLinks: { thumbnail: "url.jpg" }
      }
    }
  ]
};

describe("getBooks", () => {
  it("devuelve un array de libros con los campos correctos", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockBooksResponse) })
    ) as any;

    const books: Book[] = await getBooks("harry potter");

    expect(books.length).toBe(1);
    expect(books[0].id).toBe("1");
    expect(books[0].title).toBe("Harry Potter");
    expect(books[0].authors).toEqual(["J.K. Rowling"]);
    expect(books[0].description).toBe("Libro de magia");
    expect(books[0].pageCount).toBe(500);
    expect(books[0].categories).toEqual(["Fantasía"]);
    expect(books[0].thumbnail).toBe("url.jpg");
  });
});

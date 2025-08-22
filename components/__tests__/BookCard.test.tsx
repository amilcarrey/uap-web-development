import { render, screen } from "@testing-library/react";
import BookCard from "../BookCard";
import { describe, it, expect } from "vitest";

// Creamos un "Book" que cumple con lo que espera tu interfaz
const mockBook = {
  id: "123",
  title: "Harry Potter",
  authors: ["J.K. Rowling"],
  description: "Un libro mágico",
  publishedDate: "2000",
  pageCount: 300,
  categories: ["Fantasía"],
  image: "https://example.com/cover.jpg",
};

describe("BookCard", () => {
  it("muestra título, autor e imagen", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("Harry Potter")).toBeInTheDocument();
    expect(screen.getByText("J.K. Rowling")).toBeInTheDocument();
    expect(screen.getByAltText("Harry Potter")).toHaveAttribute(
      "src",
      mockBook.image
    );
  });

  it("tiene link a la página de detalles", () => {
    render(<BookCard book={mockBook} />);
    const link = screen.getByRole("link", { name: /ver detalles/i });
    expect(link).toHaveAttribute("href", "/books/123");
  });
});

// lib/__tests__/BookPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import BookPage from "../../pages/books/[id].tsx";
import { Book } from "../../types";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock del router de Next.js para que no rompa con router.back()
vi.mock("next/router", () => ({
  useRouter: () => ({
    back: vi.fn(),
  }),
}));


// Datos de prueba del libro
const mockBook: Book = {
  id: "123",
  title: "Libro de prueba",
  authors: ["Autor 1"],
  description: "Descripción del libro",
  image: "/no-image.png",
  publishedDate: "2025",
  pageCount: 200,
  categories: ["Test"],
};

describe("BookPage reseñas", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  it("permite agregar una reseña y se muestra en la lista", () => {
    render(<BookPage book={mockBook} />);

    // Completar formulario
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Muy buen libro" },
    });
    fireEvent.click(screen.getByText("Enviar Reseña"));

    // Verificar que aparezca en la lista
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Muy buen libro")).toBeInTheDocument();
  });

  it("permite dar like a una reseña", () => {
    render(<BookPage book={mockBook} />);

    // Agregar reseña
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Excelente!" },
    });
    fireEvent.click(screen.getByText("Enviar Reseña"));

    // Dar like
    fireEvent.click(screen.getByText("👍 0"));

    // Se incrementa el contador
    expect(screen.getByText("👍 1")).toBeInTheDocument();
  });

  it("cambia de like a dislike correctamente", () => {
    render(<BookPage book={mockBook} />);

    // Agregar reseña
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), {
      target: { value: "Pedro" },
    });
    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Está bien" },
    });
    fireEvent.click(screen.getByText("Enviar Reseña"));

    // Like
    fireEvent.click(screen.getByText("👍 0"));
    expect(screen.getByText("👍 1")).toBeInTheDocument();

    // Cambiar a Dislike
    fireEvent.click(screen.getByText("👎 0"));
    expect(screen.getByText("👍 0")).toBeInTheDocument();
    expect(screen.getByText("👎 1")).toBeInTheDocument();
  });
});

// tests/components/BookPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookPage from "@/app/book/[id]/page";
import { vi } from "vitest";

// Mock useParams de next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "123" }),
  notFound: () => <p>Not Found</p>,
}));

describe("BookPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("muestra 'Cargando...' inicialmente", () => {
    render(<BookPage />);
    expect(screen.getByText(/Cargando/)).toBeInTheDocument();
  });

  it("muestra info del libro después de cargar", async () => {
    // Mock fetch para libro y reseñas
    global.fetch = vi.fn()
      // primer fetch → libro
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          volumeInfo: {
            title: "Libro Test",
            authors: ["Autor Uno"],
            imageLinks: { thumbnail: "test.jpg" },
            publishedDate: "2020",
            publisher: "Editorial X",
            pageCount: 123,
            categories: ["Ficción"],
            description: "Una descripción",
          },
        }),
      })
      // segundo fetch → reseñas
      .mockResolvedValueOnce({
        json: async () => ([]),
      });

    render(<BookPage />);

    expect(await screen.findByText("Libro Test")).toBeInTheDocument();
    expect(screen.getByText("Autor Uno")).toBeInTheDocument();
    expect(screen.getByText(/Descripción/)).toBeInTheDocument();
  });

  it("permite agregar una reseña", async () => {
    global.fetch = vi
      .fn()
      // libro
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ volumeInfo: { title: "Libro Test" } }),
      })
      // reseñas iniciales
      .mockResolvedValueOnce({
        json: async () => ([]),
      })
      // post nueva reseña
      .mockResolvedValueOnce({
        json: async () => ({
          id: 1,
          bookId: "123",
          user: "Anónimo",
          rating: 5,
          comment: "Excelente libro",
          votes: 0,
        }),
      });

    render(<BookPage />);

    // Esperar a que cargue el libro
    await screen.findByText("Libro Test");

    // Clickear en ★ (5 estrellas)
    fireEvent.click(screen.getAllByText("★")[4]);

    // Escribir comentario
    fireEvent.change(screen.getByPlaceholderText(/opinión/), {
      target: { value: "Excelente libro" },
    });

    // Enviar formulario
    fireEvent.click(screen.getByText("Publicar"));

    expect(await screen.findByText("Excelente libro")).toBeInTheDocument();
  });
});

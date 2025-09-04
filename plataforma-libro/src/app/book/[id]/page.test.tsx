import { render, screen } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import BookPage from "./page";

// mock de next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

// mock de ReseñaComponente
vi.mock("../../componentes/reseña", () => ({
  __esModule: true,
  default: ({ libroId }: { libroId: string }) => (
    <div data-testid="resenas">Reseñas de {libroId}</div>
  ),
}));

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la información del libro cuando fetch devuelve datos válidos", async () => {
    // mock de fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        volumeInfo: {
          title: "El Quijote",
          authors: ["Cervantes"],
          description: "Un libro clásico",
          publishedDate: "1605",
          pageCount: 863,
          categories: ["Novela"],
          imageLinks: {
            thumbnail: "http://prueba.com/thumb.jpg",
          },
        },
      }),
    }) as any;

    // render del componente
    render(await BookPage({ params: { id: "123" } }));

    expect(await screen.findByText("El Quijote")).toBeInTheDocument();
    expect(screen.getByText("Cervantes")).toBeInTheDocument();
    expect(screen.getByText(/Un libro clásico/)).toBeInTheDocument();
    expect(screen.getByText(/1605/)).toBeInTheDocument();
    expect(screen.getByText(/863/)).toBeInTheDocument();
    expect(screen.getByText(/Novela/)).toBeInTheDocument();

    // debe renderizar reseñas
    expect(screen.getByTestId("resenas")).toHaveTextContent("Reseñas de 123");
  });

  it("llama a notFound si fetch falla", async () => {
    const { notFound } = await import("next/navigation");

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    await BookPage({ params: { id: "fail" } });

    expect(notFound).toHaveBeenCalled();
  });
});

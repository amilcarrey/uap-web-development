import { describe, vi, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "./page";
import { fetchBooks } from "../../actions/server-actions";

vi.mock("../../actions/server-actions", () => ({
  fetchBooks: vi.fn(),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título con la query", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([
      { id: "1", titulo: "Libro Test", autor: ["Autor X"], imagen: "" },
    ]);

    const ui = await SearchPage({ searchParams: { q: "test" } });
    render(ui);

    expect(await screen.findByText(/Resultados para: test/i)).toBeInTheDocument();
  });

  it("muestra libros cuando fetchBooks devuelve resultados", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([
      { id: "1", titulo: "Libro Test", autor: ["Autor X"], imagen: "" },
      { id: "2", titulo: "Otro Libro", autor: ["Autor Y"], imagen: "" },
    ]);

    const ui = await SearchPage({ searchParams: { q: "harry" } });
    render(ui);

    expect(await screen.findByText(/Libro Test/i)).toBeInTheDocument();
    expect(await screen.findByText(/Otro Libro/i)).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay resultados", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([]);

    const ui = await SearchPage({ searchParams: { q: "nada" } });
    render(ui);

    expect(await screen.findByText(/No se encontraron libros/i)).toBeInTheDocument();
  });

  it("maneja caso sin query", async () => {
    (fetchBooks as vi.Mock).mockResolvedValue([]);

    const ui = await SearchPage({});
    render(ui);

    expect(await screen.findByText(/Resultados para:/i)).toBeInTheDocument();
  });
});

import { describe, it, expect,vi, beforeEach } from "vitest";
import axios from "axios";
import { fetchBooks} from "./server-actions";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchBooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {}); // mock para evitar logs en tests
    });

  it("debería devolver libros desde la API", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          { id: "1", volumeInfo: { title: "Libro Test", authors: ["Autor X"] } },
        ],
      },
    });

    const books = await fetchBooks("test");
    expect(books.length).toBe(1);
    expect(books[0].titulo).toBe("Libro Test");
});


    it('deberia manejar errores de la API correctamente', async () => {
        (axios.get as any).mockRejectedValue
        (new Error("API Error"));

        const books = await fetchBooks("test");
        expect(books).toEqual([]); 
    });

     it("deberia devolver array vacio si no hay query", async () => {
    const books = await fetchBooks("");
    expect(books).toEqual([]);
    });

});


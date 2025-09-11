import { describe, it, expect, beforeEach } from "vitest";
import db from "../utils/db";
import { GET, POST, PATCH } from "../app/api/reviews/route";

// Helper para simular NextRequest
function createRequest(body?: any, query?: Record<string, string>) {
  const url = "http://localhost" + (query ? "?" + new URLSearchParams(query).toString() : "");
  return {
    url,
    json: async () => body,
  } as any;
}

describe("API /api/reviews", () => {
  // Limpiar DB antes de cada test
  beforeEach(() => {
    db.prepare("DELETE FROM reviews").run();
  });

  it("POST crea una reseña nueva", async () => {
    const req = createRequest({
      bookId: "book1",
      author: "Kiara",
      rating: 5,
      comment: "Excelente!"
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.id).toBeDefined();
    expect(data.bookId).toBe("book1");
    expect(data.author).toBe("Kiara");
    expect(data.rating).toBe(5);
    expect(data.comment).toBe("Excelente!");
    expect(data.votesUp).toBe(0);
    expect(data.votesDown).toBe(0);
  });

  it("GET lista reseñas por bookId", async () => {
    // Insertar reseña de prueba
    db.prepare(`
      INSERT INTO reviews (bookId, author, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run("book1", "Kiara", 5, "Excelente!", new Date().toISOString());

    const req = createRequest(undefined, { bookId: "book1" });
    const res = await GET(req);
    const data = await res.json();

    expect(data.length).toBe(1);
    expect(data[0].author).toBe("Kiara");
  });

  it("PATCH aumenta votos correctamente", async () => {
    // Insertar reseña de prueba
    const info = db.prepare(`
      INSERT INTO reviews (bookId, author, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run("book1", "Kiara", 5, "Excelente!", new Date().toISOString());

    const req = createRequest({ reviewId: info.lastInsertRowid.toString(), voteType: "up" });
    const res = await PATCH(req);
    const data = await res.json();

    expect(data.votesUp).toBe(1);
    expect(data.votesDown).toBe(0);
  });
});

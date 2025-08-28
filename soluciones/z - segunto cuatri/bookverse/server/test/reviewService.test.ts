import { describe, it, expect } from "vitest";
import { InMemoryReviewRepo } from "../src/infra/reviewRepo.js";
import { ReviewService } from "../src/domain/reviewService.js";

describe("ReviewService", () => {
  it("valida y crea reseña", async () => {
    // Preparamos el servicio con un repo en memoria
    const svc = new ReviewService(new InMemoryReviewRepo());

    // Creamos una reseña válida
    const r = await svc.create(
      {
        bookId: "book123",
        rating: 5,
        text: "Excelente libro",
        displayName: "Tania", // >= 2 caracteres
      },
      "user1"
    );

    // Verificamos que se haya creado y tenga score 0 por defecto
    expect(r.bookId).toBe("book123");
    expect(r.score).toBe(0);
  });

  it("rechaza rating inválido", async () => {
    // Servicio con repo en memoria
    const svc = new ReviewService(new InMemoryReviewRepo());

    // Intentamos crear con rating fuera de rango (6)
    // Usamos el estilo recomendado para promesas: expect(promise).rejects...
    await expect(
      svc.create(
        { bookId: "b", rating: 6, text: "x", displayName: "Ana" }, // displayName válido
        "u"
      )
    ).rejects.toBeTruthy(); // también podrías usar .rejects.toThrow()
  });

  it("votos suman y cambian", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());

    // Creamos una reseña válida
    const r = await svc.create(
      { bookId: "b", rating: 4, text: "bueno", displayName: "Ana" }, // <-- antes estaba "A"
      "author"
    );

    // Usuario u1 vota 👍 => +1
    const v1 = await svc.vote(r.id, "u1", 1);
    expect(v1.score).toBe(1);

    // El mismo usuario cambia su voto a 👎 => reemplaza +1 por -1
    const v2 = await svc.vote(r.id, "u1", -1);
    expect(v2.score).toBe(-1);

    // Otro usuario u2 vota 👍 => suma -1 + 1 = 0
    const v3 = await svc.vote(r.id, "u2", 1);
    expect(v3.score).toBe(0);
  });
});

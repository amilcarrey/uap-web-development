import { describe, it, expect } from "vitest";
import { InMemoryReviewRepo } from "../src/infra/reviewRepo.js";
import { ReviewService } from "../src/domain/reviewService.js";

describe("Vote rules", () => {
  it("el mismo usuario no puede acumular múltiples 👍 (idempotencia)", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    const r = await svc.create(
      { bookId: "B1", rating: 5, text: "muy bueno", displayName: "Tania" },
      "author"
    );

    const a1 = await svc.vote(r.id, "u1", 1); // +1
    expect(a1.score).toBe(1);

    const a2 = await svc.vote(r.id, "u1", 1); // repite +1 -> se mantiene
    expect(a2.score).toBe(1);
  });

  it("cambiar de 👍 a 👎 reemplaza el voto del usuario", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    const r = await svc.create(
      { bookId: "B2", rating: 3, text: "okay", displayName: "Ana" },
      "author"
    );

    await svc.vote(r.id, "u1", 1);     // +1
    const b = await svc.vote(r.id, "u1", -1); // reemplaza por -1
    expect(b.score).toBe(-1);
  });

  it("votos de usuarios distintos se suman", async () => {
    const svc = new ReviewService(new InMemoryReviewRepo());
    const r = await svc.create(
      { bookId: "B3", rating: 4, text: "lindo", displayName: "Leo" },
      "author"
    );

    await svc.vote(r.id, "u1", 1);  // +1
    const c = await svc.vote(r.id, "u2", 1);  // +1
    expect(c.score).toBe(2);
  });
});

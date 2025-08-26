import { describe, it, expect, beforeEach, vi } from "vitest";
import { getReviews, addReview, voteReview } from "@/app/book/[id]/actions";

// Mock de next/cache
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn()
}));

// Mock de crypto para generar IDs predecibles en tests
vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "mock-uuid-123")
}));

describe("Review actions", () => {
  beforeEach(() => {
    // Limpiar el estado global antes de cada test
    const g = globalThis as any;
    g.__reviews = {};
  });

  describe("getReviews", () => {
    it("should return empty array for volume with no reviews", async () => {
      const reviews = await getReviews("volume-1");
      expect(reviews).toEqual([]);
    });

    it("should return existing reviews for volume", async () => {
      // Configurar estado inicial
      const g = globalThis as any;
      g.__reviews = {
        "volume-1": [
          { id: "1", volumeId: "volume-1", rating: 5, text: "Great book", votes: 0 }
        ]
      };

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(1);
      expect(reviews[0].text).toBe("Great book");
    });
  });

  describe("addReview", () => {
    it("should add review successfully", async () => {
      await addReview("volume-1", 4, "Good book");

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(1);
      expect(reviews[0]).toEqual({
        id: "mock-uuid-123",
        volumeId: "volume-1",
        rating: 4,
        text: "Good book",
        votes: 0
      });
    });

    it("should throw error for invalid rating", async () => {
      await expect(addReview("volume-1", 0, "Bad rating")).rejects.toThrow("rating inválido");
      await expect(addReview("volume-1", 6, "Bad rating")).rejects.toThrow("rating inválido");
    });
  });

  describe("voteReview", () => {
    beforeEach(async () => {
      // Agregar una reseña para probar votaciones
      await addReview("volume-1", 4, "Test review");
    });

    it("should upvote review", async () => {
      await voteReview("volume-1", "mock-uuid-123", 1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(1);
    });

    it("should downvote review", async () => {
      await voteReview("volume-1", "mock-uuid-123", -1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(-1);
    });
  });
});
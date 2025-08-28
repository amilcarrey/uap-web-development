import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock de next/cache (definir antes de importar acciones)
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

// Mock opcional de crypto para UUIDs predecibles (no dependemos de esto en las aserciones)
vi.mock("crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("crypto")>();
  return {
    ...actual,
    randomUUID: vi.fn(() => "mock-uuid-123"),
  };
});

// Importar DESPUÉS de definir los mocks
import { revalidateTag } from "next/cache";
import { getReviews, addReview, voteReview } from "@/app/book/[id]/actions";

// Alias tipado del mock para assertions
const mockRevalidateTag = vi.mocked(revalidateTag);

describe("Review actions", () => {
  beforeEach(() => {
    // Limpiar el estado global antes de cada test
    const g = globalThis as any;
    g.__reviews = {};
    vi.clearAllMocks();
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
          { id: "1", volumeId: "volume-1", rating: 5, text: "Great book", votes: 0 },
        ],
      };

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(1);
      expect(reviews[0].text).toBe("Great book");
    });

    // ✅ AGREGAR: Test para múltiples volúmenes
    it("should return reviews only for specific volume", async () => {
      const g = globalThis as any;
      g.__reviews = {
        "volume-1": [
          { id: "1", volumeId: "volume-1", rating: 5, text: "Book 1 review", votes: 0 },
        ],
        "volume-2": [
          { id: "2", volumeId: "volume-2", rating: 3, text: "Book 2 review", votes: 0 },
        ],
      };

      const reviews1 = await getReviews("volume-1");
      const reviews2 = await getReviews("volume-2");

      expect(reviews1).toHaveLength(1);
      expect(reviews2).toHaveLength(1);
      expect(reviews1[0].text).toBe("Book 1 review");
      expect(reviews2[0].text).toBe("Book 2 review");
    });

    // ✅ AGREGAR: Test con volumeId inexistente
    it("should handle non-existent volume gracefully", async () => {
      const reviews = await getReviews("non-existent-volume");
      expect(reviews).toEqual([]);
    });
  });

  describe("addReview", () => {
    it("should add review successfully", async () => {
      await addReview("volume-1", 4, "Good book");

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(1);

      // No dependemos de un UUID exacto
      expect(typeof reviews[0].id).toBe("string");
      expect(reviews[0].id).not.toHaveLength(0);
      // opcional: regex básica de uuid v4
      expect(reviews[0].id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );

      expect(reviews[0]).toMatchObject({
        volumeId: "volume-1",
        rating: 4,
        text: "Good book",
        votes: 0,
      });
    });

    // ✅ MEJORAR: Test de validación más completo
    it("should throw error for invalid rating", async () => {
      await expect(addReview("volume-1", 0, "Bad rating")).rejects.toThrow("rating inválido");
      await expect(addReview("volume-1", 6, "Bad rating")).rejects.toThrow("rating inválido");
      await expect(addReview("volume-1", -1, "Bad rating")).rejects.toThrow("rating inválido");
      await expect(addReview("volume-1", 10, "Bad rating")).rejects.toThrow("rating inválido");
    });

    // ✅ AGREGAR: Test con ratings límite válidos
    it("should accept valid rating boundaries", async () => {
      await addReview("volume-1", 1, "Minimum rating");
      await addReview("volume-1", 5, "Maximum rating");

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(2);
      expect(reviews[0].rating).toBe(1);
      expect(reviews[1].rating).toBe(5);
    });

    // ✅ AGREGAR: Test para múltiples reseñas en el mismo volumen
    it("should add multiple reviews to same volume", async () => {
      await addReview("volume-1", 5, "First review");
      await addReview("volume-1", 3, "Second review");
      await addReview("volume-1", 4, "Third review");

      const reviews = await getReviews("volume-1");
      expect(reviews).toHaveLength(3);
      expect(reviews[0].text).toBe("First review");
      expect(reviews[1].text).toBe("Second review");
      expect(reviews[2].text).toBe("Third review");
    });

    // ✅ AGREGAR: Test de revalidateTag
    it("should call revalidateTag after adding review", async () => {
      await addReview("volume-1", 4, "Test review");

      expect(mockRevalidateTag).toHaveBeenCalledWith("reviews:volume-1");
      expect(mockRevalidateTag).toHaveBeenCalledTimes(1);
    });

    // ✅ AGREGAR: Test con texto vacío
    it("should handle empty text", async () => {
      await addReview("volume-1", 4, "");

      const reviews = await getReviews("volume-1");
      expect(reviews[0].text).toBe("");
    });

    // ✅ AGREGAR: Test con texto muy largo
    it("should handle very long text", async () => {
      const longText = "A".repeat(1000);
      await addReview("volume-1", 4, longText);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].text).toBe(longText);
    });
  });

  describe("voteReview", () => {
    let reviewId: string;

    beforeEach(async () => {
      // Agregar una reseña para probar votaciones
      await addReview("volume-1", 4, "Test review");
      const reviews = await getReviews("volume-1");
      reviewId = reviews[0].id; // usar el id real añadido
    });

    it("should upvote review", async () => {
      await voteReview("volume-1", reviewId, 1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(1);
    });

    it("should downvote review", async () => {
      await voteReview("volume-1", reviewId, -1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(-1);
    });

    // ✅ AGREGAR: Test de múltiples votos
    it("should handle multiple votes on same review", async () => {
      await voteReview("volume-1", reviewId, 1);
      await voteReview("volume-1", reviewId, 1);
      await voteReview("volume-1", reviewId, -1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(1); // 0 + 1 + 1 - 1 = 1
    });

    // ✅ AGREGAR: Test con review inexistente
    it("should handle non-existent review gracefully", async () => {
      const reviewsBefore = await getReviews("volume-1");

      await voteReview("volume-1", "non-existent-id", 1);

      const reviewsAfter = await getReviews("volume-1");
      expect(reviewsAfter).toEqual(reviewsBefore);
      expect(reviewsAfter[0].votes).toBe(0); // Sin cambios
    });

    // ✅ AGREGAR: Test con volumen inexistente
    it("should handle non-existent volume gracefully", async () => {
      await expect(voteReview("non-existent-volume", "any-id", 1)).resolves.not.toThrow();
    });

    // ✅ AGREGAR: Test de votos negativos extremos
    it("should handle negative votes correctly", async () => {
      await voteReview("volume-1", reviewId, -1);
      await voteReview("volume-1", reviewId, -1);
      await voteReview("volume-1", reviewId, -1);

      const reviews = await getReviews("volume-1");
      expect(reviews[0].votes).toBe(-3);
    });

    // ✅ AGREGAR: Test de revalidateTag
    it("should call revalidateTag after voting", async () => {
      await voteReview("volume-1", reviewId, 1);
      expect(mockRevalidateTag).toHaveBeenCalledWith("reviews:volume-1");
    });

    // ✅ AGREGAR: Test con múltiples reseñas
    it("should vote on correct review when multiple exist", async () => {
      await addReview("volume-1", 3, "Second review");
      const reviewsNow = await getReviews("volume-1");
      const firstId = reviewsNow[0].id;
      const secondId = reviewsNow[1].id;

      await voteReview("volume-1", firstId, 1);

      const reviews = await getReviews("volume-1");
      const first = reviews.find((r) => r.id === firstId)!;
      const second = reviews.find((r) => r.id === secondId)!;

      expect(first.votes).toBe(1);
      expect(second.votes).toBe(0);
    });

    // ✅ AGREGAR: Test de inmutabilidad
    it("should not modify original review object", async () => {
      const reviewsBefore = await getReviews("volume-1");
      const originalReview = reviewsBefore[0];
      const originalVotes = originalReview.votes;

      await voteReview("volume-1", reviewId, 1);

      // El objeto original no debe cambiar
      expect(originalReview.votes).toBe(originalVotes);

      // Pero el estado sí debe cambiar
      const updatedReviews = await getReviews("volume-1");
      expect(updatedReviews[0].votes).toBe(originalVotes + 1);
    });
  });

  // Tests de integración
  describe("Integration tests", () => {
    it("should maintain data consistency across operations", async () => {
      // Agregar múltiples reseñas
      await addReview("volume-1", 5, "Excellent!");
      await addReview("volume-1", 2, "Poor...");
      await addReview("volume-2", 4, "Good book");

      // Votar en diferentes reseñas (usando ids reales)
      const v1 = await getReviews("volume-1");
      await voteReview("volume-1", v1[0].id, 1);
      await voteReview("volume-1", v1[1].id, -1);

      // Verificar estado final
      const finalReviews1 = await getReviews("volume-1");
      const finalReviews2 = await getReviews("volume-2");

      expect(finalReviews1).toHaveLength(2);
      expect(finalReviews2).toHaveLength(1);
      expect(finalReviews1[0].votes).toBe(1);
      expect(finalReviews1[1].votes).toBe(-1);
      expect(finalReviews2[0].votes).toBe(0);
    });
  });
});

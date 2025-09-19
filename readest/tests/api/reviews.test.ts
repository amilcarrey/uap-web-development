// tests/api/reviews.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/search/reviews/route";
import { prisma } from "@/app/lib/prisma";

// Mock Prisma
vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    review: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("Reviews API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- GET ---
  it("GET should return 400 if bookId is missing", async () => {
    const req = new Request("http://localhost/api/search/reviews");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing bookId");
  });

  it("GET should return empty array if no reviews found", async () => {
    (prisma.review.findMany as any).mockResolvedValueOnce([]);

    const req = new Request("http://localhost/api/search/reviews?bookId=1");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([]);
  });

  it("GET should return reviews if found", async () => {
    const mockReviews = [
      { id: 1, bookId: 1, reviewer: "Eze", rating: 5, content: "Excelente" },
    ];
    (prisma.review.findMany as any).mockResolvedValueOnce(mockReviews);

    const req = new Request("http://localhost/api/search/reviews?bookId=1");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockReviews);
  });

  // --- POST ---
  it("POST should return 400 if fields are missing", async () => {
    const req = new Request("http://localhost/api/search/reviews", {
      method: "POST",
      body: JSON.stringify({ reviewer: "Eze" }), // faltan campos
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing fields");
  });

  it("POST should create a review", async () => {
    const mockReview = {
      id: 1,
      bookId: 1,
      reviewer: "Eze",
      rating: 5,
      content: "Genial libro",
    };

    (prisma.review.create as any).mockResolvedValueOnce(mockReview);

    const req = new Request("http://localhost/api/search/reviews", {
      method: "POST",
      body: JSON.stringify({
        bookId: 1,
        reviewer: "Eze",
        rating: 5,
        content: "Genial libro",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockReview);
  });

  it("POST should handle DB error", async () => {
    (prisma.review.create as any).mockRejectedValueOnce(new Error("DB fail"));

    const req = new Request("http://localhost/api/search/reviews", {
      method: "POST",
      body: JSON.stringify({
        bookId: 1,
        reviewer: "Eze",
        rating: 5,
        content: "Algo",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to create review");
  });
});

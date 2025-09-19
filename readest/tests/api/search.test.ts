// File: tests/api/search.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/search/route";

describe("Search API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 if query is missing", async () => {
    const req = new Request("http://localhost/api/search");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing query");
  });

  it("should fetch books from Google API", async () => {
    const mockData = { items: [{ id: "1", volumeInfo: { title: "Test Book" } }] };

    // Mock fetch global
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    }));

    const req = new Request("http://localhost/api/search?q=harry");
    const res = await GET(req);
    const json = await res.json();

    expect(fetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/books/v1/volumes?q=harry"
    );
    expect(res.status).toBe(200);
    expect(json).toEqual(mockData);
  });

  it("should fail if fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("API down")));

    const req = new Request("http://localhost/api/search?q=error");

    await expect(GET(req)).rejects.toThrow("API down");
  });
});

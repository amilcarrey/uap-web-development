import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as gb from "../../src/services/googleBooksService";

const origFetch = globalThis.fetch;

describe("googleBooksService", () => {
  beforeEach(() => {
    (globalThis as any).fetch = vi.fn();
  });
  afterEach(() => {
    (globalThis as any).fetch = origFetch;
    vi.resetAllMocks();
  });

  it("searchBooks returns items when API ok", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ id: "1", volumeInfo: { title: "A" } }] })
    });

    const res = await gb.searchBooks("A");
    expect(res.length).toBe(1);
    expect(res[0].id).toBe("1");
  });

  it("searchBooks throws on non-ok", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    });
    await expect(gb.searchBooks("x")).rejects.toThrow();
  });

  it("getBookById returns item", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "abc", volumeInfo: { title: "B" } })
    });
    const item = await gb.getBookById("abc");
    expect(item?.id).toBe("abc");
  });
});

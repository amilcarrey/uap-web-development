import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReviewList from "../components/ReviewList";

const mockReviews = [
  {
    id: "1",
    bookId: "book1",
    author: "Kiara",
    rating: 5,
    comment: "Me encantó!",
    votesUp: 2,
    votesDown: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    bookId: "book1",
    author: "Ana",
    rating: 3,
    comment: "Está bien",
    votesUp: 1,
    votesDown: 1,
    createdAt: new Date().toISOString()
  }
];

// Mock de fetch que distingue GET y PATCH
const fetchMock = vi.fn((url, options) => {
  if (!options || options.method === "GET") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockReviews)
    });
  } else if (options.method === "PATCH") {
    const body = JSON.parse(options.body as string);
    const review = mockReviews.find(r => r.id === body.reviewId);
    if (review) {
      if (body.voteType === "up") review.votesUp++;
      if (body.voteType === "down") review.votesDown++;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(review) });
    }
  }
  return Promise.resolve({ ok: false });
});

beforeEach(() => {
  global.fetch = fetchMock as any;
  fetchMock.mockClear();
});

describe("ReviewList", () => {
  it("renderiza las reseñas correctamente", async () => {
    render(<ReviewList bookId="book1" />);

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Kiara"))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("Ana"))).toBeInTheDocument();
      expect(screen.getByText("Me encantó!")).toBeInTheDocument();
      expect(screen.getByText("Está bien")).toBeInTheDocument();
    });
  });

  it("envía votos correctamente", async () => {
    render(<ReviewList bookId="book1" />);

    await waitFor(() => {
      const upvoteButtons = screen.getAllByRole("button").filter(btn =>
        btn.textContent?.includes("👍")
      );

      fireEvent.click(upvoteButtons[0]);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/reviews",
        expect.objectContaining({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId: "1", voteType: "up" })
        })
      );
    });
  });
});

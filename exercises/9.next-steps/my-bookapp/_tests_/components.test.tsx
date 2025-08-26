import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Mock de next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(""),
  }),
}));

// Mock de las acciones del servidor
vi.mock("@/app/book/[id]/actions", () => ({
  addReview: vi.fn(),
  voteReview: vi.fn()
}));

describe("Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SearchForm Component (inline test)", () => {
    // Componente de prueba inline para demostrar funcionalidad de búsqueda
    const SearchForm = () => {
      const [query, setQuery] = React.useState("");
      const router = { push: mockPush };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Buscar por título, autor o ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      );
    };

    it("should render search input and button", () => {
      render(<SearchForm />);
      
      const input = screen.getByPlaceholderText("Buscar por título, autor o ISBN...");
      const button = screen.getByRole("button", { name: /buscar/i });
      
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it("should navigate to search page on form submit", async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const input = screen.getByPlaceholderText("Buscar por título, autor o ISBN...");
      const button = screen.getByRole("button", { name: /buscar/i });
      
      await user.type(input, "harry potter");
      await user.click(button);
      
      expect(mockPush).toHaveBeenCalledWith("/search?q=harry%20potter");
    });

    it("should not submit empty search", async () => {
      const user = userEvent.setup();
      render(<SearchForm />);
      
      const button = screen.getByRole("button", { name: /buscar/i });
      await user.click(button);
      
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("ReviewForm Component (inline test)", () => {
    // Componente de prueba inline para demostrar funcionalidad de reseñas
    const ReviewForm = ({ volumeId }: { volumeId: string }) => {
      const [rating, setRating] = React.useState(5);
      const [text, setText] = React.useState("");
      const router = { refresh: mockRefresh };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const { addReview } = await import("@/app/book/[id]/actions");
          await addReview(volumeId, rating, text);
          setText("");
          router.refresh();
        } catch (error) {
          console.error("Error submitting review:", error);
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <label htmlFor="rating">Rating</label>
          <select 
            id="rating"
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          
          <textarea
            placeholder="Escribí tu reseña…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button type="submit">Publicar reseña</button>
        </form>
      );
    };

    it("should render form elements", () => {
      render(<ReviewForm volumeId="test-volume" />);
      
      expect(screen.getByLabelText("Rating")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Escribí tu reseña…")).toBeInTheDocument();
      expect(screen.getByText("Publicar reseña")).toBeInTheDocument();
    });

    it("should have default rating of 5", () => {
      render(<ReviewForm volumeId="test-volume" />);
      
      const select = screen.getByLabelText("Rating") as HTMLSelectElement;
      expect(select.value).toBe("5");
    });

    it("should submit form with correct data", async () => {
      const { addReview } = await import("@/app/book/[id]/actions");
      const mockAddReview = vi.mocked(addReview);
      
      const user = userEvent.setup();
      render(<ReviewForm volumeId="test-volume" />);
      
      const textarea = screen.getByPlaceholderText("Escribí tu reseña…");
      const select = screen.getByLabelText("Rating");
      const button = screen.getByText("Publicar reseña");
      
      await user.selectOptions(select, "4");
      await user.type(textarea, "Great book!");
      await user.click(button);
      
      await waitFor(() => {
        expect(mockAddReview).toHaveBeenCalledWith("test-volume", 4, "Great book!");
      });
    });
  });

  describe("ReviewCard Component (inline test)", () => {
    // Componente de prueba inline para demostrar funcionalidad de votación
    const ReviewCard = ({ review }: { 
      review: {
        id: string;
        volumeId: string;
        rating: number;
        text: string;
        votes: number;
      }
    }) => {
      // ✅ CORRECCIÓN: Cambiar el tipo del parámetro
      const handleVote = async (vote: 1 | -1) => {
        try {
          const { voteReview } = await import("@/app/book/[id]/actions");
          await voteReview(review.volumeId, review.id, vote);
        } catch (error) {
          console.error("Error voting:", error);
        }
      };

      return (
        <div>
          <div>
            {/* Estrellas */}
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < review.rating ? "★" : "☆"}</span>
            ))}
          </div>
          
          <p>{review.text}</p>
          
          <div>
            <button 
              aria-label="Votar positivo"
              onClick={() => handleVote(1)} // ✅ Ahora es literal type 1
            >
              👍
            </button>
            
            <span>{review.votes}</span>
            
            <button 
              aria-label="Votar negativo"
              onClick={() => handleVote(-1)} // ✅ Ahora es literal type -1
            >
              👎
            </button>
          </div>
        </div>
      );
    };

    const mockReview = {
      id: "review-1",
      volumeId: "volume-1",
      rating: 4,
      text: "Great book with interesting plot!",
      votes: 5
    };

    it("should render review information", () => {
      render(<ReviewCard review={mockReview} />);
      
      expect(screen.getByText("Great book with interesting plot!")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument(); // votes
    });

    it("should display correct number of stars", () => {
      render(<ReviewCard review={mockReview} />);
      
      const stars = screen.getAllByText("★");
      const emptyStars = screen.getAllByText("☆");
      
      expect(stars).toHaveLength(4); // 4 estrellas llenas
      expect(emptyStars).toHaveLength(1); // 1 estrella vacía
    });

    it("should handle upvote", async () => {
      const { voteReview } = await import("@/app/book/[id]/actions");
      const mockVoteReview = vi.mocked(voteReview);
      
      const user = userEvent.setup();
      render(<ReviewCard review={mockReview} />);
      
      const upvoteButton = screen.getByLabelText("Votar positivo");
      await user.click(upvoteButton);
      
      expect(mockVoteReview).toHaveBeenCalledWith("volume-1", "review-1", 1);
    });

    it("should handle downvote", async () => {
      const { voteReview } = await import("@/app/book/[id]/actions");
      const mockVoteReview = vi.mocked(voteReview);
      
      const user = userEvent.setup();
      render(<ReviewCard review={mockReview} />);
      
      const downvoteButton = screen.getByLabelText("Votar negativo");
      await user.click(downvoteButton);
      
      expect(mockVoteReview).toHaveBeenCalledWith("volume-1", "review-1", -1);
    });
  });

  describe("Book Display Components", () => {
    const mockBook = {
      id: "book-1",
      volumeInfo: {
        title: "Test Book",
        authors: ["Test Author"],
        description: "A test book description",
        imageLinks: {
          thumbnail: "https://example.com/thumb.jpg"
        },
        publishedDate: "2023",
        publisher: "Test Publisher",
        pageCount: 200
      }
    };

    it("should render book title and authors", () => {
      const BookCard = ({ book }: { book: typeof mockBook }) => (
        <div>
          <h2>{book.volumeInfo.title}</h2>
          <p>by {book.volumeInfo.authors?.join(", ")}</p>
        </div>
      );

      render(<BookCard book={mockBook} />);
      
      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("by Test Author")).toBeInTheDocument();
    });

    it("should handle books without authors", () => {
      const bookWithoutAuthors = {
        ...mockBook,
        volumeInfo: {
          ...mockBook.volumeInfo,
          authors: undefined as string[] | undefined
        }
      };

      const BookCard = ({ book }: { 
        book: {
          id: string;
          volumeInfo: {
            title: string;
            authors?: string[];
            description: string;
            imageLinks: { thumbnail: string };
            publishedDate: string;
            publisher: string;
            pageCount: number;
          }
        }
      }) => (
        <div>
          <h2>{book.volumeInfo.title}</h2>
          <p>by {book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
        </div>
      );

      render(<BookCard book={bookWithoutAuthors} />);
      
      expect(screen.getByText("by Unknown Author")).toBeInTheDocument();
    });
  });
});
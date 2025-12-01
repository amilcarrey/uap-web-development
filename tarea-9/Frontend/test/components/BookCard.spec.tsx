import { render, screen } from "@testing-library/react";
import BookCard from "../../src/components/BookCard";
import { describe, it, expect } from "vitest";

describe("BookCard", () => {
  it("renders title and authors", () => {
    render(<BookCard id="1" title="Hola" authors={["A. Autor"]} />);
    expect(screen.getByText("Hola")).toBeDefined();
    expect(screen.getByText("A. Autor")).toBeDefined();
  });
});

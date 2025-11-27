import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import TaskList from "../components/TaskList";
import TaskItem from "../components/TaskItem";

describe("TaskList component", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const tasks = [
    { id: "1", text: "Tarea 1", completed: false },
    { id: "2", text: "Tarea 2", completed: true },
  ];

  it("renders all tasks", () => {
    render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText("Tarea 1")).toBeDefined();
    expect(screen.getByText("Tarea 2")).toBeDefined();
  });

  it("calls onToggle for the correct task", () => {
    render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(mockOnToggle).toHaveBeenCalledWith("1");
    fireEvent.click(checkboxes[1]);
    expect(mockOnToggle).toHaveBeenCalledWith("2");
  });

  it("calls onDelete for the correct task", () => {
    render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith("1");
    fireEvent.click(deleteButtons[1]);
    expect(mockOnDelete).toHaveBeenCalledWith("2");
  });

  it("renders empty message when no tasks", () => {
    render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText(/no hay tareas/i)).toBeDefined();
  });
});

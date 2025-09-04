import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import TaskItem from "../components/TaskItem";

describe("TaskItem component", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const task = {
    id: "1",
    text: "Mi tarea",
    completed: false,
  };

  it("renders task text", () => {
    render(<TaskItem task={task} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText("Mi tarea")).toBeDefined();
  });

  it("calls onToggle when checkbox is clicked", () => {
    render(<TaskItem task={task} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(task.id);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<TaskItem task={task} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith(task.id);
  });

  it("renders completed task with line-through", () => {
    const completedTask = { ...task, completed: true };
    render(<TaskItem task={completedTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const textEl = screen.getByText("Mi tarea");
    expect(textEl).toHaveStyle("text-decoration: line-through");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../components/TaskForm";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

describe("TaskForm component", () => {
  const mockOnTaskCreated = vi.fn();

  // Antes de cada test, reseteamos el mock
  beforeEach(() => {
    mockOnTaskCreated.mockClear();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ title: "Mi tarea", description: "Detalles de la tarea" }),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly", () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    expect(screen.getByPlaceholderText("Escribe el título")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Agrega detalles de la tarea")).toBeInTheDocument();
    expect(screen.getByText("Crear Tarea")).toBeInTheDocument();
  });

  it("calls onTaskCreated when submitted", async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const inputTitle = screen.getByPlaceholderText("Escribe el título");
    const inputDesc = screen.getByPlaceholderText("Agrega detalles de la tarea");
    const button = screen.getByText("Crear Tarea");

    await userEvent.type(inputTitle, "Mi tarea");
    await userEvent.type(inputDesc, "Detalles de la tarea");
    await userEvent.click(button);

    // Ahora debe pasar porque fetch está mockeado
    expect(mockOnTaskCreated).toHaveBeenCalledOnce();
    expect(mockOnTaskCreated).toHaveBeenCalledWith({
      title: "Mi tarea",
      description: "Detalles de la tarea",
    });
  });
});

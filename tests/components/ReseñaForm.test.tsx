import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReseñaForm from "../../components/ReseñaForm";

describe("ReseñaForm", () => {
  const libroId = "123";
  const onNuevaReseña = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it("renderiza el formulario con valores iniciales", () => {
    render(<ReseñaForm libroId={libroId} onNuevaReseña={onNuevaReseña} />);

    expect(screen.getByPlaceholderText("Escribe tu reseña...")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("0");
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("no llama onNuevaReseña ni hace fetch si texto o calificación no son válidos", async () => {
    render(<ReseñaForm libroId={libroId} onNuevaReseña={onNuevaReseña} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onNuevaReseña).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "  " },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(onNuevaReseña).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Buen libro" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(onNuevaReseña).not.toHaveBeenCalled();
  });

  it("envía reseña correctamente y limpia el formulario", async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<ReseñaForm libroId={libroId} onNuevaReseña={onNuevaReseña} />);

    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Excelente libro" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(onNuevaReseña).toHaveBeenCalled());

    // Verifica que onNuevaReseña se llamó con los datos esperados
    const llamada = onNuevaReseña.mock.calls[0][0];
    expect(llamada.libroId).toBe(libroId);
    expect(llamada.contenido).toBe("Excelente libro");
    expect(llamada.calificacion).toBe(5);
    expect(llamada.likes).toBe(0);
    expect(llamada.dislikes).toBe(0);
    expect(typeof llamada.fecha).toBe("string");

    // Verifica que fetch se llamó con los parámetros correctos
    expect(fetch).toHaveBeenCalledWith(`/api/resenas?libroId=${libroId}`, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contenido: "Excelente libro",
        calificacion: 5,
      }),
    }));

    // El formulario se limpia
    expect(screen.getByPlaceholderText("Escribe tu reseña...")).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("0");
  });

  it("muestra alert si fetch falla", async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
    });
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ReseñaForm libroId={libroId} onNuevaReseña={onNuevaReseña} />);

    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
      target: { value: "Fallido" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "3" },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("No se pudo guardar la reseña en la base de datos"));

    alertMock.mockRestore();
  });
});

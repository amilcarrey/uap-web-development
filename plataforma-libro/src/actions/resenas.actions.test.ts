import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from 'fs/promises';
import * as ResenasActions from "./resenas.actions";

// Mock de next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock de fs/promises con valores de retorno por defecto
vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue("[]"),
  writeFile: vi.fn().mockResolvedValue(undefined),
  access: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));



describe("Resenas Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Asegura valores por defecto para cada test
    (fs.readFile as any).mockResolvedValue("[]");
    (fs.writeFile as any).mockResolvedValue(undefined);
    (fs.access as any).mockResolvedValue(undefined);
    (fs.mkdir as any).mockResolvedValue(undefined);
  });

  it("deberia poder agregar una nueva reseña a lo bien", async () => {
    const mockFormData = new FormData();
    mockFormData.set("idLibro", "123");
    mockFormData.set("usuario", "Pepe");
    mockFormData.set("comentario", "Muy bueno");
    mockFormData.set("valoracion", "5");

    await ResenasActions.agregarReseña(mockFormData);

    expect(fs.writeFile).toHaveBeenCalled();
  });

  it("deberia poder dar like o dislike a una reseña correctamente", async () => {
    const mockFormData = new FormData();
    mockFormData.set("id", "1");
    mockFormData.set("tipo", "like");

    (fs.readFile as any).mockResolvedValue(
      JSON.stringify([
        {
          id: "1",
          idLibro: "123",
          usuario: "Ladines",
          comentario: "",
          valoracion: 3,
          likes: 0,
          dislikes: 0,
        },
      ])
    );

    await ResenasActions.votarReseña(mockFormData);

    expect(fs.writeFile).toHaveBeenCalled();
  });
});

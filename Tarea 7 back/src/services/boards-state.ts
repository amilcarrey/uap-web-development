import fs from "node:fs/promises";
import path from "node:path";
import type { Board } from "../types";

const filePath = path.resolve("boards-state.json");

export async function loadBoards(): Promise<Board[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // Si el archivo no existe, devolvemos una lista vacía
    return [];
  }
}

export async function saveBoards(boards: Board[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(boards, null, 2), "utf-8");
}

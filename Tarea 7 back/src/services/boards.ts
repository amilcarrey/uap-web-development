import type { Board } from "../types";
import { loadBoards, saveBoards } from "./boards-state";

let boards: Board[] = [];

(async () => {
  boards = await loadBoards(); // carga al iniciar
})();

export function getBoards(): Board[] {
  return boards;
}

export function addBoard(name: string): Board {
  const newBoard = {
    id: crypto.randomUUID(),
    name,
  };
  boards.push(newBoard);
  saveBoards(boards); // persistimos al agregar
  return newBoard;
}

export function deleteBoard(id: string): Board | null {
  const boards = getBoards();
  const index = boards.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const [deleted] = boards.splice(index, 1);
  saveBoards(boards); // 👈 guarda los cambios en el archivo

  return deleted;
}

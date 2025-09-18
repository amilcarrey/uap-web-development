export type Board = {
  id: string;
  name: string;
};

// export let boards: Board[] = [];
export const boards: Board[] = [
  { id: "general", name: "General" },
];

let nextId = 1;

export function generateId() {
  return String(nextId++);
}
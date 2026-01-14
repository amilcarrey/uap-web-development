// Definición de tipo para una categoría
export type Categoria = {
  id: string;
  name: string;
};

import { tasks } from "./tasks"; // Importa la lista de tareas

// Lista de categorías
export let categorias: Categoria[] = [
  { id: "personal", name: "Personal" },
  { id: "trabajo", name: "Trabajo" },
  { id: "familia", name: "Familia" },
  { id: "salud", name: "Salud" },
];

// Agregar categoría
export function addCategoria(name: string): void {
  const newCategoria: Categoria = {
    id: name.toLowerCase().replace(/\s+/g, "-"), // Convierte el nombre en un id único (ejemplo: "Trabajo Personal" -> "trabajo-personal")
    name,
  };
  categorias.push(newCategoria);
}

// Eliminar categoría por id
export function deleteCategoria(id: string): void {
  // Filtra las categorías para eliminar la que coincide con el ID
  categorias = categorias.filter((categoria) => categoria.id !== id);

  // Modifica el contenido de tasks eliminando las tareas asociadas a la categoría
  tasks.splice(0, tasks.length, ...tasks.filter((task) => task.categoriaId !== id));
}

// Listar categorías
export function listarCategorias(): Categoria[] {
  return categorias;
}

export function categoriaExiste(id: string): boolean {
  return categorias.some((categoria) => categoria.id === id);
}
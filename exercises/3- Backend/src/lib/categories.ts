// Definición de tipo para una categoría
export type Categoria = {
  id: string;
  name: string;
};

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
  categorias = categorias.filter((categoria) => categoria.id !== id);
}

// Listar categorías
export function listarCategorias(): Categoria[] {
  return categorias;
}
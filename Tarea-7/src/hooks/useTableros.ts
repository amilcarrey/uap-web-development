import { useQuery } from "@tanstack/react-query";

export interface Tablero {
  id: string;
  nombre: string;
}

const fetchTableros = async (): Promise<Tablero[]> => {
  const res = await fetch("/api/tableros");
  if (!res.ok) {
    throw new Error("No se pudieron cargar los tableros");
  }
  return res.json();
};

export const useTableros = () => {
  return useQuery({
    queryKey: ["tableros"],
    queryFn: fetchTableros,
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TareaType } from '../types/Tarea';

export interface PaginatedResponse {
  tareas: TareaType[];
  totalPaginas: number;
  paginaActual: number;
  totalTareas: number;
}

// Función helper para convertir alias a ID de tablero
const getTableroIdFromAlias = async (alias: string | undefined): Promise<string> => {
  if (!alias) return "tb-1"; // fallback
  
  try {
    const response = await fetch(`http://localhost:4321/api/tablero/${alias}`);
    if (response.ok) {
      const data = await response.json();
      return data.tablero.id;
    }
  } catch (error) {
    console.error('Error al obtener tablero:', error);
  }
  
  return "tb-1"; // fallback
};

export const useTareasQuery = (pagina: number, filtro: string, limite: number, tableroAlias: string | undefined) => {
  return useQuery<PaginatedResponse>({
    queryKey: ["tareas", tableroAlias, filtro, pagina, limite],
    queryFn: async () => {
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const params = new URLSearchParams({
        idTablero,
        pagina: pagina.toString(),
        filtro: filtro === "todas" ? "" : filtro,
        limite: limite.toString(),
      });

      const response = await fetch(`http://localhost:4321/api/tareas?${params}`);
      if (!response.ok) throw new Error("Error al obtener tareas");
      return response.json();
    },
    enabled: !!tableroAlias, // Solo ejecutar si tenemos alias
  });
};

export const useCrearTarea = (tableroAlias: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ descripcion }: { descripcion: string }) => {
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const response = await fetch("http://localhost:4321/api/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          descripcion, 
          idTablero
        }),
      });
      
      if (!response.ok) throw new Error("Error al agregar tarea");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
  });
};

export const useEliminarCompletadas = (tableroAlias: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const response = await fetch("http://localhost:4321/api/eliminarCompletadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTablero }),
      });
      
      if (!response.ok) throw new Error("Error al eliminar tareas completadas");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
  });
};

export const useEliminarTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('http://localhost:4321/api/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};

export const useToggleTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('http://localhost:4321/api/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: id.toString() }),
      });
      if (!res.ok) throw new Error('Error al cambiar estado');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};

export const useEditarTareaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, descripcion }: { id: number; descripcion: string }) => {
      const res = await fetch('http://localhost:4321/api/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, descripcion }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
};
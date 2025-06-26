import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TareaType } from '../types/Tarea';
import { useConfiguraciones } from "./useConfiguraciones";
import { useClientStore } from "../store/clientStore"; 

export interface PaginatedResponse {
  tareas: TareaType[];
  totalPaginas: number;
  paginaActual: number;
  totalTareas: number;
}

// Función helper para convertir alias a ID de tablero
export const getTableroIdFromAlias = async (alias: string | undefined): Promise<string> => {
  if (!alias) return "tb-1"; 
  
  try {
    const response = await fetch(`http://localhost:3001/api/tableros/${alias}`, {
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      return data.tablero.id;
    }
  } catch (error) {
    console.error('Error al obtener tablero:', error);
  }
  
  return "tb-1";
};

export const useTareas = (tableroAlias?: string, filtro?: 'todas' | 'completadas' | 'pendientes') => {
  const { data: configData } = useConfiguraciones();
  const { paginaActual } = useClientStore();
  const intervaloRefetch = configData?.configuraciones?.intervaloRefetch ?? 10;
  const tareasPorPagina = configData?.configuraciones?.tareasPorPagina ?? 5;

  return useQuery({
    queryKey: ['tareas', tableroAlias, filtro, paginaActual, tareasPorPagina],
    queryFn: async () => {
      const tableroId = await getTableroIdFromAlias(tableroAlias);
      
      let url = `http://localhost:3001/api/tareas`;
      const params = new URLSearchParams();
      
      params.append('idTablero', tableroId);
      params.append('pagina', paginaActual.toString()); 
      if (filtro && filtro !== 'todas') params.append('filtro', filtro);
      params.append('limite', tareasPorPagina.toString());
      
      url += `?${params.toString()}`;
      
      const response = await fetch(url, {
        credentials: "include" 
      });
      if (!response.ok) throw new Error('Error al obtener tareas');
      const data = await response.json();
      
      return data;
    },
    refetchInterval: intervaloRefetch * 1000, 
    enabled: !!tableroAlias,
  });
};

export const useCrearTarea = (tableroAlias: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ descripcion }: { descripcion: string }) => {
      const idTablero = await getTableroIdFromAlias(tableroAlias);
      
      const response = await fetch("http://localhost:3001/api/tareas", {
        method: "POST",
        credentials: "include", 
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

export const useEliminarCompletadas = (tableroId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!tableroId) throw new Error("No se proporcionó el id del tablero");
      console.log(`Eliminando tareas completadas del tablero: ${tableroId}`);
      const response = await fetch(`http://localhost:3001/api/tareas/completadas?idTablero=${tableroId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar tareas completadas");
      }
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
      const res = await fetch(`http://localhost:3001/api/tareas/${id}`, {
        method: 'DELETE',
        credentials: "include", 
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`http://localhost:3001/api/tareas/${id}/toggle`, {
        method: 'PUT',
        credentials: "include", 
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`http://localhost:3001/api/tareas/${id}`, {
        method: 'PUT',
        credentials: "include", 
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

export const useBuscarTareas = (query: string) => {
  return useQuery({
    queryKey: ['buscar-tareas', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(`http://localhost:3001/api/tareas/buscar?query=${encodeURIComponent(query)}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error al buscar tareas");
      const data = await res.json();
      return data.tareas;
    },
    enabled: !!query,
  });
};
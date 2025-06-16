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
const getTableroIdFromAlias = async (alias: string | undefined): Promise<string> => {
  if (!alias) return "tb-1"; 
  
  try {
    const response = await fetch(`http://localhost:3001/api/tableros/${alias}`);
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
  
  return useQuery({
    queryKey: ['tareas', tableroAlias, filtro, paginaActual],
    queryFn: async () => {
      console.log(`🔄 [${new Date().toLocaleTimeString()}] Frontend - Refetch automático iniciado`); 
      const tableroId = await getTableroIdFromAlias(tableroAlias);
      
      let url = `http://localhost:3001/api/tareas`;
      const params = new URLSearchParams();
      
      params.append('idTablero', tableroId);
      params.append('pagina', paginaActual.toString()); 
      if (filtro && filtro !== 'todas') params.append('filtro', filtro);
      
      url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener tareas');
      const data = await response.json();
      console.log(`✅ Frontend - Refetch completado: ${data.tareas?.length || 0} tareas recibidas`); 
      
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
      
      const response = await fetch("http://localhost:3001/api/tareas/completadas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTablero }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
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
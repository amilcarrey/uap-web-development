import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFromToken } from '../utils/auth';


export interface Tab {
  id: string;
  title: string;
}

// --- Funciones de fetch ---

// Obtener todos los tableros
async function fetchTabs(): Promise<Tab[]> {
  console.log('Ejecutando fetchTabs: consultando /api/boards');
  const res = await fetch('http://localhost:3000/api/boards', {
    credentials: 'include',
  });
  if (!res.ok) {
    console.log('Error al obtener tableros:', res.status);
    throw new Error('Error al obtener tableros');
  }
  const data = await res.json();
  //console.log('Datos recibidos del backend:', data);
  

   return data.map((board: any) => ({
     id: board.id.toString(), 
     title: board.name
   }));
  
}

// Crear tablero
async function createTabRequest(title: string): Promise<Tab> {
  const res = await fetch('http://localhost:3000/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action: 'create', name: title }),
  });
  if (!res.ok) throw new Error('Error al crear tablero');
  const data = await res.json();
  return data.tab; // o data.newTab según tu backend
}

// Eliminar tablero
async function deleteTabRequest(boardId: string): Promise<any> {
  console.log('=== INICIO deleteTabRequest ===');
  console.log('boardId recibido:', boardId);

  // No extraer userId manualmente, dejar que el backend lo haga desde la cookie
  const url = `http://localhost:3000/api/boards/${boardId}`;
  console.log('URL de eliminación:', url);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Esto envía las cookies automáticamente
  });
  
  console.log('Respuesta del servidor:', {
    status: res.status,
    ok: res.ok,
    statusText: res.statusText
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error del servidor:', errorText);
    throw new Error(`Error al eliminar tablero: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('Resultado de eliminación:', result);
  return result;
}

// Renombrar tablero
async function renameTabRequest({ id, newTitle }: { id: string; newTitle: string }): Promise<Tab> {
  const res = await fetch(`http://localhost:3000/api/boards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action: 'rename', name: newTitle }),
  });
  if (!res.ok) throw new Error('Error al renombrar tablero');
  return res.json();
}

// --- Hooks ---

export function useTabs() {
  return useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: fetchTabs,
    initialData: [],
    gcTime: 1,
    staleTime: 1000,
    refetchInterval: 10000, // Refrescar cada 10 segundos
  });
}

export function useCreateTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}

export function useDeleteTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}


export function useRenameTab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renameTabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    },
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Tab {
  id: string;
  title: string;
}

// --- Funciones de fetch ---

// Obtener todos los tableros
async function fetchTabs(): Promise<Tab[]> {
  const res = await fetch('http://localhost:4321/api/tabs');
  if (!res.ok) throw new Error('Error al obtener tableros');
  const data = await res.json();
  // Extrae el array de la propiedad 'tabs'
  return data.tabs ?? [];
}

// Crear tablero
async function createTabRequest(title: string): Promise<Tab> {
  const res = await fetch('http://localhost:4321/api/tabs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ action: 'create', title }),
  });
  if (!res.ok) throw new Error('Error al crear tablero');
  const data = await res.json();
  return data.tab; // o data.newTab según tu backend
}

// Eliminar tablero
async function deleteTabRequest(id: string): Promise<any> {
  const res = await fetch('http://localhost:4321/api/tabs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', tabId: id }),
  });
  if (!res.ok) throw new Error('Error al eliminar tablero');
  return res.json();
}

// Renombrar tablero
async function renameTabRequest({ id, newTitle }: { id: string; newTitle: string }): Promise<Tab> {
  const res = await fetch('http://localhost:4321/api/tabs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'rename', tabId: id, newTitle: newTitle }),
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
  });
}

export function useCreateTab() {
  const queryClient = useQueryClient();

    try {
        return useMutation({
            mutationFn: createTabRequest,
            onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tabs'] });
            },
        });
    } catch (error) {
        console.log("Error en la funcion useCreateTab");
    }

  
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

    try {
        return useMutation({
            mutationFn: renameTabRequest,
            onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tabs'] });
            },
        });
    } catch (error) {
        console.log("Error en la funcion useRenameTab");
    }

  
}


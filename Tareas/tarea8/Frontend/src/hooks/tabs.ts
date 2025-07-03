import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

export interface Tab {
  id: string;
  title: string;
  userRole?: 'owner' | 'editor' | 'viewer';
}

// Generate headers, include token if available
function getAuthHeaders() {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Get all tabs
async function fetchTabs(): Promise<Tab[]> {
  const res = await fetch(`http://localhost:3000/api/boards?_t=${Date.now()}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed to fetch boards:', res.status, text);
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.map((board: any) => ({
    id: board.id.toString(),
    title: board.name,
    userRole: (board.userRole?.toLowerCase() as 'owner' | 'editor' | 'viewer') || 'viewer',
  }));
}

// Create tab
async function createTabRequest(title: string): Promise<Tab> {
  const res = await fetch('http://localhost:3000/api/boards', {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ action: 'create', name: title }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Create tab failed:', err);
    throw new Error(`Error creating tab: ${err}`);
  }

  const data = await res.json();
  const obj = data.tab || data.board || data;
  const found = obj.id && obj.name ? obj : Object.values(data).find((v: any) => v?.id && v?.name);

  if (!found) throw new Error('Response missing id or name');

  return {
    id: found.id.toString(),
    title: found.name,
    userRole: 'owner',
  };
}

// Delete tab
async function deleteTabRequest(boardId: string) {
  const res = await fetch(`http://localhost:3000/api/boards/${boardId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Delete failed: ${msg}`);
  }

  if (res.headers.get('content-type')?.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return { success: true };
    }
  }

  return { success: true };
}

// Rename tab
async function renameTabRequest({ id, newTitle }: { id: string; newTitle: string }): Promise<Tab> {
  const res = await fetch(`http://localhost:3000/api/boards/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ action: 'rename', name: newTitle }),
  });

  if (!res.ok) throw new Error('Rename failed');

  const data = await res.json();
  return {
    id: data.id.toString(),
    title: data.name,
    userRole: data.userRole || 'owner',
  };
}

// Hooks
export function useTabs() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  return useQuery<Tab[]>({
    queryKey: ['tabs'],
    queryFn: fetchTabs,
    initialData: [],
    gcTime: 0,
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: isAuthenticated && !isLoading,
    retry: (count, error) => {
      if (error?.message?.includes('401')) return false;
      return count < 2;
    },
    retryDelay: 1000,
  });
}

export function useCreateTab() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createTabRequest,
    onSuccess: () => client.invalidateQueries({ queryKey: ['tabs'] }),
  });
}

export function useDeleteTab() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteTabRequest,
    onSuccess: () => client.invalidateQueries({ queryKey: ['tabs'] }),
  });
}

export function useRenameTab() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: renameTabRequest,
    onSuccess: () => client.invalidateQueries({ queryKey: ['tabs'] }),
  });
}

export type Task = {
  id: number;
  text: string;
  completed: boolean;
  categoriaId: string; 
};

export type Categoria = {
  id: string;
  name: string;
  userId?: string;
  userRole?: 'owner' | 'editor' | 'viewer';  // ← NUEVO
  isShared?: boolean;                         // ← NUEVO
}
import { create } from 'zustand';

type PaginationState = {
  page: number;
  setPage: (newPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

export const usePaginationStore = create<PaginationState>((set) => ({
  page: 1,
  setPage: (newPage) => set({ page: newPage }),
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  prevPage: () => set((state) => ({ page: Math.max(1, state.page - 1) })),
}));

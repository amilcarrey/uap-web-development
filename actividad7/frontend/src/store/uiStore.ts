// src/store/uiStore.ts
import { create } from 'zustand';

type UIStore = {
  showCompleted: boolean;
  toggleShowCompleted: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  showCompleted: true,
  toggleShowCompleted: () =>
    set((state) => ({ showCompleted: !state.showCompleted })),
}));

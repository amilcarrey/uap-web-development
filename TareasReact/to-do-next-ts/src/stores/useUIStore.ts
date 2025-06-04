import { create } from 'zustand';

type UIState = {
  toast: string | null;
  setToast: (msg: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  setToast: (msg) => set({ toast: msg }),
}));

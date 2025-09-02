import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  openModal: (message: string, type: "success" | "error") => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  openModal: (message, type) => {
    set({ isOpen: true, message, type });
    setTimeout(() => set({ isOpen: false, message: "", type: "success" }), 2000); // Cierra solo
  },
  closeModal: () => set({ isOpen: false, message: "", type: "success" }),
}));
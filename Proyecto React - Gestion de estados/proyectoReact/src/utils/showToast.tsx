import { useToastStore } from "../store/toastStore";
import type { ToastType } from "../store/toastStore";

export function showToast(message: string, type: ToastType = "info") {
  const addToast = useToastStore.getState().addToast;
  addToast(message, type);
}

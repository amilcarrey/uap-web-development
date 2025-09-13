import { toast as sonnerToast } from "sonner";

type ToastOptions = Partial<Parameters<typeof sonnerToast>[1]>;

const defaultOptions: ToastOptions = {
  duration: Infinity,
  closeButton: true,
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, { ...defaultOptions, ...options }),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, { ...defaultOptions, ...options }),

  info: (message: string, options?: ToastOptions) =>
    sonnerToast(message, { ...defaultOptions, ...options }),
};
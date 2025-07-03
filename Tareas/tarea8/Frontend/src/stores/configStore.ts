import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigState {
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
  upperCaseDescription: boolean;
  setUpperCaseDescription: (value: boolean) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      refetchInterval: 10000,
      setRefetchInterval: (interval) => {
        const { userId } = get();
        if (userId) {
          localStorage.setItem(
            `user_${userId}_refetchInterval`,
            interval.toString()
          );
        }
        set({ refetchInterval: interval });
      },
      upperCaseDescription: false,
      setUpperCaseDescription: (value) => {
        const { userId } = get();
        if (userId) {
          localStorage.setItem(
            `user_${userId}_upperCaseDescription`,
            value.toString()
          );
        }
        set({ upperCaseDescription: value });
      },
      userId: null,
      setUserId: (newUserId) => {
        if (newUserId) {
          const savedRefetchInterval = localStorage.getItem(
            `user_${newUserId}_refetchInterval`
          );
          const savedUpperCase = localStorage.getItem(
            `user_${newUserId}_upperCaseDescription`
          );

          set({
            userId: newUserId,
            refetchInterval: savedRefetchInterval
              ? parseInt(savedRefetchInterval)
              : 10000,
            upperCaseDescription: savedUpperCase
              ? savedUpperCase === "true"
              : false,
          });
        } else {
          set({
            userId: null,
            refetchInterval: 10000,
            upperCaseDescription: false,
          });
        }
      },
    }),
    {
      name: "config-storage",
      partialize: (state) => ({
        refetchInterval: state.refetchInterval,
        upperCaseDescription: state.upperCaseDescription,
      }),
    }
  )
);

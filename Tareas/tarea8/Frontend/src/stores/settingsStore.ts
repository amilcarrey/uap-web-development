import { create } from "zustand";

type SettingsState = {
  isOpen: boolean;
  activeTab: string | null;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isOpen: false,
  activeTab:
    typeof window !== "undefined"
      ? localStorage.getItem("settings-active-tab")
      : null,
  openSettings: (tab?: string) => {
    let targetTab: string;

    if (tab) {
      targetTab = tab;
      localStorage.setItem("settings-active-tab", tab);
    } else {
      const currentActiveTab = get().activeTab;
      const storedTab = localStorage.getItem("settings-active-tab");
      targetTab = currentActiveTab || storedTab || "profile";
    }

    set({ isOpen: true, activeTab: targetTab });
  },
  closeSettings: () => {
    set({ isOpen: false });
  },
}));

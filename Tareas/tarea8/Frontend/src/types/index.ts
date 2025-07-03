export * from "./permissions";
export * from "./board";
export * from "./task";
export * from "./user";
export * from "./api";

export interface Tab {
  id: string;
  name: string;
  userRole?: "owner" | "editor" | "reader";
}

export interface AuthUser {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
}

export interface UIState {
  editingTaskId: string | null;
  isShareModalOpen: boolean;
  activeTabId: string | null;
  taskFilter: "all" | "active" | "completed";
}

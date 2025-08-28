export type Role = "owner" | "editor" | "viewer";

export function canPerform(role: Role, action: "add" | "edit" | "delete" | "toggle" | "clear"): boolean {
  if (role === "owner" || role == "editor") return true;
  if (role === "viewer") return action === "add"; // Solo puede agregar
  return false;
}

import { getUserFromToken } from "../utils/auth";
import { useSearchUsers } from "./userSettings";

export function getUserRoleInBoard(boardOwnerId: number): "owner" | "editor" {
  const currentUser = getUserFromToken();
  if (!currentUser) return "editor";

  return currentUser.id === boardOwnerId ? "owner" : "editor";
}

export function canUserEditBoard(boardOwnerId: number): boolean {
  return getUserRoleInBoard(boardOwnerId) === "owner";
}

export function isUserBoardOwner(boardOwnerId: number): boolean {
  const currentUser = getUserFromToken();
  return currentUser ? currentUser.id === boardOwnerId : false;
}

export { useSearchUsers };

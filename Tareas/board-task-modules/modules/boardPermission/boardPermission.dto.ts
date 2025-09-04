export interface BoardPermissionDto {
  boardId: number;
  userId: number;
  level: "OWNER" | "EDITOR" | "VIEWER";
}

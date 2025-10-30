import { useBoardRole } from "../hooks/useBoardRole";

type BoardRoleBadgeProps = {
  boardId: string;
};

export function BoardRoleBadge({ boardId }: BoardRoleBadgeProps) {
  const { data: role, isLoading } = useBoardRole(boardId);

  if (isLoading || !role) return null;

  return (
    <div className="fixed top-4 left-23 text-sm text-black p-2 font-semibold">
      Rol: <span className="font-bold">{role}</span>
    </div>
  );
}

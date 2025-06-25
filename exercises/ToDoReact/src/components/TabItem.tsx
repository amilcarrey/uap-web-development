import React from "react";
import type { Board } from "../types/api";
import { X } from "lucide-react";

interface TabItemProps {
  name: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  board?: Board; // Optional board data for permission-aware features
  onDelete?: (name: string) => void;
  canDelete?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  name,
  isActive,
  onClick,
  board,
  onDelete,
  canDelete = false,
}) => {
  const isSharedBoard =
    board?.permission_level && board.permission_level !== "owner";

  return (
    <>
      <li className="inline-block relative">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 capitalize ${
              canDelete ? "rounded-l" : "rounded"
            } ${
              isActive
                ? isSharedBoard
                  ? "bg-purple-900 text-purple-200 font-medium"
                  : "bg-amber-900 text-amber-200 font-medium"
                : isSharedBoard
                ? "text-purple-100 hover:bg-purple-800"
                : "text-slate-100 hover:bg-amber-800"
            }`}
          >
            <div className="flex items-center gap-1">
              <span>{name}</span>
              {isSharedBoard && <div className="flex items-center gap-1"></div>}
              {isSharedBoard && board.owner_username && (
                <span className="text-xs opacity-60 italic">
                  {board.owner_username}
                </span>
              )}
            </div>
          </button>

          {/* Delete button integrated within the tab */}
          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(name);
              }}
              className={`px-2 py-2 text-xs rounded-r ${
                isActive
                  ? isSharedBoard
                    ? "bg-purple-900 text-purple-300 hover:text-red-300 hover:bg-purple-800"
                    : "bg-amber-900 text-amber-300 hover:text-red-300 hover:bg-amber-800"
                  : isSharedBoard
                  ? "text-purple-200 hover:text-red-300 hover:bg-purple-800"
                  : "text-slate-200 hover:text-red-300 hover:bg-amber-800"
              }`}
              title={`Delete ${name} tab`}
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </li>
    </>
  );
};

export default TabItem;

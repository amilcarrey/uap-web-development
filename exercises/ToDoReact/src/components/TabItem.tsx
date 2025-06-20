import React, { useState } from "react";
import { ShareBoardDialog } from "./ShareBoardDialog";
import { BoardPermissions } from "./BoardPermissions";
import type { Board } from "../types/api";

interface TabItemProps {
  name: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  board?: Board; // Optional board data for permission-aware features
}

const TabItem: React.FC<TabItemProps> = ({
  name,
  isActive,
  onClick,
  board,
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareDialog(true);
  };

  const handlePermissionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPermissions(true);
  };

  const isSharedBoard =
    board?.permission_level && board.permission_level !== "owner";
  const canShare = board?.permission_level === "owner";

  return (
    <>
      <li className="inline-block relative">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 capitalize rounded-l ${
              isActive
                ? isSharedBoard
                  ? "bg-purple-900 text-purple-200 font-medium"
                  : "bg-amber-900 text-amber-200 font-medium"
                : isSharedBoard
                ? "text-purple-100 hover:bg-purple-800"
                : "text-slate-100 hover:bg-amber-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{name}</span>
              {isSharedBoard && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span className="text-xs opacity-75">
                    {board.permission_level}
                  </span>
                </div>
              )}
              {isSharedBoard && board.owner_username && (
                <span className="text-xs opacity-60">
                  by {board.owner_username}
                </span>
              )}
            </div>
          </button>

          {/* Settings dropdown for owners */}
          {canShare && (
            <div className="relative">
              <button
                onClick={handlePermissionsClick}
                className={`px-2 py-2 rounded-r ${
                  isActive
                    ? "bg-amber-900 text-amber-200 hover:bg-amber-800"
                    : "text-slate-100 hover:bg-amber-800"
                }`}
                title="Board settings"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Quick share button for owners */}
          {canShare && (
            <button
              onClick={handleShareClick}
              className={`ml-1 px-2 py-2 rounded ${
                isActive
                  ? "bg-amber-700 text-amber-200 hover:bg-amber-600"
                  : "text-slate-100 hover:bg-amber-700"
              }`}
              title="Share board"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          )}
        </div>
      </li>

      {/* Share Dialog */}
      {board && (
        <ShareBoardDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          boardId={board.id}
          boardName={board.name}
        />
      )}

      {/* Permissions Management Modal */}
      {showPermissions && board && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Board Settings
              </h2>
              <button
                onClick={() => setShowPermissions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Quick share section */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Share Board
                  </h3>
                  <button
                    onClick={handleShareClick}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Share with Users
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Give others access to view and collaborate on this board.
                </p>
              </div>

              {/* Permissions list */}
              <BoardPermissions
                boardId={board.id}
                boardName={board.name}
                currentUserPermission={board.permission_level || "owner"}
              />
            </div>
          </div>

          {/* Overlay */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowPermissions(false)}
          />
        </div>
      )}
    </>
  );
};

export default TabItem;

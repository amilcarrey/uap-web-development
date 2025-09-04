import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { useAuthStore } from '../../store/useAuthStore'; // To get current user for permission checks
import { checkOwnership, getCurrentUserPermissionLevelForBoard } from '../../store/useBoardStore'; // Utility functions

// Task related components (assuming they are adapted or will be adapted for boardId context)
import { TaskForm } from '../TaskForm';
import { FilterButtons } from '../FilterButtons';
import { TaskList } from '../TaskList';
import { ClearCompleted } from '../ClearCompleted';

// Board action components (to be created)
import ShareBoardModal from './ShareBoardModal'; // Placeholder
import ManagePermissionsModal from './ManagePermissionsModal'; // Placeholder
import { Settings, Share2, Users, Trash2, Edit3 } from 'lucide-react';
import { toastError } from '../../lib/toast';


const BoardView: React.FC = () => {
  const {
    selectedBoard,
    selectedBoardPermissions,
    deleteBoard: storeDeleteBoard, // Renamed to avoid conflict
    updateBoard: storeUpdateBoard // Renamed
  } = useBoardStore();

  const currentUser = useAuthStore((state) => state.user);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isManagePermissionsModalOpen, setIsManagePermissionsModalOpen] = React.useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = React.useState(false); // For renaming board

  if (!selectedBoard) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Select a board to view its tasks, or create a new one.</p>
      </div>
    );
  }

  const isOwner = checkOwnership(selectedBoard, currentUser?.id);
  const currentUserPermission = getCurrentUserPermissionLevelForBoard(selectedBoardPermissions, currentUser?.id);
  const canEditBoardDetails = isOwner; // Only owner can rename board (per current backend logic for board PUT)
  const canDeleteBoard = isOwner;
  const canShareBoard = isOwner;
  const canManagePermissions = isOwner;
  const canEditTasks = currentUserPermission === 'owner' || currentUserPermission === 'editor';


  const handleDeleteBoard = async () => {
    if (window.confirm(`Are you sure you want to delete the board "${selectedBoard.name}"? This action cannot be undone.`)) {
      await storeDeleteBoard(selectedBoard.id);
      // Selection of new board is handled in store
    }
  };

  // TODO: Implement EditBoardModal and its logic
  const handleRenameBoard = () => {
    // setIsEditBoardModalOpen(true);
    toastError("Rename board functionality not yet implemented.");
  };


  return (
    <div className="flex-1 p-6 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{selectedBoard.name}</h2>
        <div className="flex space-x-2">
          {canEditBoardDetails && (
            <button onClick={handleRenameBoard} className="p-2 text-gray-600 hover:text-blue-600" title="Rename Board">
              <Edit3 size={20} />
            </button>
          )}
          {canShareBoard && (
            <button onClick={() => setIsShareModalOpen(true)} className="p-2 text-gray-600 hover:text-green-600" title="Share Board">
              <Share2 size={20} />
            </button>
          )}
          {canManagePermissions && ( // Or 'editor' can view permissions
             <button onClick={() => setIsManagePermissionsModalOpen(true)} className="p-2 text-gray-600 hover:text-purple-600" title="Manage Collaborators">
              <Users size={20} />
            </button>
          )}
          {canDeleteBoard && (
            <button onClick={handleDeleteBoard} className="p-2 text-gray-600 hover:text-red-600" title="Delete Board">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Task components will need to be aware of selectedBoard.id */}
      {/* For now, assuming they are adapted to use a prop or consume from store */}
      <TaskForm boardId={selectedBoard.id} disabled={!canEditTasks} />
      <FilterButtons boardId={selectedBoard.id} />
      <TaskList boardId={selectedBoard.id} />
      <ClearCompleted boardId={selectedBoard.id} disabled={!canEditTasks} />

      {isOwner && (
        <>
          <ShareBoardModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            boardId={selectedBoard.id}
          />
          <ManagePermissionsModal
            isOpen={isManagePermissionsModalOpen}
            onClose={() => setIsManagePermissionsModalOpen(false)}
            boardId={selectedBoard.id}
          />
          {/* <EditBoardModal isOpen={isEditBoardModalOpen} onClose={() => setIsEditBoardModalOpen(false)} board={selectedBoard} /> */}
        </>
      )}
    </div>
  );
};

export default BoardView;

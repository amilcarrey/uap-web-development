import React, { useEffect } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { type BoardPermission } from '../../services/boardService';
import { Trash2, Edit3, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { toastSuccess, toastError } from '../../lib/toast';

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: number; // Selected board's ID
}

const PermissionIcon: React.FC<{ level: 'owner' | 'editor' | 'viewer' }> = ({ level }) => {
  if (level === 'owner') return <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />;
  if (level === 'editor') return <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />;
  return <Shield className="w-5 h-5 text-blue-500 mr-2" />;
};

const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({ isOpen, onClose, boardId }) => {
  const {
    selectedBoardPermissions,
    fetchSelectedBoardPermissions,
    updateUserPermissionOnSelectedBoard,
    removeUserFromSelectedBoard,
    isLoading
  } = useBoardStore();

  useEffect(() => {
    if (isOpen) {
      fetchSelectedBoardPermissions();
    }
  }, [isOpen, fetchSelectedBoardPermissions]);

  const handlePermissionChange = async (userId: number, newLevel: 'editor' | 'viewer') => {
    try {
      await updateUserPermissionOnSelectedBoard(userId, newLevel);
      toastSuccess("Permission updated.");
    } catch (error) {/* Store handles toast for error */}
  };

  const handleRemoveUser = async (userId: number, username: string) => {
    if (window.confirm(`Are you sure you want to remove ${username}'s access to this board?`)) {
      try {
        await removeUserFromSelectedBoard(userId);
        toastSuccess(`${username} removed from board.`);
      } catch (error) {/* Store handles toast for error */}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Manage Board Collaborators</h2>

        {isLoading && selectedBoardPermissions.length === 0 && <p>Loading permissions...</p>}
        {!isLoading && selectedBoardPermissions.length === 0 && <p>No users (other than you) have explicit permissions on this board.</p>}

        {selectedBoardPermissions.length > 0 && (
          <ul className="space-y-3 overflow-y-auto flex-grow mb-4">
            {selectedBoardPermissions.map((perm) => (
              <li key={perm.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <PermissionIcon level={perm.permissionLevel} />
                  <div>
                    <p className="font-medium text-gray-800">{perm.user.username}</p>
                    <p className="text-xs text-gray-500">{perm.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {perm.permissionLevel !== 'owner' && ( // Owner's permission cannot be changed here
                    <>
                      <select
                        value={perm.permissionLevel}
                        onChange={(e) => handlePermissionChange(perm.userId, e.target.value as 'editor' | 'viewer')}
                        className="text-xs p-1 border border-gray-300 rounded bg-white focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isLoading}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </select>
                      <button
                        onClick={() => handleRemoveUser(perm.userId, perm.user.username)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove User"
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  {perm.permissionLevel === 'owner' && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Owner</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissionsModal;

import React, { useState } from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { toastSuccess, toastError } from '../../lib/toast';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: number;
}

const ShareBoardModal: React.FC<ShareBoardModalProps> = ({ isOpen, onClose, boardId }) => {
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'editor' | 'viewer'>('viewer');
  const { shareSelectedBoard, isLoading } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toastError('Email cannot be empty.');
      return;
    }
    try {
      await shareSelectedBoard(email, permissionLevel);
      toastSuccess(`Board shared with ${email} as ${permissionLevel}.`);
      setEmail('');
      setPermissionLevel('viewer');
      onClose();
    } catch (error) {
      // Error is already toasted in the store action, but can re-throw or handle specific UI updates
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Share Board</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="share-email" className="block text-sm font-medium text-gray-700">
              User Email
            </label>
            <input
              type="email"
              id="share-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter user's email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="share-permission" className="block text-sm font-medium text-gray-700">
              Permission Level
            </label>
            <select
              id="share-permission"
              value={permissionLevel}
              onChange={(e) => setPermissionLevel(e.target.value as 'editor' | 'viewer')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="viewer">Viewer (Can view tasks)</option>
              <option value="editor">Editor (Can add/edit/delete tasks)</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Sharing...' : 'Share Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareBoardModal;

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchUsers, useAllUsers, useBoardSharedUsers, useUpdateBoardPermission } from '../hooks/userSettings';
import { useAuthStore } from '../stores/authStore';
import { getPermissionDisplayText, frontendToBackendPermission } from '../types/permissions';

interface User {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  permissionId?: number;
  level?: string;
}

interface ShareBoardContentProps {
  boardId: string;
}

export function ShareBoardContent({ boardId }: ShareBoardContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);
  const [selectedPermissionLevel, setSelectedPermissionLevel] = useState<'EDITOR' | 'VIEWER'>('EDITOR');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Safely return the user's first initial
  const getUserInitial = (user: User): string => {
    if (!user) return '?';
    let name = user.alias || user.firstName || user.lastName || 'User';
    return name.charAt(0).toUpperCase();
  };

  // Return a full display name for the user
  const getUserDisplayName = (user: User): string => {
    if (!user) return 'Unknown User';
    if (user.alias?.trim()) return user.alias;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || 'No Name';
  };

  const currentUser = useAuthStore((state) => state.user);

  // Hooks for data fetching
  const { data: allUsers = [], isLoading: allUsersLoading } = useAllUsers();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchUsers(searchTerm);
  const { data: alreadySharedUsers = [], refetch: refetchSharedUsers } = useBoardSharedUsers(boardId);

  const updatePermissionMutation = useUpdateBoardPermission();

  // Merge already shared users from the backend with locally added users
  const combinedSharedUsers = useMemo(() => {
    const localIds = sharedUsers.map(u => u.id);
    const backendUsers = alreadySharedUsers.filter(u => u && u.id && !localIds.includes(u.id));
    return [...sharedUsers, ...backendUsers];
  }, [sharedUsers, alreadySharedUsers]);

  // Filter out the current user and users without names
  const availableUsers = useMemo(() => {
    const users = searchTerm.length >= 2 ? searchResults : allUsers;
    return users.filter(user => user.id !== currentUser?.id && (user.alias || user.firstName || user.lastName));
  }, [searchResults, allUsers, searchTerm, currentUser]);

  const isLoading = searchTerm.length >= 2 ? searchLoading : allUsersLoading;

  useEffect(() => {
    if (!boardId) setSearchTerm('');
  }, [boardId]);

  // Reset state when the board changes
  useEffect(() => {
    setSharedUsers([]);
    setSearchTerm('');
    setSelectedPermissionLevel('EDITOR');
    setEditingUserId(null);
  }, [boardId]);

  const handleShare = async (user: User) => {
    try {
      const token = localStorage.getItem('token');

      if (combinedSharedUsers.some(u => u.id === user.id)) {
        toast.error(`Already shared with ${getUserDisplayName(user)}`);
        return;
      }

      const requestBody = {
        userId: user.id,
        level: frontendToBackendPermission(selectedPermissionLevel)
      };

      const response = await fetch(`http://localhost:3000/api/boards/${boardId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error((await response.json()).message || `Error ${response.status}`);
      await response.json();

      setSharedUsers(prev => [...prev, user]);
      refetchSharedUsers();
      toast.success(`Shared with ${getUserDisplayName(user)} as ${selectedPermissionLevel === 'EDITOR' ? 'Editor' : 'Viewer'}`);
      setSearchTerm('');
    } catch (error) {
      toast.error(`Share failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRemoveShare = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:3000/api/boards/${boardId}/permissions/${user.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        credentials: 'include'
      });

      if (!response.ok) throw new Error((await response.json()).message || `Error ${response.status}`);

      setSharedUsers(prev => prev.filter(u => u.id !== user.id));
      refetchSharedUsers();
      toast.success(`Access removed for ${getUserDisplayName(user)}`);
    } catch (error) {
      toast.error(`Remove failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChangePermission = async (user: User, newLevel: 'EDITOR' | 'VIEWER') => {
    try {
      await updatePermissionMutation.mutateAsync({
        boardId,
        userId: user.id,
        newLevel: frontendToBackendPermission(newLevel)
      });

      toast.success(`Updated ${getUserDisplayName(user)} to ${newLevel === 'EDITOR' ? 'Editor' : 'Viewer'}`);
      setEditingUserId(null);
      refetchSharedUsers();
    } catch (error) {
      toast.error(`Permission change failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleEditMode = (userId: number) => {
    setEditingUserId(editingUserId === userId ? null : userId);
  };

  const isOwner = (user: User): boolean => {
    return user.level?.toUpperCase() === 'OWNER' || user.id === currentUser?.id;
  };

  return (
    <div>
      {/* Shared users */}
      {combinedSharedUsers.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Shared with:</h3>
          <div className="space-y-3">
            {combinedSharedUsers.map((user) => {
              const userIsOwner = isOwner(user);
              return (
                <div key={user.id} className="flex items-center justify-between p-3 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${userIsOwner ? 'bg-yellow-400' : 'bg-green-400'}`}>
                      {getUserInitial(user)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getUserDisplayName(user)}
                        {userIsOwner && <span className="ml-2 text-xs bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">Owner</span>}
                      </p>
                      {(user.firstName || user.lastName) && user.alias && (
                        <p className="text-xs text-gray-600">{user.firstName} {user.lastName}</p>
                      )}
                      {user.level && (
                        <p className="text-xs text-blue-500">{getPermissionDisplayText(user.level)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {userIsOwner ? (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">Owner</span>
                    ) : editingUserId === user.id ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleChangePermission(user, 'EDITOR')} className={`px-2 py-1 text-xs rounded ${user.level === 'EDITOR' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-200'}`}>
                          Edit
                        </button>
                        <button onClick={() => handleChangePermission(user, 'VIEWER')} className={`px-2 py-1 text-xs rounded ${user.level === 'VIEWER' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-200'}`}>
                          View
                        </button>
                        <button onClick={() => setEditingUserId(null)} className="px-2 py-1 text-xs bg-gray-300 hover:bg-gray-400 rounded">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => toggleEditMode(user.id)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                          Change
                        </button>
                        <button onClick={() => handleRemoveShare(user)} className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User search */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-800 mb-2">Search users:</label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by alias..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Permission level selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-800 mb-2">Permission for new users:</label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setSelectedPermissionLevel('EDITOR')} className={`p-3 border rounded-md ${selectedPermissionLevel === 'EDITOR' ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-300 hover:border-gray-400'}`}>
            <div className="font-medium">Edit</div>
            <div className="text-xs text-gray-500">Can create and edit tasks</div>
          </button>
          <button onClick={() => setSelectedPermissionLevel('VIEWER')} className={`p-3 border rounded-md ${selectedPermissionLevel === 'VIEWER' ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-300 hover:border-gray-400'}`}>
            <div className="font-medium">View</div>
            <div className="text-xs text-gray-500">Can only view tasks</div>
          </button>
        </div>
      </div>

      {/* Available users */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-800 mb-2">{searchTerm.length >= 2 ? 'Search results:' : 'Available users:'}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading users...</div>
          ) : availableUsers.length === 0 ? (
            <div className="text-center text-gray-500">No users found</div>
          ) : availableUsers.map((user) => {
            const isAlreadyShared = combinedSharedUsers.some(u => u.id === user.id);
            return (
              <div key={user.id} className={`flex items-center justify-between p-3 border rounded-md ${isAlreadyShared ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${isAlreadyShared ? 'bg-green-400' : 'bg-blue-400'}`}>
                    {getUserInitial(user)}
                  </div>
                  <p className="font-medium text-gray-900">{getUserDisplayName(user)}</p>
                </div>
                {isAlreadyShared ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Shared</span>
                ) : (
                  <button onClick={() => handleShare(user)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                    Share as {selectedPermissionLevel === 'EDITOR' ? 'Editor' : 'Viewer'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

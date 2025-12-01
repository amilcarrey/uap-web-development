import React, { useState, useRef, useEffect } from 'react';
import { useBoardPermissions, useShareBoardMutation, useUpdatePermissionMutation, useRemovePermissionMutation } from '../hooks/usePermissions';
import { useAllUsers } from '../hooks/useAuthMutations';
import { useAuth } from '../context/AuthContext';
import { type BoardPermission, type User } from '../types';

interface BoardSharingProps {
    boardId: number;
    boardName: string;
    userPermission: 'owner' | 'editor' | 'viewer';
}

export function BoardSharing({ boardId, boardName, userPermission }: BoardSharingProps) {
    const [shareEmail, setShareEmail] = useState('');
    const [sharePermission, setSharePermission] = useState<'editor' | 'viewer'>('viewer');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showUsersList, setShowUsersList] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { user: currentUser } = useAuth();
    const { data: permissions = [], isLoading } = useBoardPermissions(boardId);
    const { data: allUsers = [], isLoading: isLoadingUsers } = useAllUsers();
    const shareboardMutation = useShareBoardMutation();
    const updatePermissionMutation = useUpdatePermissionMutation();
    const removePermissionMutation = useRemovePermissionMutation();

    // Cerrar lista de usuarios al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUsersList(false);
            }
        };

        if (showUsersList) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUsersList]);

    // Solo el owner puede compartir o modificar permisos
    const canManagePermissions = userPermission === 'owner';

    const handleSelectUser = (user: User) => {
        setShareEmail(user.email);
        setShowUsersList(false);
    };

    // Filtrar usuarios que ya tienen acceso al board, el usuario actual y por texto de búsqueda
    const availableUsers = allUsers.filter((user: User) => {
        // Excluir el usuario actual
        if (user.id === currentUser?.id) return false;
        
        // Excluir usuarios que ya tienen acceso
        const hasAccess = permissions.some((perm: BoardPermission) => perm.user_id === user.id);
        if (hasAccess) return false;
        
        // Filtrar por texto de búsqueda (email o username)
        if (shareEmail.trim()) {
            const searchText = shareEmail.toLowerCase().trim();
            const emailMatch = user.email.toLowerCase().includes(searchText);
            const usernameMatch = user.username.toLowerCase().includes(searchText);
            return emailMatch || usernameMatch;
        }
        
        return true;
    });

    const handleShareBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shareEmail.trim()) return;

        try {
            await shareboardMutation.mutateAsync({
                board_id: boardId,
                user_email: shareEmail.trim(),
                permission_level: sharePermission
            });
            setShareEmail('');
            setShowUsersList(false);
        } catch (error) {
            console.error('Error sharing board:', error);
        }
    };

    const handleUpdatePermission = async (userId: number, newPermission: 'editor' | 'viewer') => {
        try {
            await updatePermissionMutation.mutateAsync({
                boardId,
                userId,
                permission_level: newPermission
            });
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleRemovePermission = async (userId: number) => {
        if (window.confirm('Are you sure you want to remove this user\'s access?')) {
            try {
                await removePermissionMutation.mutateAsync({ boardId, userId });
            } catch (error) {
                console.error('Error removing permission:', error);
            }
        }
    };

    const getPermissionIcon = (permission: string) => {
        switch (permission) {
            case 'owner': return <i className="fa-solid fa-crown"></i>;
            case 'editor': return <i className="fa-solid fa-pen"></i>;
            case 'viewer': return <i className="fa-solid fa-eye"></i>;
            default: return <i className="fa-solid fa-question"></i>;
        }
    };

    const getPermissionColor = (permission: string) => {
        switch (permission) {
            case 'owner': return 'text-yellow-600 bg-yellow-100';
            case 'editor': return 'text-green-600 bg-green-100';
            case 'viewer': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <i className="fa-solid fa-share-nodes"></i>
                    Share "{boardName}"
                </h3>
                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} transition-transform`}></i>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* Formulario para compartir (solo para owners) */}
                    {canManagePermissions && (
                        <form onSubmit={handleShareBoard} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Share with new user</h4>
                            <div className="space-y-3">
                                {/* Input de email con botón para mostrar lista */}
                                <div className="relative" ref={dropdownRef}>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="Enter user email or search..."
                                            value={shareEmail}
                                            onChange={(e) => {
                                                setShareEmail(e.target.value);
                                                // Mostrar lista automáticamente al escribir
                                                if (e.target.value.trim() && !showUsersList) {
                                                    setShowUsersList(true);
                                                }
                                            }}
                                            onFocus={() => {
                                                // Mostrar lista si hay usuarios disponibles al hacer focus
                                                if (availableUsers.length > 0) {
                                                    setShowUsersList(true);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                    setShowUsersList(false);
                                                }
                                            }}
                                            className="flex-1 p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowUsersList(!showUsersList)}
                                            className={`px-3 py-2 rounded transition-colors ${
                                                showUsersList 
                                                    ? 'bg-blue-200 text-blue-700' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                            title={showUsersList ? "Hide users list" : "Show available users"}
                                        >
                                            <i className={`fa-solid ${showUsersList ? 'fa-chevron-up' : 'fa-users'}`}></i>
                                        </button>
                                    </div>
                                    
                                    {/* Lista desplegable de usuarios */}
                                    {showUsersList && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                            {isLoadingUsers ? (
                                                <div className="p-3 text-center text-gray-500">
                                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                                    Loading users...
                                                </div>
                                            ) : availableUsers.length === 0 ? (
                                                <div className="p-3 text-center text-gray-500">
                                                    {shareEmail.trim() ? (
                                                        <>
                                                            <i className="fa-solid fa-search mr-2"></i>
                                                            No users found matching "{shareEmail}"
                                                        </>
                                                    ) : (
                                                        'No available users to share with'
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {shareEmail.trim() && (
                                                        <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                                                            <i className="fa-solid fa-filter mr-1"></i>
                                                            Showing {availableUsers.length} user{availableUsers.length !== 1 ? 's' : ''} matching "{shareEmail}"
                                                        </div>
                                                    )}
                                                    {availableUsers.map((user: User) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => handleSelectUser(user)}
                                                            className="w-full p-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="font-medium">{user.username}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Selector de permisos y botón de compartir */}
                                <div className="flex gap-2">
                                    <select
                                        value={sharePermission}
                                        onChange={(e) => setSharePermission(e.target.value as 'editor' | 'viewer')}
                                        className="p-2 border border-gray-300 rounded"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={shareboardMutation.isPending}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                    >
                                        {shareboardMutation.isPending ? 'Sharing...' : 'Share'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Lista de usuarios con acceso */}
                    <div>
                        <h4 className="font-medium mb-3">Users with access</h4>
                        
                        {isLoading ? (
                            <div className="flex items-center text-gray-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                Loading permissions...
                            </div>
                        ) : permissions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No shared users yet</p>
                        ) : (
                            <div className="space-y-2">
                                {permissions.map((permission: BoardPermission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm ${getPermissionColor(permission.permission_level)}`}>{getPermissionIcon(permission.permission_level)}</span>
                                            <div>
                                                <div className="font-medium">
                                                    {permission.username || 'Unknown User'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {permission.email}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission.permission_level)}`}>
                                                {permission.permission_level}
                                            </span>
                                            
                                            {canManagePermissions && permission.permission_level !== 'owner' && (
                                                <div className="flex gap-1">
                                                    {permission.permission_level !== 'editor' && (
                                                        <button
                                                            onClick={() => handleUpdatePermission(permission.user_id, 'editor')}
                                                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                            title="Make Editor"
                                                        >
                                                            Editor
                                                        </button>
                                                    )}
                                                    {permission.permission_level !== 'viewer' && (
                                                        <button
                                                            onClick={() => handleUpdatePermission(permission.user_id, 'viewer')}
                                                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                            title="Make Viewer"
                                                        >
                                                            Viewer
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemovePermission(permission.user_id)}
                                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                        title="Remove Access"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información sobre permisos */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        <strong>Permission levels:</strong><br/>
                        <i className="fa-solid fa-crown text-yellow-600 bg-yellow-100"></i> <strong className='text-yellow-600'>Owner:</strong> Full control, can share and manage permissions<br/>
                        <i className="fa-solid fa-pen text-green-600 bg-green-100"></i> <strong className='text-green-600'>Editor:</strong> Can view and edit todos<br/>
                        <i className="fa-solid fa-eye text-blue-600 bg-blue-100"></i> <strong className='text-blue-600'>Viewer:</strong> Can only view todos
                    </div>
                </div>
            )}
        </div>
    );
}

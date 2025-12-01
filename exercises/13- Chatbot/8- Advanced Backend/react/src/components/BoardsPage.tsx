import React, { useState, useRef, useEffect } from 'react';
import { useAccessibleBoards } from '../hooks/usePermissions';
import { useAppSelector } from '../store/hooks';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { type BoardWithPermissions } from '../types';
import { useCreateBoard } from '../hooks/useBoardMutations';
import { ChatBot } from './ChatBot';

export const BoardsPage: React.FC = () => {
    const { data: accessibleBoards = [], isLoading } = useAccessibleBoards();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);
    const { logout } = useAuth();
    
    // Estado para el input inline de crear board
    const [isCreating, setIsCreating] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Hook para crear board
    const createBoardMutation = useCreateBoard();

    // Autofocus cuando se activa el modo de creación
    useEffect(() => {
        if (isCreating && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isCreating]);

    const handleStartCreating = () => {
        setIsCreating(true);
        setNewBoardName('');
    };

    const handleCancelCreating = () => {
        setIsCreating(false);
        setNewBoardName('');
    };

    const handleCreateBoard = async () => {
        const trimmedName = newBoardName.trim();
        if (!trimmedName) {
            return;
        }

        try {
            await createBoardMutation.mutateAsync(trimmedName);
            setIsCreating(false);
            setNewBoardName('');
        } catch (error) {
            console.error('Error creating board:', error);
            // El error se manejará automáticamente por React Query
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreateBoard();
        } else if (e.key === 'Escape') {
            handleCancelCreating();
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await logout();
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-600">Loading boards...</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Header con botones de navegación */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Todo Boards</h2>
                    <p className="text-lg text-gray-600">
                        Manage your boards and organize your tasks
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Input inline para crear board */}
                    {isCreating ? (
                        <div className="flex items-center gap-2 bg-white border border-orange-300 rounded-lg px-3 py-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Board name..."
                                className="border-none outline-none text-sm min-w-0 flex-1"
                                style={{ minWidth: '150px' }}
                                disabled={createBoardMutation.isPending}
                            />
                            
                            <button
                                onClick={handleCreateBoard}
                                disabled={!newBoardName.trim() || createBoardMutation.isPending}
                                className="text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                title="Create Board"
                            >
                                {createBoardMutation.isPending ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-check"></i>
                                )}
                            </button>
                            
                            <button
                                onClick={handleCancelCreating}
                                disabled={createBoardMutation.isPending}
                                className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                title="Cancel"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleStartCreating}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            title="Create New Board"
                        >
                            <i className="fa-solid fa-plus"></i>
                            New Board
                        </button>
                    )}
                    
                    {/* Botón settings */}
                    <Link
                        to="/settings"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        title="Settings"
                    >
                        <i className="fa-solid fa-cog"></i>
                        Settings
                    </Link>
                    
                    {/* Botón logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        title="Logout"
                    >
                        <i className="fa-solid fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>

            {accessibleBoards.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {accessibleBoards.map((board: BoardWithPermissions) => (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            className={`block p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                                currentBoardId === board.id 
                                    ? 'border-orange-500 bg-orange-50 shadow-md' 
                                    : 'border-gray-200 bg-white hover:border-orange-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {board.name}
                                </h3>
                                {currentBoardId === board.id && (
                                    <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                                        Current
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    board.user_permission === 'owner' ? 'bg-yellow-100 text-yellow-800' :
                                    board.user_permission === 'editor' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {board.user_permission === 'owner' ? (
                                        <><i className="fa-solid fa-crown mr-1"></i>Owner</>
                                    ) : board.user_permission === 'editor' ? (
                                        <><i className="fa-solid fa-pen mr-1"></i>Editor</>
                                    ) : (
                                        <><i className="fa-solid fa-eye mr-1"></i>Viewer</>
                                    )}
                                </span>
                                
                                <span className="text-xs">
                                    Created: {new Date(board.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {board.owner && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Owner: {board.owner.username}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl text-gray-300 mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No boards yet</h3>
                    <p className="text-gray-500 mb-6">
                        Create your first board to start organizing your tasks
                    </p>
                    <button
                        onClick={handleStartCreating}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Create Your First Board
                    </button>
                </div>
            )}
            
            {/* ChatBot Flotante - Esquina Inferior Izquierda */}
            <ChatBot boardId={0} />
        </div>
    );
};

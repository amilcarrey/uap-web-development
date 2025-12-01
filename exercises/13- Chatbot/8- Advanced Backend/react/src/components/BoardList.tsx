// import { useBoards } from '../hooks/useBoards';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startCreatingBoard } from '../store/uiSlice';
import type { BoardWithPermissions } from '../types';
import { Link } from "react-router-dom";
import { BoardItem } from './BoardItem';
import { useAccessibleBoards } from '../hooks/usePermissions';

export function BoardsList() {
    const dispatch = useAppDispatch();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);

    // ✅ Usar tableros accesibles (incluye propios y compartidos)
    const { data: accessibleBoards = [], isLoading } = useAccessibleBoards();

    const handleCreateBoard = () => {
        dispatch(startCreatingBoard());
    }

    return (
        <div className="flex items-center bg-[rgba(243,243,243,255)]">
            {accessibleBoards.map((board: BoardWithPermissions) => (
                <BoardItem
                    key={board.id}
                    board={board}
                    currentBoardId={currentBoardId}
                    isLoading={isLoading}
                    userPermission={board.user_permission || 'owner'}
                />
            ))}

            {/* Create new board */}
            <button
                onClick={handleCreateBoard}
                className="flex-shrink-0 bg-[rgba(173,131,131,255)] text-[rgba(243,243,243,255)] font-inter  border-0 py-2 px-4 hover:bg-[rgb(202,68,68)] hover:text-white transition-colors duration-500"
            >
                <span className="text-4xl">+</span>
            </button>

            {/* Settings */}
            <Link 
                to="/settings"                
                className="flex-shrink-0 bg-[rgb(116,178,202)] text-[rgba(243,243,243,255)] font-inter border-0 py-2 px-2 hover:bg-[rgb(202,68,68)] hover:text-white transition-colors duration-500"
            >
                <span className="text-4xl">⚙️</span>
            </Link>
        </div>
    )
}
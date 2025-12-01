import type { Board, BoardWithPermissions } from '../types';
import { Link } from "react-router-dom";
import { useAppDispatch } from '../store/hooks';
import { addNotification } from '../store/uiSlice';
import { useDeleteBoard } from '../hooks/useBoardMutations';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { setCurrentBoardId } from '../store/uiSlice';

type BoardItemProps = {
    board: Board | BoardWithPermissions;
    currentBoardId: number | null;
    isLoading: boolean;
    userPermission?: 'owner' | 'editor' | 'viewer';
}
export function BoardItem({ board, currentBoardId, isLoading, userPermission = 'owner' }: BoardItemProps) {
        const dispatch = useAppDispatch()
        const deleteMutation = useDeleteBoard();
        const queryClient = useQueryClient();
        const navigate = useNavigate();
        
        // ✅ Función para obtener el ícono del permiso
        const getPermissionIcon = (permission: 'owner' | 'editor' | 'viewer') => {
            switch (permission) {
                case 'owner':
                    return <i className="fa-solid fa-crown"></i>;
                case 'editor':
                    return <i className="fa-solid fa-pen"></i>;
                case 'viewer':
                    return <i className="fa-solid fa-eye"></i>;
                default:
                    return <i className="fa-solid fa-question"></i>;
            }
        };

        // ✅ Función para obtener el color del permiso
        const getPermissionColor = (permission: 'owner' | 'editor' | 'viewer') => {
            switch (permission) {
                case 'owner':
                    return 'text-yellow-600';
                case 'editor':
                    return 'text-green-600';
                case 'viewer':
                    return 'text-blue-600';
                default:
                    return 'text-gray-600';
            }
        };
        

        const handleSelect = () => {
            if (isLoading) return;
            dispatch(addNotification({
                message: `Board ${board.name} selected successfully!`,
                type: 'success'
            }))
        }

        const handleDelete = async () => {
            // verificar si estamos borrando el tablero seleccionado actualmente
            const isCurrentBoard = currentBoardId === board.id;

            try {
                await deleteMutation.mutateAsync(board.id)

                // mostrar la notifiacion de exito
                dispatch(addNotification({
                message: `Board "${board.name}" deleted successfully!`,
                type: 'success' 
                }))

                if (isCurrentBoard) {
                    // ✅ Invalidar tanto la query de boards básicos como la de accessible boards
                    await queryClient.invalidateQueries({ queryKey: ['boards'] });
                    await queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });

                    // ✅ Intentar obtener tableros accesibles primero
                    let boards = queryClient.getQueryData(['accessible-boards']) as BoardWithPermissions[] || [];
                    
                    // Si no hay accesibles, intentar con los básicos
                    if (boards.length === 0) {
                        boards = queryClient.getQueryData(['boards']) as Board[] || [];
                    }

                    console.log("Boards after deletion:", boards);

                    if (boards && boards.length > 0) {
                        navigate(`/boards/${boards[0].id}`);
                        dispatch(setCurrentBoardId(boards[0].id));
                    } else {
                        navigate('/'); // Redirigir a la página principal si no hay tableros
                    }
            } else {
                // ✅ Si no es el board actual, solo invalidar las queries
                await queryClient.invalidateQueries({ queryKey: ['boards'] });
                await queryClient.invalidateQueries({ queryKey: ['accessible-boards'] });
            }
            } catch (error) {
            console.error("Error deleting board", error);
            dispatch(addNotification({
                message: `Error deleting board: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error' 
            }))
        }
        
            
        }
    

    return (
        <div
            className={`flex flex-1 min-w-0 relative border-b-4 ${
            currentBoardId === board.id
                ? 'border-orange-500 opacity-100'
                : 'border-transparent opacity-50'
            }`}
        >
            <Link
            onClick={handleSelect}
            key={board.id}
            to={`/boards/${board.id}`}
            className={`flex-grow text-center font-montserrat font-bold text-2xl tracking-wider py-2 px-2 m-0 
                hover:opacity-100 cursor-pointer transition-opacity duration-500 relative`}
            >
            <div className="flex items-center justify-center gap-2">
                <span>{board.name}</span>
                {/* ✅ Indicador de permiso */}
                <span 
                className={`text-sm ${getPermissionColor(userPermission)}`}
                title={`Your permission: ${userPermission}`}
                >
                {getPermissionIcon(userPermission)}
                </span>
            </div>
            </Link>

            {/* ✅ Solo mostrar botón de eliminar si el usuario es owner */}
            {userPermission === 'owner' && (
            <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer ${
                deleteMutation.isPending ? 'opacity-50' : ''
                }`}
                title="Delete Board"
            >
                {deleteMutation.isPending ? '...' : <i className="fa-solid fa-trash"></i>}
            </button>
            )}
        </div>
    )
}
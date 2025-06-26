// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// Importaciones de tus componentes y hooks existentes
import NotificationToast from './components/NotificationToast';
import useNotificationStore from './store/notificationStore';
import BoardView from './components/BoardView';
import SettingsPage from './components/SettingsPage'; // Importa el nuevo componente

// --- NUEVAS IMPORTACIONES PARA AUTENTICACIÓN ---
import { useAuth } from './context/AuthContext'; // Importa el hook de autenticación
import AuthPage from './pages/AuthPage'; // Importa la página de autenticación

// --- HOOKS DE BOARDS (AÚN NO MODIFICADOS PARA AUTENTICACIÓN DIRECTA EN EL HOOK) ---
// NOTA: Estos hooks aún no están adaptados para manejar el `api` de Axios o errores 401.
// Lo haremos en un paso posterior una vez que la estructura de autenticación esté funcionando.
import { useBoards, useCreateBoard, useDeleteBoard } from './hooks/useTasks'; // Asegúrate que estos sean los hooks correctos para boards

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const hasNotified = React.useRef(false); // Para asegurar que la notificación se muestre solo una vez

    // El useEffect debe estar en el nivel superior del componente.
    // Usamos hasNotified para controlar cuándo se dispara la notificación.
    React.useEffect(() => {
        // Si no está autenticado, no está cargando, Y NO hemos notificado aún,
        // entonces mostramos la notificación.
        if (!isAuthenticated && !loading && !hasNotified.current) {
            showNotification('You need to be logged in to view this page.', 'error');
            hasNotified.current = true; // Marca que ya notificamos
        }
        // Cuando el usuario se autentica de nuevo, reseteamos la bandera
        if (isAuthenticated) {
            hasNotified.current = false;
        }
    }, [isAuthenticated, loading, showNotification]); // Dependencias del useEffect

    // Si aún está cargando el estado de autenticación, muestra un spinner o mensaje
    if (loading) {
        return <div className="text-center mt-20 text-gray-500">Loading application...</div>;
    }

    // Si no está autenticado, redirige a la página de login
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // Si está autenticado, renderiza los componentes hijos
    return children;
};


function App() {
    // Hooks de autenticación
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const queryClient = useQueryClient();

    // Hooks de boards (que eventualmente usarán la instancia 'api' autenticada)
    const { data: boards, isLoading: isLoadingBoards, isError: isErrorBoards, error: boardsError } = useBoards();
    const createBoardMutation = useCreateBoard();
    const deleteBoardMutation = useDeleteBoard();

    const handleCreateBoard = () => {
        if (!isAuthenticated) { // Extra check, though route is protected
            showNotification('Please log in to create boards.', 'warning');
            return;
        }
        const boardName = prompt("Enter new board name:");
        if (boardName && boardName.trim() !== '') {
            createBoardMutation.mutate(boardName, {
                onSuccess: (data) => {
                    showNotification(`Board '${data.board.name}' created!`, 'success');
                    // Invalida la caché de boards para que se refetch (useBoards)
                    queryClient.invalidateQueries({ queryKey: ['boards'] });
                },
                onError: (err) => {
                    const errorMessage = err.response?.data?.message || 'Error creating board.';
                    showNotification(`Error creating board: ${errorMessage}`, 'error');
                },
            });
        } else {
            showNotification('Board name cannot be empty.', 'warning');
        }
    };

    const handleDeleteBoard = (boardId) => {
        if (!isAuthenticated) { // Extra check
            showNotification('Please log in to delete boards.', 'warning');
            return;
        }
        if (window.confirm("Are you sure you want to delete this board and all its tasks?")) {
            deleteBoardMutation.mutate(boardId, {
                onSuccess: () => {
                    showNotification('Board deleted!', 'success');
                    // Invalida la caché de boards para que se refetch
                    queryClient.invalidateQueries({ queryKey: ['boards'] });
                    // Si el tablero eliminado era el default o el actual, redirige a la raíz
                    // o al primer tablero disponible si lo hay
                    // Aquí es crucial invalidar la caché de tareas si existían para ese boardId
                    queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
                    // Considerar cómo manejar la redirección si el tablero actual se elimina.
                    // Por ahora, React Router podría manejarlo con el defaultBoardId o Navigate a "/"
                },
                onError: (err) => {
                    const errorMessage = err.response?.data?.message || 'Error deleting board.';
                    showNotification(`Error deleting board: ${errorMessage}`, 'error');
                },
            });
        }
    };

    // Esto intenta encontrar un boardId predeterminado.
    // Si no está autenticado, boards será null o undefined, por lo que defaultBoardId será null.
    const defaultBoardId = boards && boards.length > 0 ? boards[0].id : null;

    // Si el usuario está autenticado y authLoading ya terminó, pero no hay boards,
    // es cuando puede mostrar el mensaje de crear un board.
    const showNoBoardsMessage = isAuthenticated && !authLoading && !isLoadingBoards && boards && boards.length === 0;

    // Maneja el logout del usuario
    const handleLogout = async () => {
        await logout();
        showNotification('Logged out successfully!', 'info');
        queryClient.clear(); // Limpia toda la caché de React Query al hacer logout
    };

    return (
        <Router>
            <div className="font-sans bg-gray-100 min-h-screen overflow-y-auto">
                <header className="text-center py-2 flex justify-between items-center px-4">
                    <h1 className="text-[25px] bg-gradient-to-r from-cyan-400 to-blue-700 bg-clip-text text-transparent w-fit">TODO</h1>
                    <nav className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-700 text-sm">Welcome, {user?.username || 'User'}!</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-700 transition duration-200 text-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/auth"
                                    className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition duration-200 text-sm"
                                >
                                    Login / Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="container mx-auto px-4">
                    {/* Sección de Boards visible solo si está autenticado y no está cargando */}
                    {isAuthenticated && !authLoading && (
                        <section className="flex flex-wrap items-center justify-center gap-2 my-4 p-2 bg-gray-200 rounded-md shadow-sm">
                            <h2 className="text-xl font-bold text-gray-700 mr-4">Boards:</h2>
                            {isLoadingBoards ? (
                                <p>Loading boards...</p>
                            ) : isErrorBoards ? (
                                <p className="text-red-500">Error: {boardsError.message}</p>
                            ) : boards.length === 0 ? (
                                <p className="text-gray-500">No boards. Create one!</p>
                            ) : (
                                boards.map((board) => (
                                    <div key={board.id} className="flex items-center gap-1">
                                        <Link
                                            to={`/boards/${board.id}`}
                                            className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition duration-200 text-sm"
                                        >
                                            {board.name}
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteBoard(board.id)}
                                            className="text-red-500 hover:text-red-700 text-xl font-bold leading-none p-0.5 rounded-full"
                                            title="Delete Board"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                            <button
                                onClick={handleCreateBoard}
                                className="px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-700 transition duration-200 text-sm"
                            >
                                + Add Board
                            </button>
                            <Link
                                to="/settings"
                                className="ml-4 px-3 py-1 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition duration-200 text-sm"
                            >
                                Settings
                            </Link>
                        </section>
                    )}

                    <Routes>
                        {/* Ruta para autenticación (Login/Register) */}
                        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />

                        {/* Rutas protegidas - Solo accesibles si isAuthenticated es true */}
                        <Route path="/" element={
                            <PrivateRoute>
                                {/* Aquí la lógica de redirección inicial si no hay boards */}
                                {defaultBoardId && isAuthenticated ? (
                                    <Navigate to={`/boards/${defaultBoardId}`} replace />
                                ) : showNoBoardsMessage ? (
                                    <div className="text-center text-gray-600 mt-10">
                                        No boards available. Please create a new board to start.
                                    </div>
                                ) : (
                                    // Si está autenticado pero no hay boards, o si está cargando los boards, no redirige aún
                                    // Podemos poner un spinner o dejar que BoardView maneje su propio estado de carga
                                    isAuthenticated ? null : <Navigate to="/auth" replace /> // Redirige si no está autenticado
                                )}
                            </PrivateRoute>
                        } />
                        <Route path="/boards/:boardId" element={
                            <PrivateRoute>
                                <BoardView />
                            </PrivateRoute>
                        } />
                        <Route path="/settings" element={
                            <PrivateRoute>
                                <SettingsPage />
                            </PrivateRoute>
                        } />

                        {/* Ruta comodín: redirige a la raíz (que luego redirige a /auth si no está logueado) */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <NotificationToast />
            </div>
        </Router>
    );
}

export default App;
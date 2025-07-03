import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCurrentBoardId } from '../store/uiSlice'
import { useQueryClient } from '@tanstack/react-query'
import { type Board } from '../types'
import { Link } from 'react-router-dom'
import { useBoards } from '../hooks/useBoards'
import { useAuth } from '../context/AuthContext'
import { useUpdateSettingsMutation } from '../hooks/useAuthMutations'
import { useState, useEffect } from 'react'
import { BoardSharing } from '../components/BoardSharing'
import { useAccessibleBoards } from '../hooks/usePermissions'



export function Settings() {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const currentBoardId = useAppSelector(state => state.ui.currentBoardId)

    // ✅ Auth hooks para configuraciones del usuario
    const { settings } = useAuth()
    const updateSettingsMutation = useUpdateSettingsMutation()

    // ✅ Estado local para TODAS las configuraciones del usuario (ahora unificadas)
    const [userRefreshInterval, setUserRefreshInterval] = useState(settings?.refresh_interval || 5000)
    const [userUppercaseDescriptions, setUserUppercaseDescriptions] = useState(settings?.uppercase_descriptions || false)
    const [userTodosPerPage, setUserTodosPerPage] = useState(settings?.todos_per_page || 10)

    // ✅ Sincronizar estado local cuando cambien las configuraciones del usuario
    useEffect(() => {
        if (settings) {
            setUserRefreshInterval(settings.refresh_interval || 5000)
            setUserUppercaseDescriptions(settings.uppercase_descriptions || false)
            setUserTodosPerPage(settings.todos_per_page || 10)
        }
    }, [settings])

    // Intentar obtener los datos de los tableros desde el cache
    const cachedBoards = queryClient.getQueryData<Board[]>(['boards']) || [];

    // ✅ Usar tableros accesibles (incluye propios y compartidos)
    const { data: accessibleBoards = [], isLoading: isLoadingAccessible } = useAccessibleBoards();
    
    // Si no hay datos en el cache, hacer fetch de tableros básicos como fallback
    const { data: fetchedBoards = [], isLoading: isLoadingBasic} = useBoards({
        enabled: cachedBoards.length === 0 && accessibleBoards.length === 0
    })

    // Usar tableros accesibles si están disponibles, sino usar los básicos
    const boards = accessibleBoards.length > 0 ? accessibleBoards : 
                   cachedBoards.length > 0 ? cachedBoards : fetchedBoards;
    const isLoading = isLoadingAccessible || isLoadingBasic;
    
    // ✅ Handler unificado para guardar TODAS las configuraciones del usuario en el backend
    const handleSaveAllSettings = async () => {
        try {
            // ✅ Asegurar tipos correctos antes de enviar
            const settingsToSave = {
                refresh_interval: Number(userRefreshInterval),
                uppercase_descriptions: Boolean(userUppercaseDescriptions),
                todos_per_page: Number(userTodosPerPage)
            };
            
            console.log('💾 Saving settings with correct types:', settingsToSave);
            await updateSettingsMutation.mutateAsync(settingsToSave);
            console.log('✅ All user settings saved successfully!');
        } catch (error) {
            console.error('❌ Error saving user settings:', error);
        }
    }

    // ✅ Handlers para configuraciones del usuario (Backend)
    const handleUserRefreshIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valueInMs = parseInt(e.target.value, 10) * 1000;
        setUserRefreshInterval(valueInMs);
    }
    
    const handleUserUppercaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ✅ Asegurar que siempre sea booleano
        const isChecked = Boolean(e.target.checked);
        console.log('🔤 Uppercase setting changed to:', isChecked, typeof isChecked);
        setUserUppercaseDescriptions(isChecked);
    }

    const handleUserTodosPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setUserTodosPerPage(value);
    }

    const handleBoardSwitch = (boardId: number) => {
        dispatch(setCurrentBoardId(boardId))
    }
    
    return (
        <div className="w-1/2 my-5 p-4 bg-[rgba(241,236,230,255)] rounded-3xl">

            <h2 className="flex justify-center text-xl font-bold mb-4">Settings</h2>
            
            {/* ✅ SECCIÓN UNIFICADA: Todas las configuraciones del usuario (Backend) */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-3 text-blue-700">User Settings</h3>
                <p className="text-sm text-blue-600 mb-4">These settings are saved on the server and will be applied across all your devices.</p>
                
                <div className="mb-4">
                    <label htmlFor="userTodosPerPage" className="block mb-2 font-medium">
                        Items Per Page:
                    </label>
                    <select 
                        id="userTodosPerPage" 
                        className="p-2 rounded border border-gray-300 w-full"
                        onChange={handleUserTodosPerPageChange}
                        value={userTodosPerPage}
                    >
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <small className="text-gray-500 text-xs">Number of tasks to display per page</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="userRefreshInterval" className="block mb-2 font-medium">
                        Auto-refresh interval (seconds):
                    </label>
                    <input 
                        id="userRefreshInterval" 
                        type="number" 
                        className="p-2 rounded border border-gray-300 w-full"
                        onChange={handleUserRefreshIntervalChange}
                        value={userRefreshInterval / 1000}
                        min="1"
                        max="300"
                    />
                    <small className="text-gray-500 text-xs">How often to automatically refresh your tasks</small>
                </div>
                
                <div className="mb-4">
                    <label htmlFor="userUppercaseDescriptions" className="flex items-center mb-2 font-medium">
                        <input 
                            id="userUppercaseDescriptions" 
                            type="checkbox" 
                            className="mr-2 h-5 w-5"
                            onChange={handleUserUppercaseChange}
                            checked={userUppercaseDescriptions}
                        />
                        Show task descriptions in uppercase
                    </label>
                    <small className="text-gray-500 text-xs">Display all task descriptions in uppercase letters</small>
                </div>

                <button 
                    onClick={handleSaveAllSettings}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                </button>
                
                {updateSettingsMutation.error && (
                    <div className="mt-2 text-red-600 text-sm">
                        Error: {updateSettingsMutation.error.message}
                    </div>
                )}
                
                {updateSettingsMutation.isSuccess && (
                    <div className="mt-2 text-green-600 text-sm">
                        ✅ Settings saved successfully!
                    </div>
                )}
            </div>
            
            <hr className="my-6 border-gray-300" />

            {/* <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Boards</h3>
                <ul className="list-disc pl-5">
                    {boards.map(board => (
                        <li key={board.id} className="mb-1">
                            {board.name}
                        </li>
                    ))}
                </ul>
            </div> */}
            {/* Boards List Section */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Available Boards</h3>
                
                {isLoading ? (
                    <div className="flex items-center text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500 mr-2"></div>
                            Loading boards...
                    </div>
                ) : boards.length > 0 ? (
                    <div className="space-y-2">
                        {boards.map((board) => (
                            <div 
                                key={board.id} 
                                className={`p-3 rounded-lg border transition-colors ${
                                    currentBoardId === board.id 
                                        ? 'bg-orange-100 border-orange-300 font-medium' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm font-medium">
                                            {board.name}
                                        </span>
                                        {currentBoardId === board.id && (
                                            <span className="ml-2 text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs text-gray-500">
                                            ID: {board.id}
                                        </div>
                                        {currentBoardId !== board.id && (
                                            <button
                                                onClick={() => handleBoardSwitch(board.id)}
                                                className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                                            >
                                                Switch
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {board.created_at && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Created: {new Date(board.created_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm p-3 bg-gray-50 rounded">
                        No boards available. Please create a board to manage your tasks.
                    </div>
                )}
            </div>

            {/* ✅ Board Sharing Section */}
            {boards.length > 0 && (
                <div className="mb-6">
                    <hr className="my-6 border-gray-300" />
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-users"></i>
                        Board Sharing & Permissions
                    </h3>
                    <div className="space-y-4">
                        {boards.map((board) => {
                            // ✅ Determinar el permiso del usuario en este tablero
                            const userPermission = 'user_permission' in board 
                                ? (board as any).user_permission || 'owner'
                                : 'owner'; // Default para tableros propios
                                
                            return (
                                <BoardSharing
                                    key={board.id}
                                    boardId={board.id}
                                    boardName={board.name}
                                    userPermission={userPermission}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Back to Boards Button */}
            <div className="flex justify-center mt-8">
                <Link
                    to={`/boards/${currentBoardId}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Boards
                </Link>
            </div>

        </div>
    )
}
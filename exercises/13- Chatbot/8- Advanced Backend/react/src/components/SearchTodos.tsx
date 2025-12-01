import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addNotification, setCurrentPage, setSearch } from "../store/uiSlice";


export function SearchTodos() {
    const dispatch = useAppDispatch();
    const searchText = useAppSelector((state) => state.ui.searchText);
    const [localSearch, setLocalSearch] = useState(searchText || '');
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);

    // Debounce para evitar demasiadas actualizaciones
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchText) {
                dispatch(setSearch(localSearch));
                dispatch(setCurrentPage(1)); 

                if (localSearch.trim()) {
                    dispatch(addNotification({
                        message: `Searching for "${localSearch}"`,
                        type: 'info'
                    }));
                }
            }
        }, 500)

        return () => clearTimeout(timer);
    }, [localSearch, dispatch, searchText]);

    // Limpiar búsqueda al cambiar de tablero
    useEffect(() => {
        setLocalSearch('');
        dispatch(setSearch(''));
        dispatch(setCurrentPage(1)); // Reset to first page
    }, [currentBoardId])

    const handleClear = () => {
        setLocalSearch('');
        dispatch(setSearch(''));
        dispatch(setCurrentPage(1)); // Reset to first page
        dispatch(addNotification({
            message: "Search cleared",
            type: 'info'
        }));
    };

    return(
        <div className="flex items-center gap-2 my-4">
            <div className="relative flex-grow">
                <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                {localSearch && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                )}
            </div>
            {searchText && (
                <div className="text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full">
                    Searching: "{searchText}"
                </div>
            )}
        </div>
    )
}
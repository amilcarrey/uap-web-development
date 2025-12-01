import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type filterType, type TodoItem } from "../types"

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ModalState {
    isOpen: boolean;
    type: 'edit' | null;
    todo: TodoItem | null;
}

interface EditingState {
    isEditing: boolean;
    todoBeingEdited: TodoItem | null;
}

interface PaginationState {
    currentPage: number;
    // ✅ itemsPerPage removed - now using user settings
}

// ✅ AppConfigState removed - using user settings for all config now

interface UIState {
    notifications: Notification[];
    modal: ModalState;
    editing: EditingState;
    filter: filterType;
    searchText?: string; 
    pagination: PaginationState;
    currentBoardId: number | null;
    isCreatingBoard: boolean;
    // ✅ config removed - using user settings
}

const initialState: UIState = {
    notifications: [],
    modal: {
        isOpen: false,
        type: null,
        todo: null
    },
    editing: {
        isEditing: false,
        todoBeingEdited: null
    },
    filter: 'all',
    searchText: '',
    pagination: {
        currentPage: 1
        // ✅ itemsPerPage removed - now using user settings todos_per_page
    },
    currentBoardId: null,
    isCreatingBoard: false
    // ✅ config removed - using user settings for refetchInterval and uppercaseDescriptions
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<{message: string; type: Notification['type'], duration?: number}>) => {
            const notification = {
                id: crypto.randomUUID(),
                message: action.payload.message,
                type: action.payload.type,
                duration: action.payload.duration || 3000
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        },

        openModal: (state, action: PayloadAction<{type: ModalState['type']; todo: ModalState['todo']}>) => {
            state.modal.isOpen = true;
            state.modal.type = action.payload.type;
            state.modal.todo = action.payload.todo;
        },
        closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.type = null;
            state.modal.todo = null;
        },
        
        // Acciones para manejo de edición directa
        startEditing: (state, action: PayloadAction<TodoItem>) => {
            state.editing.isEditing = true;
            state.editing.todoBeingEdited = action.payload;
        },
        cancelEditing: (state) => {
            state.editing.isEditing = false;
            state.editing.todoBeingEdited = null;
        },

        setFilter: (state, action: PayloadAction<filterType>) => {
            state.filter = action.payload;
        },

        setSearch: (state, action: PayloadAction<string>) => {
            state.searchText = action.payload;
        },
        clearSearch: (state) => {
            state.searchText = '';
        },

        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.pagination.currentPage = action.payload;
        },
        // ✅ setItemsPerPage removed - now using user settings todos_per_page

        startCreatingBoard: (state) => {
            state.isCreatingBoard = true;
        },
        cancelCreatingBoard: (state) => {
            state.isCreatingBoard = false;
        },
        setCurrentBoardId: (state, action: PayloadAction<number>) => {
            state.currentBoardId = action.payload;
            state.pagination.currentPage = 1;
            state.filter = 'all'; // Resetear filtro al cambiar de tablero
        },
        clearCurrentBoardId: (state) => {
            state.currentBoardId = null;
            state.pagination.currentPage = 1;
            state.filter = 'all'; // Resetear filtro al deseleccionar tablero
        },
        resetUIState: (state) => {
            // ✅ Resetear todo el estado UI al hacer logout
            state.currentBoardId = null;
            state.pagination.currentPage = 1;
            state.filter = 'all';
            state.searchText = '';
            state.isCreatingBoard = false;
            state.notifications = [];
            state.modal = {
                isOpen: false,
                type: null,
                todo: null
            };
            state.editing = {
                isEditing: false,
                todoBeingEdited: null
            };
        }
        
        // ✅ Config actions removed - now using user settings:
        // - setRefetchInterval -> use user settings refresh_interval
        // - setUppercaseDescriptions -> use user settings uppercase_descriptions

        
    }
});

export const { 
    addNotification, 
    removeNotification, 
    openModal, 
    closeModal,
    startEditing,
    cancelEditing,
    setFilter,
    setSearch,
    clearSearch,
    setCurrentPage,
    // ✅ setItemsPerPage removed - now using user settings todos_per_page
    startCreatingBoard,
    cancelCreatingBoard,
    setCurrentBoardId,
    clearCurrentBoardId,
    resetUIState
    // ✅ setRefetchInterval and setUppercaseDescriptions removed - now using user settings
} = uiSlice.actions;

export default uiSlice.reducer;
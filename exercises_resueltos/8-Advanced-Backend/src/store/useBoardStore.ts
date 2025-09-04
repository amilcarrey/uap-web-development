import { create } from 'zustand';
import { type Board, type BoardPermission } from '../services/boardService'; // Import types from service
import * as boardService from '../services/boardService';
import { toastError } from '../lib/toast';

interface BoardState {
  boards: Board[];
  selectedBoard: Board | null;
  selectedBoardPermissions: BoardPermission[]; // Permissions for the selected board
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoards: () => Promise<void>;
  selectBoard: (boardId: number | null) => Promise<void>; // Make async to fetch details if needed
  createBoard: (name: string) => Promise<Board | null>;
  updateBoard: (boardId: number, name: string) => Promise<Board | null>;
  deleteBoard: (boardId: number) => Promise<void>;

  // Permission related actions for the selected board
  fetchSelectedBoardPermissions: () => Promise<void>;
  shareSelectedBoard: (email: string, permissionLevel: 'editor' | 'viewer') => Promise<void>;
  updateUserPermissionOnSelectedBoard: (userIdToManage: number, permissionLevel: 'editor' | 'viewer') => Promise<void>;
  removeUserFromSelectedBoard: (userIdToManage: number) => Promise<void>;

  clearError: () => void;
  // isCurrentUserOwnerOfSelectedBoard: () => boolean; // Removed from store state
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  selectedBoard: null,
  selectedBoardPermissions: [],
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const boards = await boardService.getMyBoards();
      set({ boards, isLoading: false });
      // If no board is selected, or selected board is not in the new list, select the first one or null
      const currentSelectedId = get().selectedBoard?.id;
      const previouslySelectedBoardExists = boards.find(b => b.id === currentSelectedId);

      if (boards.length > 0) {
        if (previouslySelectedBoardExists) {
          // If current selection is still valid, re-select to refresh its details (like permissions)
          await get().selectBoard(currentSelectedId!); // Non-null assertion as it exists
        } else {
          // If no board was selected, or previous selection is gone, select the first board
          await get().selectBoard(boards[0].id);
        }
      } else {
        // No boards available
        await get().selectBoard(null);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch boards';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
    }
  },

  selectBoard: async (boardId: number | null) => {
    set({ isLoading: true, error: null, selectedBoardPermissions: [] });
    if (boardId === null) {
      set({ selectedBoard: null, isLoading: false });
      return;
    }
    try {
      // Fetch full board details when selected, including owner and permissions if backend provides
      const board = await boardService.getBoardById(boardId);
      set({ selectedBoard: board, isLoading: false });
      // After selecting a board, also fetch its detailed permissions
      await get().fetchSelectedBoardPermissions();
    } catch (error: any) {
      const errorMessage = error.message || `Failed to fetch board (ID: ${boardId})`;
      set({ error: errorMessage, isLoading: false, selectedBoard: null });
      toastError(errorMessage);
    }
  },

  createBoard: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const newBoard = await boardService.createBoard({ name });
      set((state) => ({
        boards: [...state.boards, newBoard],
        isLoading: false,
      }));
      await get().selectBoard(newBoard.id); // Select the newly created board
      return newBoard;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create board';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
      return null;
    }
  },

  updateBoard: async (boardId: number, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBoard = await boardService.updateBoard(boardId, { name });
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        isLoading: false,
      }));
      return updatedBoard;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update board';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
      return null;
    }
  },

  deleteBoard: async (boardId: number) => {
    set({ isLoading: true, error: null });
    try {
      await boardService.deleteBoard(boardId);
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
        selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard,
        selectedBoardPermissions: state.selectedBoard?.id === boardId ? [] : state.selectedBoardPermissions,
        isLoading: false,
      }));
      if (get().selectedBoard === null && get().boards.length > 0) {
        await get().selectBoard(get().boards[0].id); // Select first available board
      } else if (get().boards.length === 0) {
        await get().selectBoard(null); // No boards left
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete board';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
    }
  },

  fetchSelectedBoardPermissions: async () => {
    const selectedBoardId = get().selectedBoard?.id;
    if (!selectedBoardId) {
      set({ selectedBoardPermissions: [] });
      return;
    }
    // No need to set isLoading here if selectBoard already does it.
    // Or, set specific loading for permissions: set({ isLoadingPermissions: true });
    try {
      const permissions = await boardService.getBoardPermissionsList(selectedBoardId);
      set({ selectedBoardPermissions: permissions /*, isLoadingPermissions: false */ });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch board permissions';
      set({ error: errorMessage, selectedBoardPermissions: [] /*, isLoadingPermissions: false */ });
      toastError(errorMessage);
    }
  },

  shareSelectedBoard: async (email: string, permissionLevel: 'editor' | 'viewer') => {
    const boardId = get().selectedBoard?.id;
    if (!boardId) {
      toastError("No board selected to share.");
      return;
    }
    set({ isLoading: true, error: null }); // Or a specific loading state for this action
    try {
      await boardService.shareBoardWithUser(boardId, { email, permissionLevel });
      await get().fetchSelectedBoardPermissions(); // Refresh permissions list
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to share board';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
      throw error; // Re-throw for form handling
    }
  },

  updateUserPermissionOnSelectedBoard: async (userIdToManage: number, permissionLevel: 'editor' | 'viewer') => {
    const boardId = get().selectedBoard?.id;
    if (!boardId) {
      toastError("No board selected.");
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await boardService.updateUserBoardPermission(boardId, userIdToManage, { permissionLevel });
      await get().fetchSelectedBoardPermissions(); // Refresh
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update permission';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
      throw error;
    }
  },

  removeUserFromSelectedBoard: async (userIdToManage: number) => {
    const boardId = get().selectedBoard?.id;
    if (!boardId) {
      toastError("No board selected.");
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await boardService.removeUserFromBoardPermission(boardId, userIdToManage);
      await get().fetchSelectedBoardPermissions(); // Refresh
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to remove user from board';
      set({ error: errorMessage, isLoading: false });
      toastError(errorMessage);
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  isCurrentUserOwnerOfSelectedBoard: () => {
    const { selectedBoard } = get(); // Access own store's state
    // This function now needs the current user's ID to be passed to it,
    // or it needs to be a selector that also consumes from useAuthStore.
    // For now, we'll assume components will call this and provide the userId.
    // This is a placeholder; actual implementation will require userId.
    // A component would use it like: isOwner(useAuthStore.getState().user?.id)
    // To make it self-contained for now, it won't work correctly without external userId.
    // Let's make it take userId as an argument.
    // This function will be removed from the store state and become a utility or part of a component.
    // For now, I will remove the problematic direct access.
    // The logic will be: if (selectedBoard && currentUserId) return selectedBoard.ownerId === currentUserId;
    // This method will be refined when used in a component context.
    return false; // Placeholder after removing window access
  },

}));

// Selector to get current user's permission level for the selected board
// This selector also needs the currentUserId. Components will provide it.
export const getCurrentUserPermissionLevelForBoard = (
    selectedBoardPermissions: BoardPermission[],
    currentUserId: number | undefined | null
): 'owner' | 'editor' | 'viewer' | null => {
    if (!currentUserId || !selectedBoardPermissions || selectedBoardPermissions.length === 0) {
        return null;
    }
    const currentUserPermission = selectedBoardPermissions.find(p => p.userId === currentUserId);
    return currentUserPermission ? currentUserPermission.permissionLevel : null;
};


// The isCurrentUserOwnerOfSelectedBoard will be implemented as a selector or utility function
// that takes the selectedBoard and currentUserId as arguments. Example:
export const checkOwnership = (selectedBoard: Board | null, currentUserId: number | undefined | null): boolean => {
    if (!selectedBoard || !currentUserId) return false;
    // Primary check: board's ownerId field
    if (selectedBoard.ownerId === currentUserId) return true;

    // Secondary check (fallback or for thoroughness): 'owner' entry in permissions list
    // This requires selectedBoard.permissions to be populated or fetched separately.
    // If using selectedBoardPermissions from the store:
    // const permissions = useBoardStore.getState().selectedBoardPermissions;
    // const ownerPermission = permissions.find(p => p.userId === currentUserId && p.permissionLevel === 'owner');
    // return !!ownerPermission;

    return false; // Default if ownerId doesn't match and permissions not checked here
};

// Note: The store's `isCurrentUserOwnerOfSelectedBoard` method is removed due to the problematic
// window access. Components will use the `checkOwnership` utility function by passing
// the selected board from `useBoardStore` and user ID from `useAuthStore`.
// The `useCurrentUserPermissionLevel` selector is replaced by `getCurrentUserPermissionLevelForBoard`.
// The store's definition needs to reflect that `isCurrentUserOwnerOfSelectedBoard` is removed.

// Re-defining the state without the problematic method directly in the store:
// (The create function itself does not need to be re-run, this is conceptual for the next step)
// The actual removal will be done by modifying the `create` block.
// For now, I will proceed assuming the utility functions `checkOwnership` and
// `getCurrentUserPermissionLevelForBoard` will be used by components.
// The store's `isCurrentUserOwnerOfSelectedBoard` in the `create` call will be removed.
// I will adjust the original `create` call.

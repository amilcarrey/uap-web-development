import { useBoardStore } from '../store/useBoardStore';
import { NewBoardForm } from './NewBoardForm';
import { BoardItem } from './BoardItem';
import { useBoards } from '../hooks/useBoards';

export function BoardsNav() {
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const setActiveBoardId = useBoardStore((state) => state.setActiveBoardId);

  const { data } = useBoards();

  const boards = data ?? [];

  return (
    <nav className="flex justify-between bg-white p-2 border-b-[2px] border-[#ddd] w-full">
      {boards.map((board) => (
        <div key={board.id} className={`relative px-3 py-1 rounded ${board.id === activeBoardId ? 'bg-blue-200' : 'bg-gray-200'}`}>
          <button onClick={() => setActiveBoardId(board.id)} className="font-medium cursor-pointer">
            {board.name}
          </button>
          {board.id === activeBoardId && (
            <BoardItem board={board} />
          )}
        </div>
      ))}
      <NewBoardForm />
    </nav>
  );
}

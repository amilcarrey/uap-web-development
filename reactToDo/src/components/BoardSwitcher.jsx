import { useClientStore } from '../stores/clientStore';
import { motion, AnimatePresence } from 'framer-motion';

const BoardSwitcher = () => {
  const { boards, activeBoard, setActiveBoard, openBoardModal } = useClientStore();

  return (
    <div className="flex items-center mb-4">
      <div className="flex space-x-2 overflow-x-auto py-2 relative">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setActiveBoard(board.id)}
            className={`relative px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeBoard === board.id
                ? 'text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            style={{ zIndex: 1 }}
          >
            <AnimatePresence>
              {activeBoard === board.id && (
                <motion.div
                  layoutId="activeBoard"
                  className="absolute inset-0 bg-blue-500 rounded-lg z-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{board.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={openBoardModal}
        className="ml-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        +
      </button>
    </div>
  );
};

export default BoardSwitcher;
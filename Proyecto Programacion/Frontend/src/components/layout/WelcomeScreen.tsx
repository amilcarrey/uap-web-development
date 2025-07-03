import { useBoardCreation } from '../../hooks/useBoardCreation';

/**
 * Pantalla de bienvenida para usuarios sin tableros
 * Permite crear el primer tablero del usuario
 */
export function WelcomeScreen() {
  const { createFirstBoard, isCreating } = useBoardCreation();

  const handleCreateFirstBoard = async () => {
    try {
      await createFirstBoard();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  return (
    <div className="text-center text-gray-600 py-10">
      ¡Bienvenido! Aún no tienes tableros. Usa el botón para crear tu primer tablero.
      <div className="mt-6">
        <button
          onClick={handleCreateFirstBoard}
          disabled={isCreating}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creando...' : '+ Crear mi primer tablero'}
        </button>
      </div>
    </div>
  );
}

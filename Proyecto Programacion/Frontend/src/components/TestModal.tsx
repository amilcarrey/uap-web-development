interface Props {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TestModal({ boardId, isOpen, onClose }: Props) {
  console.log('🎯 TestModal: Renderizando - isOpen:', isOpen, 'boardId:', boardId);
  
  if (!isOpen) {
    console.log('🎯 TestModal: isOpen es false, no renderizando');
    return null;
  }
  
  console.log('🎯 TestModal: RENDERIZANDO EL MODAL');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Modal de Prueba</h2>
        <p className="mb-4">BoardId: {boardId}</p>
        <p className="mb-4">¡Este es un modal de prueba para verificar que funciona el renderizado!</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

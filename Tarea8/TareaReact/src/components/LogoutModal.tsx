export function LogoutModal({ open, onCancel, onConfirm }: { open: boolean, onCancel: () => void, onConfirm: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">¿Cerrar sesión?</h2>
        <p className="mb-6 text-center">¿Seguro que querés cerrar sesión?</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
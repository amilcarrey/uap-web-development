import { useAuth } from "../contexts/AuthContext";
import api from "../api";

export const DebugPanel = ({ tableroId }: { tableroId: string }) => {
  const { user } = useAuth();

  const testAPI = async () => {
    try {
      console.log("🧪 Probando conexión con API...");

      // Test 1: Usuario actual
      const userResponse = await api.get("/api/users/me");
      console.log("✅ Usuario actual:", userResponse.data);

      // Test 2: Tableros
      const tablerosResponse = await api.get("/api/tableros");
      console.log("✅ Tableros:", tablerosResponse.data);

      // Test 3: Tareas (si hay tablero seleccionado)
      if (tableroId) {
        const tareasResponse = await api.get(
          `/api/tableros/${tableroId}/tareas`
        );
        console.log("✅ Tareas:", tareasResponse.data);
      }

      alert("Revisa la consola del navegador para ver los resultados");
    } catch (error: any) {
      console.error("❌ Error en test:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded shadow-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">🐛 Debug Panel</h4>
      <p>Usuario: {user?.username || "No logueado"}</p>
      <p>Tablero ID: {tableroId || "Ninguno"}</p>
      <button
        onClick={testAPI}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Test API
      </button>
    </div>
  );
};

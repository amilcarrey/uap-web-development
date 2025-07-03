import { useConfigStore } from "../store/useConfigStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Settings() {
  const refetchInterval = useConfigStore((s) => s.refetchInterval);
  const uppercaseDescriptions = useConfigStore((s) => s.uppercaseDescriptions);
  const setRefetchInterval = useConfigStore((s) => s.setRefetchInterval);
  const setUppercaseDescriptions = useConfigStore((s) => s.setUppercaseDescriptions);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-6 text-yellow-700">Configuración</h1>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-700">Intervalo de actualización (ms)</span>
          <input
            type="number"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
            value={refetchInterval}
            onChange={(e) => setRefetchInterval(Number(e.target.value))}
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-700">Mostrar descripción en mayúsculas</span>
          <div className="mt-1">
            <input
              type="checkbox"
              className="scale-125 accent-yellow-500"
              checked={uppercaseDescriptions}
              onChange={(e) => setUppercaseDescriptions(e.target.checked)}
            />
          </div>
        </label>

        <button
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-medium hover:bg-yellow-600 transition"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>

        <button
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
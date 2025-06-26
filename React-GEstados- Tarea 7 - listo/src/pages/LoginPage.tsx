import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore, useBoardStore, useTaskStore, useConfigStore } from "../store";

// Helper para limpiar todo el estado local/zustand
function resetAllStores() {
  useUserStore.getState().setUser(null);
  useBoardStore.getState().setBoards([]);        // Borra los boards cacheados
  useTaskStore.getState().setFilter("all");      // Borra filtros
  useTaskStore.getState().setPage("", 1);        // Opcional: borra paginación
  useConfigStore.getState().setConfig({
    tareasPorPagina: 5,
    mostrarMayusculas: false,
    refetchInterval: 10000,
  });
  // Limpia persistencia local
  localStorage.removeItem("board-storage");
  localStorage.removeItem("config-storage");
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    resetAllStores();

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Credenciales incorrectas");
      }
      const json = await res.json();

      setUser(json.user); // ⚡ Guarda el usuario actual

      // Buscar SOLO tableros donde el usuario es DUEÑO (no compartidos)
      try {
        const boardsRes = await fetch("http://localhost:3001/api/boards/owned", {
          credentials: "include"
        });
        
        // Si no hay endpoint específico, usar el general pero filtrar mejor
        if (!boardsRes.ok) {
          const allBoardsRes = await fetch("http://localhost:3001/api/boards", {
            credentials: "include"
          });
          
          if (allBoardsRes.ok) {
            const allBoards = await allBoardsRes.json();
            // FILTRO MÁS ESTRICTO: Solo tableros donde el usuario es el creador/dueño
            const ownedBoards = allBoards.filter((board: any) => {
              // Verificar que sea el dueño EXCLUSIVO (no solo colaborador)
              const isOwner = board.owner === json.user.username || 
                             board.ownerId === json.user.id ||
                             board.createdBy === json.user.username;
              
              // Opcional: verificar que no sea un tablero compartido
              const isNotShared = !board.shared || board.shared === false;
              
              return isOwner && isNotShared;
            });
            
            if (ownedBoards.length > 0) {
              // Tomar el primer tablero propio (o el más reciente)
              const primaryBoard = ownedBoards[0];
              navigate(`/tablero/${primaryBoard.id}`, { replace: true });
            } else {
              // Crear un tablero personal nuevo si no existe
              await createPersonalBoard(json.user);
            }
          } else {
            await createPersonalBoard(json.user);
          }
        } else {
          const ownedBoards = await boardsRes.json();
          if (ownedBoards.length > 0) {
            navigate(`/tablero/${ownedBoards[0].id}`, { replace: true });
          } else {
            await createPersonalBoard(json.user);
          }
        }
      } catch (boardError) {
        console.error("Error al obtener tableros:", boardError);
        await createPersonalBoard(json.user);
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Función para crear un tablero personal si no existe
  const createPersonalBoard = async (user: any) => {
    try {
      const createRes = await fetch("http://localhost:3001/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: `Mi Tablero - ${user.username}`,
          description: "Tablero personal",
          shared: false // Asegurar que no sea compartido
        }),
      });
      
      if (createRes.ok) {
        const newBoard = await createRes.json();
        navigate(`/tablero/${newBoard.id}`, { replace: true });
      } else {
        // Última opción: ir a una ruta que maneje la creación
        navigate("/tablero/personal", { replace: true });
      }
    } catch (createError) {
      console.error("Error al crear tablero personal:", createError);
      navigate("/tablero/personal", { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow p-8 rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
        <div className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-blue-600 underline">Registrate</Link>
        </div>
      </form>
    </div>
  );
}
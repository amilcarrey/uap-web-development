import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSettingsStore } from "../store/useSettingsStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const BoardList = () => {
  const [newBoardName, setNewBoardName] = useState("");
  const { refetchInterval } = useSettingsStore();

  const queryClient = useQueryClient();

  const { data: boards, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/api/board`);
      return data;
    },
    refetchInterval,
  });

  const createBoard = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axios.post(`${BASE_URL}/api/board`, {
        name,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Tablero creado");
      setNewBoardName("");
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${BASE_URL}/api/board/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Tablero eliminado");
    },
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Tableros</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newBoardName.trim()) {
            createBoard.mutate(newBoardName);
          }
        }}
        className="mb-4"
      >
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Nombre del nuevo tablero"
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={createBoard.isPending}
        >
          {createBoard.isPending ? "Creando..." : "Crear Tablero"}
        </button>
      </form>

      {isLoading ? (
        <p>Cargando tableros...</p>
      ) : (
        <ul className="space-y-2">
          {boards?.map((board: any) => (
            <li
              key={board.id}
              className="flex items-center justify-between bg-white p-3 rounded shadow"
            >
              <Link
                to="/board/$boardId/$name"
                params={{
                  boardId: board.id.toString(),
                  name: board.name.toString(),
                }}
                className="text-blue-500 hover:underline"
              >
                {board.name}
              </Link>
              <button
                onClick={() => deleteBoard.mutate(board.id)}
                className="text-red-500 hover:text-red-700"
                disabled={deleteBoard.isPending}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { useCompartirTablero } from "../hooks/useCompartirTablero";

interface Props {
  boardId: string;
}

const CompartirTablero: React.FC<Props> = ({ boardId }) => {
  const [email, setEmail] = useState("");
  const compartir = useCompartirTablero();

  const handleCompartir = () => {
    if (!email.trim()) {
      alert("Por favor ingresa un email válido.");
      return;
    }
    compartir.mutate({ boardId, email });
    setEmail("");
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-bold mb-2">Compartir este tablero</h3>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleCompartir}
          disabled={compartir.isPending}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {compartir.isPending ? "Compartiendo..." : "Compartir"}
        </button>
      </div>
      {compartir.isError && (
        <p className="text-red-600 mt-1">
          Error al compartir: {(compartir.error as any)?.response?.data?.error || "Error desconocido"}
        </p>
      )}
      {compartir.isSuccess && (
        <p className="text-green-600 mt-1">¡Tablero compartido!</p>
      )}
    </div>
  );
};

export default CompartirTablero;

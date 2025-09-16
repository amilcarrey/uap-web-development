import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsuarioLogueado() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Leer la cookie 'user'
    const match = document.cookie.match(/(?:^|; )user=([^;]*)/);
    setUsuario(match ? decodeURIComponent(match[1]) : null);
  }, []);

  const handleLogout = () => {
    // Borrar la cookie 'user' y 'token'
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (!usuario) return null;

  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="font-semibold text-pink-700">Usuario: {usuario}</span>
      <button
        onClick={handleLogout}
        className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded shadow"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

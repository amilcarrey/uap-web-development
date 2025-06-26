

import { useUserStore } from "../store";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const setUser = useUserStore(s => s.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="text-red-600 hover:underline">
      Cerrar sesión
    </button>
  );
}

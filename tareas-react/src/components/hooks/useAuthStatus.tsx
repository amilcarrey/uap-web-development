// tareas-react/src/components/hooks/useAuthStatus.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export function useAuthStatus() {
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; nombre?: string }>({ isLoggedIn: false });

  useEffect(() => {
    axios
      .get("http://localhost:8008/api/auth/me", { withCredentials: true })
      .then(res => setAuth({ isLoggedIn: true, nombre: res.data.nombre }))
      .catch(() => setAuth({ isLoggedIn: false }));
  }, []);

  return auth;
}
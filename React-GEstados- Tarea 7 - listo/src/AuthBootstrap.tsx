// AuthBootstrap.tsx
import { useEffect } from "react";
import { useUserStore } from "./store";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthBootstrap() {
  const setUser = useUserStore(s => s.setUser);
  const setLogged = useUserStore(s => s.setLogged);
  const setCheckingAuth = useUserStore(s => s.setCheckingAuth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCheckingAuth(true);
    fetch("http://localhost:3001/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          setUser(json.user); // ahora tiene id y username
          setLogged(true);
        } else {
          setUser(null);
          setLogged(false);
          if (location.pathname !== "/login" && location.pathname !== "/registro") {
            navigate("/login", { replace: true });
          }
        }
        setCheckingAuth(false);
      })
      .catch(() => {
        setUser(null);
        setLogged(false);
        setCheckingAuth(false);
        if (location.pathname !== "/login" && location.pathname !== "/registro") {
          navigate("/login", { replace: true });
        }
      });
  }, []);
  return null;
}

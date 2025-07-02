export const register = async (username: string, password: string) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Error al registrarse");
  return res.json();
};

export const login = async (username: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
};

export const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cerrar sesión");
};

export const getCurrentUser = async () => {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Sesión inválida");
  return res.json();
};
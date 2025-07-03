import type { AuthFormData } from "../types/auth";

// REGISTRO
// Función para registrar un nuevo usuario
export async function registerUser(data: AuthFormData) {
  const res = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Incluye cookies en la petición
    body: JSON.stringify({
      nombre_usuario: data.username,
      correo: data.email,
      contraseña: data.password,
    }),
  });

  // Si la respuesta no es exitosa, lanza un error con el mensaje recibido
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al registrar usuario");
  }

  return res.json(); // Devuelve la respuesta en formato JSON
}

// LOGIN
// Función para iniciar sesión de usuario
export async function loginUser(data: AuthFormData) {
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      correo: data.email,
      contraseña: data.password,
    }),
  });

  // Si la respuesta no es exitosa, lanza un error con el mensaje recibido
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al iniciar sesión");
  }

  return res.json(); // Devuelve la respuesta en formato JSON
}

// LOGOUT
// Función para cerrar sesión del usuario
export async function logoutUser() {
  const res = await fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // Si la respuesta no es exitosa, lanza un error con el mensaje recibido
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al cerrar sesión");
  }

  return res.json(); // Devuelve la respuesta en formato JSON
}

// OBTENER USUARIO ACTUAL
// Función para obtener el usuario autenticado actual
export async function getCurrentUser() {
  const res = await fetch("http://localhost:3001/api/auth/me", {
    credentials: "include",
  });

  // Si la respuesta no es exitosa, lanza un error indicando que no está autenticado
  if (!res.ok) {
    throw new Error("No autenticado");
  }

  return res.json(); // Devuelve el usuario en formato JSON
}

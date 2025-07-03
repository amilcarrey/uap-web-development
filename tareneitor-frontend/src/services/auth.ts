// Función para iniciar sesión de usuario
export async function loginUser(email: string, password: string) {
  // Realiza una petición POST al endpoint de login
  const response = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    credentials: "include", // Incluye cookies en la petición
    headers: {
      "Content-Type": "application/json",
    },
    // Envía el email y la contraseña en el cuerpo de la petición
    body: JSON.stringify({ correo: email, contraseña: password }),
  });

  // Si la respuesta no es exitosa, lanza un error con el mensaje recibido
  if (!response.ok) {
    const { mensaje } = await response.json();
    throw new Error(mensaje || "Error al iniciar sesión");
  }

  // Si la respuesta es exitosa, retorna el usuario recibido
  const data = await response.json();
  return data.usuario;
}

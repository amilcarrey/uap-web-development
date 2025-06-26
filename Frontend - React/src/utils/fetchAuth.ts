  type ToastType = "error" | "success" | "info";

  /**
 * fetchAuth
 * 
 * Realiza peticiones HTTP autenticadas usando fetch. 
 * 
 * Funcionalidades:
 * - Agrega automáticamente el token JWT del localStorage al header `Authorization`.
 * - Asegura que el header `Content-Type` sea `application/json`.
 * - Si la respuesta es 401 (no autorizado):
 *   - Llama a la función `logout` si se proporcionó.
 *   - Muestra un toast de error si se proporcionó `addToast`.
 *   - Redirige automáticamente a `/main` después de un breve retraso.
 * 
 */

  export async function fetchAuth(
    url: string,
    options: RequestInit = {},
    logout?: () => void,
    addToast?: (msg: string, type?: ToastType) => void
  ): Promise<Response> {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');

    // Construir headers, añadiendo Content-Type y Authorization si hay token
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Realizar petición fetch con headers y opciones indicadas
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Manejar sesión expirada (401)
    if (response.status === 401) {
      if (addToast) addToast("Tu sesión ha expirado. Por favor inicia sesión nuevamente.", "error");

      // Esperar un momento y ejecutar logout y redirigir a /main
      setTimeout(() => {
        if (logout) logout();
        window.location.href = "/main";
      }, 3200);
      throw new Error("Sesión inválida.");
    }

    return response;
  }
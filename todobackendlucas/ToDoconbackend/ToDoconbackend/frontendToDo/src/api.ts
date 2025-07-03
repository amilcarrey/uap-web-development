import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log("Enviando request a:", config.url);
    console.log("Token encontrado:", token ? "Sí" : "No");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header agregado");
    }
    return config;
  },
  (error) => {
    console.error("Error en request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log("Response exitoso de:", response.config.url);
    return response;
  },
  (error) => {
    console.error("Error en response:", error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpio mi localStorage
      console.log("Token inválido, limpiando localStorage");
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;

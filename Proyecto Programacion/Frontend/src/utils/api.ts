// Este archivo ya no se usa - todas las URL de API se construyen directamente
// Mantenerlo como referencia por si se necesita en el futuro

// Configuración de la API (no se usa actualmente)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper para construir URLs de API (no se usa actualmente - se usan URLs directas)
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

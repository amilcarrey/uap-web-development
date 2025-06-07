export interface TaskQueryDTO{
    search?: string; // Texto de búsqueda opcional para filtrar tareas por contenido
    active?: boolean; // Filtro opcional para tareas activas o inactivas
    page?: number; // Número de página para paginación, opcional
    limit?: number; // Límite de tareas por página para paginación, opcional
}
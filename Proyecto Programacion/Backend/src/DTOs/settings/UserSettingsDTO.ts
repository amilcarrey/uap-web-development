export interface UserSettingsDTO{
    userId: number; // ID del usuario al que pertenecen estos ajustes
    itemsPerPage: number; // Número de elementos por página en la paginación
    updateInterval: number; // Intervalo de actualización en milisegundos
    upperCaseAlias: boolean; // Indica si los alias deben mostrarse en mayúsculas
}
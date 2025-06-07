export interface UpdateSettingsDTO{
    itemPerPage?: number; // Número de elementos por página, opcional para actualizar solo si se proporciona
    updateInterval?: number; // Intervalo de actualización en milisegundos, opcional para actualizar solo si se proporciona
    upperCaseAlias?: boolean; // Indica si los alias deben mostrarse en mayúsculas, opcional para actualizar solo si se proporciona
}
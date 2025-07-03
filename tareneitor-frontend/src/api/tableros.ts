// Define el tipo de datos para crear un nuevo tablero
export type NuevoTableroData = {
    nombre: string;
    descripcion?: string;
};

// URL base para las peticiones relacionadas a tableros
const BASE_URL = "http://localhost:3001/api/tableros";

// Obtiene los tableros propios del usuario autenticado
export async function fetchTablerosPropios() {
    const res = await fetch(`${BASE_URL}/propios`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener tableros propios");
    return res.json();
}

// Obtiene los tableros compartidos con el usuario autenticado
export async function fetchTablerosCompartidos() {
    const res = await fetch(`${BASE_URL}/compartidos`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Error al obtener tableros compartidos");
    return res.json();
}

// Crea un nuevo tablero con los datos proporcionados
export async function createTablero(data: NuevoTableroData) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al crear tablero");
    }
    return res.json();
}

// Actualiza un tablero existente por su ID con los nuevos datos
export async function updateTablero(id: number, data: NuevoTableroData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al actualizar tablero");
    }
    return res.json();
}

// Elimina un tablero por su ID
export async function deleteTablero(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al eliminar tablero");
    }
    return res.json();
}

// Comparte un tablero con otro usuario, asignando un permiso (lector o editor)
export async function compartirTablero(
    id_tablero: number,
    data: { correo: string; permiso: "lector" | "editor" }
) {
    const response = await fetch(
        `http://localhost:3001/api/tableros/${id_tablero}/permisos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje || "Error al compartir tablero");
    }

    return await response.json();
}

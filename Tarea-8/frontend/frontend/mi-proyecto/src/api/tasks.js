// frontend/src/api/tasks.js

import api from './axios'; // ¡CORRECCIÓN CRÍTICA AQUÍ! Ahora importa desde './axios'

// --- Funciones para Tableros (Boards) ---
export const getBoards = async () => {
    const response = await api.get('/boards');
    return response.data; // Axios devuelve la data en response.data
};

export const createBoard = async (boardName) => {
    // El backend de Node.js espera { name: "..." }
    const response = await api.post('/boards', { name: boardName });
    return response.data;
};

export const deleteBoard = async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data; // O simplemente response.status === 200/204
};

// --- Funciones para Tareas ---
export const getTasks = async (boardId, filter = 'all', page = 1, limit = 5) => {
    if (!boardId) throw new Error('Board ID is required to fetch tasks.');

    // El backend de Node.js no tiene un filtro directo "all", "active", "completed".
    // El estado de la tarea en Node.js es 'to-do', 'in-progress', 'done'.
    // Mapeamos los filtros del frontend a los estados del backend si es posible.
    let statusFilter = '';
    if (filter === 'active') {
        // En Node.js, "active" podría ser 'to-do' o 'in-progress'
        // Por simplicidad, podríamos devolver todas las que no sean 'done'
        // O si tu backend de Node.js tiene un endpoint para esto, lo usaríamos.
        // Asumiendo que 'active' significa 'not done'.
        // Aquí no podemos pasar múltiples estados en un solo query param 'status'.
        // Una opción es que el backend de Node.js interprete 'active' o 'completed' si lo creas.
        // Por ahora, el backend Node.js solo filtra por un 'status' específico.
        // Si no se puede filtrar por 'active' o 'completed' desde un único 'status' param,
        // tendríamos que pedir todas las tareas y filtrar en el frontend, o adaptar el backend.

        // Por ahora, voy a suponer que el backend de Node.js NO soporta el 'filter' parameter
        // de 'active' o 'completed' directamente para el campo 'status'.
        // Si tu backend de Node.js tiene un endpoint para esto, házmelo saber.
        // Si no, vamos a traer todas las tareas y el filtro se aplica en el frontend.
        // Dejaremos los parámetros 'filter', 'page', 'limit' para que los use el BoardView.
    }

    const queryParams = new URLSearchParams({ page, limit }).toString();
    // NOTA: Tu backend de Node.js puede que no tenga paginación ni filtros directamente en /tasks.
    // Esto se adaptaría según los endpoints reales de tu TaskController en Node.js.
    // Asumo que el endpoint para obtener tareas para un board es GET /api/boards/:boardId/tasks
    // y que soporta query params para paginación si se implementaron.
    const response = await api.get(`/boards/${boardId}/tasks?${queryParams}`);

    // Adaptar el formato de la respuesta:
    // Flask: { tasks: [{ id, text, completed }], total, page, limit }
    // Node.js: tasks (que tienen id, title, description, status)
    // Devolvemos un formato similar al de Flask para que el frontend no se rompa.
    return {
        tasks: response.data.map(task => ({ // response.data es directamente el array de tareas
            id: task.id,
            // Mapea 'title' a 'text' para compatibilidad con el frontend
            text: task.title,
            // Mapea 'status' a 'completed'
            completed: task.status === 'done' // Si 'status' es 'done', entonces está 'completed'
            // Podrías añadir task.description aquí si tu componente lo usa
        })),
        // Estas propiedades 'total', 'page', 'limit' NO son devueltas por tu TaskController de Node.js actual.
        // Las estoy agregando como valores fijos o calculados para evitar errores en el frontend.
        // Si necesitas paginación real, tu TaskController de Node.js deberá devolverlos.
        total: response.data.length, // Total de tareas obtenidas
        page: parseInt(page),   // Usar el page enviado por el frontend
        limit: parseInt(limit)  // Usar el limit enviado por el frontend
    };
};

export const addTask = async (boardId, taskText) => {
    if (!boardId) throw new Error('Board ID is required to add a task.');

    // Node.js backend espera { title, description, status, boardId }
    // Aquí el `taskText` de tu Flask app se mapeará al `title` en Node.js.
    // La descripción y el status inicial son por defecto.
    const response = await api.post(`/boards/${boardId}/tasks`, {
        title: taskText,
        description: '', // Tu Flask app no tenía descripción, así que la dejamos vacía.
        status: 'to-do', // Estado inicial por defecto en Node.js
    });

    // Adaptar la respuesta del backend de Node.js al formato que el frontend espera
    // Tu Node.js `taskController.createTask` devuelve el objeto Task directamente.
    return {
        status: "success",
        task: {
            id: response.data.id,
            text: response.data.title,
            completed: response.data.status === 'done',
        },
        message: "Task added successfully"
    };
};

// En Node.js, 'toggleTaskCompletion' se maneja actualizando el status de la tarea con un PUT.
export const toggleTaskCompletion = async (boardId, taskId) => {
    // Primero, obtenemos la tarea actual para saber su estado.
    // Esto es necesario porque el frontend no envía el estado 'completed' directamente,
    // sino que espera que el backend lo "togglee".

    // Ojo: La llamada a `/boards/${boardId}/tasks` trae TODAS las tareas de ese board.
    // Si tienes muchas tareas, esto no es eficiente. Lo ideal sería obtener solo la tarea por ID
    // si tu backend de Node.js tuviera un endpoint GET /api/tasks/:id.
    // Como tu `taskController` SÍ tiene `getTaskById`, usémoslo para más eficiencia.
    const currentTaskResponse = await api.get(`/tasks/${taskId}`); // Usamos el endpoint específico de tarea
    const taskToToggle = currentTaskResponse.data;

    if (!taskToToggle) {
        throw new Error('Task not found for toggling.');
    }

    // Determinar el nuevo estado
    const newStatus = taskToToggle.status === 'done' ? 'to-do' : 'done';

    // Enviar la actualización
    const response = await api.put(`/tasks/${taskId}`, {
        title: taskToToggle.title,
        description: taskToToggle.description,
        status: newStatus,
        // boardId: boardId // El backend no necesita boardId en el payload de PUT para /tasks/:id
    });
    return response.data;
};


// En Node.js, DELETE /api/tasks/:id
export const deleteTask = async (boardId, taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data; // O simplemente response.status === 200/204
};

export const clearCompletedTasks = async (boardId) => {
    // ESTA FUNCIÓN NECESITA UN ENDPOINT EN EL BACKEND DE NODE.JS.
    // Tu backend de Node.js ACTUALMENTE NO TIENE este endpoint.
    // Lanzará un error si se llama. Si quieres esta funcionalidad,
    // debemos crear un endpoint POST /api/boards/:boardId/tasks/clear-completed
    // en tu TaskController de Node.js.
    throw new Error("clearCompletedTasks: This feature requires a dedicated endpoint in the Node.js backend.");
};

export const updateTask = async (boardId, taskId, updatedTaskData) => {
    // Node.js backend espera { title, description, status, boardId } en PUT /api/tasks/:id
    // `updatedTaskData` del frontend tiene { text, completed }
    // Necesitamos mapear `text` a `title` y `completed` a `status`.

    // Obtener la tarea actual para mantener los campos que no se están actualizando
    const currentTaskResponse = await api.get(`/tasks/${taskId}`);
    const currentTask = currentTaskResponse.data;

    if (!currentTask) {
        throw new Error('Task not found for update.');
    }

    const payload = {
        title: updatedTaskData.text || currentTask.title,
        description: currentTask.description, // Mantiene la descripción actual
        status: updatedTaskData.completed ? 'done' : 'to-do', // Mapear 'completed' a 'status'
        // boardId: boardId // El backend no necesita boardId en el payload de PUT para /tasks/:id
    };

    const response = await api.put(`/tasks/${taskId}`, payload);
    return response.data;
};


// --- Funciones para Configuraciones Globales ---
// Estas funciones NO tienen endpoints en tu backend de Node.js.
// Lanzarán un error si se intentan usar.
// Si las necesitas, requerirá crear un nuevo modelo y controladores en Node.js.

export const getGlobalConfig = async () => {
    throw new Error("getGlobalConfig: Global config endpoints are not implemented in the Node.js backend.");
};

export const updateGlobalConfig = async (configData) => {
    throw new Error("updateGlobalConfig: Global config endpoints are not implemented in the Node.js backend.");
};
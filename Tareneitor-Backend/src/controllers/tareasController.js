const tareaService = require('../services/tareaService');

// Controlador para crear una nueva tarea
exports.crearTarea = async (req, res) => {
    try {
        // Llama al servicio para crear la tarea con los datos recibidos
        const tarea = await tareaService.crearTarea({
            tableroId: req.params.id,
            contenido: req.body.contenido,
            usuarioId: req.usuario.id_usuario,
        });
        // Devuelve la tarea creada con status 201
        res.status(201).json(tarea);
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al crear tarea' });
    }
};

// Controlador para obtener tareas (duplicado, ver nota abajo)
exports.obtenerTareas = async (req, res) => {
    try {
        // Llama al servicio para obtener las tareas del tablero y usuario
        const tareas = await tareaService.obtenerTareas({
            tableroId: req.params.id,
            usuarioId: req.usuario.id_usuario,
        });
        // Devuelve la lista de tareas
        res.json(tareas);
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al obtener tareas' });
    }
};

// Controlador para actualizar una tarea existente
exports.actualizarTarea = async (req, res) => {
    try {
        // Llama al servicio para actualizar la tarea con los datos recibidos
        const tarea = await tareaService.actualizarTarea({
            tareaId: req.params.id,
            contenido: req.body.contenido,
            completada: req.body.completada,
            usuarioId: req.usuario.id_usuario,
        });
        // Devuelve la tarea actualizada
        res.json(tarea);
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al actualizar tarea' });
    }
};

// Controlador para eliminar una tarea por ID
exports.eliminarTarea = async (req, res) => {
    try {
        // Llama al servicio para eliminar la tarea
        await tareaService.eliminarTarea({
            tareaId: req.params.id,
            usuarioId: req.usuario.id_usuario,
        });
        // Devuelve mensaje de éxito
        res.json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al eliminar tarea' });
    }
};

// Controlador para obtener tareas con filtro de completada (duplicado, ver nota abajo)
exports.obtenerTareas = async (req, res) => {
    try {
        // Llama al servicio para obtener tareas, filtrando por completada si se indica
        const tareas = await tareaService.obtenerTareas({
            tableroId: req.params.id,
            usuarioId: req.usuario.id_usuario,
            completada: req.query.completada, 
        });
        // Devuelve la lista de tareas
        res.json(tareas);
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al obtener tareas' });
    }
};

// Controlador para eliminar todas las tareas completadas de un tablero
exports.eliminarTareasCompletadas = async (req, res) => {
    try {
        // Llama al servicio para eliminar tareas completadas
        const eliminadas = await tareaService.eliminarTareasCompletadas({
            tableroId: req.params.id,
            usuarioId: req.usuario.id_usuario,
        });
        // Devuelve mensaje con la cantidad de tareas eliminadas
        res.json({ mensaje: `${eliminadas} tareas completadas eliminadas` });
    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({ mensaje: error.mensaje || 'Error al eliminar tareas completadas' });
    }
};

/*
Nota: Hay dos definiciones de exports.obtenerTareas, lo que sobrescribe la primera.
Deja solo una y unifica la lógica si es necesario.
*/

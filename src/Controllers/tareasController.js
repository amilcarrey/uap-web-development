let tareas = []; // { id: string, titulo: string, categoria: string, completada: boolean }


const mostrarTareas = (req, res) => {
    // No es necesario filtrar aquí si el filtrado se maneja en otra ruta o en el cliente
    res.render('index', { tareas });
};


const crearTarea = (req, res) => {
    const { titulo, categoria } = req.body;
    if (!titulo || !categoria) {
        // Considerar enviar un error JSON si es una solicitud AJAX
        return res.status(400).send('Faltan datos para crear la tarea');
    }
    // Añadir un ID único
    const nuevaTarea = { id: Date.now().toString(), titulo, categoria, completada: false };
    tareas.push(nuevaTarea);

    if (req.xhr || req.headers.accept.includes('application/json')) { // Mejor comprobación para AJAX
        return res.status(201).json(nuevaTarea); // Devolver la tarea completa con su ID
    }
    res.redirect('/');
};


const completarTarea = (req, res) => {
    const { id } = req.body; // Usar ID en lugar de index
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        tarea.completada = !tarea.completada; // Permitir marcar/desmarcar
    } else {
        // Manejar caso donde la tarea no se encuentra
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        return res.redirect('/'); // O mostrar un mensaje de error
    }

    if (req.xhr || req.headers.accept.includes('application/json')) {
        // Devolver la tarea actualizada o solo el estado
        return res.status(200).json({ id: tarea.id, completada: tarea.completada });
    }
    res.redirect('/');
};


const eliminarCompletadas = (req, res) => {
    const idsEliminadas = tareas.filter(t => t.completada).map(t => t.id);
    tareas = tareas.filter(t => !t.completada);

    if (req.xhr || req.headers.accept.includes('application/json')) {
        // Devolver los IDs de las tareas eliminadas para que el cliente las quite del DOM
        return res.status(200).json({ mensaje: 'Tareas completadas eliminadas', idsEliminadas });
    }
    res.redirect('/');
};


const eliminarTarea = (req, res) => {
    const { id } = req.body; // Usar ID en lugar de index
    const tareaIndex = tareas.findIndex(t => t.id === id);

    if (tareaIndex !== -1) {
        tareas.splice(tareaIndex, 1);
    } else {
        // Manejar caso donde la tarea no se encuentra
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        return res.redirect('/'); // O mostrar un mensaje de error
    }

    if (req.xhr || req.headers.accept.includes('application/json')) {
        // Confirmar eliminación devolviendo el ID
        return res.status(200).json({ id });
    }
    res.redirect('/');
};


const filtrarTareas = (req, res) => {
    const filtro = req.query.estado;
    let tareasFiltradas = tareas;

    if (filtro === 'completas') {
        tareasFiltradas = tareas.filter(t => t.completada);
    } else if (filtro === 'incompletas') {
        tareasFiltradas = tareas.filter(t => !t.completada);
    }
    // Para 'todas', simplemente se usa la lista completa 'tareas'

    // Siempre renderizar la vista con las tareas (filtradas o no)
    // El cliente decidirá si usa la respuesta HTML o pide JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(200).json(tareasFiltradas); // Devolver solo los datos filtrados para AJAX
    }
    // Para solicitudes normales, renderizar la página completa con las tareas filtradas
    res.render('index', { tareas: tareasFiltradas });
};

module.exports = {
    mostrarTareas,
    crearTarea,
    completarTarea,
    eliminarCompletadas,
    eliminarTarea,
    filtrarTareas
};

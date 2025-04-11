let tareas = []; 


const mostrarTareas = (req, res) => {
    res.render('index', { tareas });
};


const crearTarea = (req, res) => {
    const { titulo, categoria } = req.body;
    if (!titulo || !categoria) {
        return res.status(400).send('Faltan datos para crear la tarea');
    }
    const nuevaTarea = { titulo, categoria, completada: false };
    tareas.push(nuevaTarea);

    if (req.xhr) { 
        return res.status(201).json(nuevaTarea);
    }
    res.redirect('/');
};


const completarTarea = (req, res) => {
    const index = req.body.index;
    if (index >= 0 && index < tareas.length) {
        tareas[index].completada = true;
    }

    if (req.xhr) { 
        return res.status(200).json({ index, completada: true });
    }
    res.redirect('/');
};


const eliminarCompletadas = (req, res) => {
    tareas = tareas.filter(t => !t.completada);

    if (req.xhr) { 
        return res.status(200).json({ mensaje: 'Tareas completadas eliminadas' });
    }
    res.redirect('/');
};


const eliminarTarea = (req, res) => {
    const index = parseInt(req.body.index, 10);
    if (!isNaN(index) && index >= 0 && index < tareas.length) {
        tareas.splice(index, 1);
    }

    if (req.xhr) { 
        return res.status(200).json({ index });
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

    if (req.xhr) { 
        return res.status(200).json(tareasFiltradas);
    }
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

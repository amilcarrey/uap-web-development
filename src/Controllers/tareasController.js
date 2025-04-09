let tareas = []; // Array de tareas

// Mostrar tareas
const mostrarTareas = (req, res) => {
    res.render('index', { tareas });
};

// Crear tarea
const crearTarea = (req, res) => {
    const { titulo, categoria } = req.body;
    if (!titulo || !categoria) {
        return res.status(400).send('Faltan datos para crear la tarea');
    }
    tareas.push({ titulo, categoria, completada: false });
    res.redirect('/');
};

// Marcar tarea como completada
const completarTarea = (req, res) => {
    const index = req.body.index;
    tareas[index].completada = true;
    res.redirect('/');
};

// Eliminar tareas completadas
const eliminarCompletadas = (req, res) => {
    tareas = tareas.filter(t => !t.completada);
    res.redirect('/');
};

// Eliminar tarea específica
const eliminarTarea = (req, res) => {
    const index = parseInt(req.body.index, 10);
    if (!isNaN(index) && index >= 0 && index < tareas.length) {
        tareas.splice(index, 1);
    }
    res.redirect('/');
};

// Filtrar tareas
const filtrarTareas = (req, res) => {
    const filtro = req.query.estado; // "todas", "completas", "incompletas"
    let tareasFiltradas = tareas;

    if (filtro === 'completas') {
        tareasFiltradas = tareas.filter(t => t.completada);
    } else if (filtro === 'incompletas') {
        tareasFiltradas = tareas.filter(t => !t.completada);
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
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let tareas = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // para el CSS
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Mostrar tareas
app.get('/', (req, res) => {
    res.render('index', { tareas });
});

// Crear tarea
app.post('/crear', (req, res) => {
    const { titulo, categoria } = req.body;
    tareas.push({ titulo, categoria, completada: false });
    res.redirect('/');
});

// Marcar como completada (ejemplo simple)
app.post('/completar', (req, res) => {
    const index = req.body.index;
    tareas[index].completada = true;
    res.redirect('/');
});

// Eliminar completadas
app.post('/eliminarCompletadas', (req, res) => {
    tareas = tareas.filter(t => !t.completada);
    res.redirect('/');
});

// Eliminar tarea
app.post('/eliminar', (req, res) => {
    const index = parseInt(req.body.index, 10); // Convierte el índice a número
    if (!isNaN(index) && index >= 0 && index < tareas.length) {
        tareas.splice(index, 1); // Elimina la tarea del array
    }
    res.redirect('/'); // Redirige a la página principal
});

app.get('/filtrar', (req, res) => {
    const filtro = req.query.estado; // "todas", "completas", "incompletas"
    let tareasFiltradas = tareas;

    if (filtro === 'completas') {
        tareasFiltradas = tareas.filter(t => t.completada);
    } else if (filtro === 'incompletas') {
        tareasFiltradas = tareas.filter(t => !t.completada);
    }

    res.render('index', { tareas: tareasFiltradas });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
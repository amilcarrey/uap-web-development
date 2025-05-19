const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Necesario para recibir JSON en AJAX

// Almacenar tareas
let tasks = [];
let currentId = 1;

// Helper para manejar respuestas (AJAX o tradicional)
const handleResponse = (req, res, data, redirectUrl = '/') => {
  if (req.xhr || req.headers.accept.includes('application/json')) {
    res.json(data); // Respuesta para AJAX
  } else {
    res.redirect(redirectUrl); // Fallback tradicional
  }
};

// Listar tareas
app.get('/', (req, res) => {
  const filter = req.query.filter || 'all';
  let filteredTasks = tasks;
  
  if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed);
  if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  // Respuesta para AJAX (solo datos) o renderizado completo
  if (req.xhr || req.headers.accept.includes('application/json')) {
    res.json({ tasks: filteredTasks, filter });
  } else {
    res.render('index', { tasks: filteredTasks, filter });
  }
});

// Crear nueva tarea
app.post('/tasks', (req, res) => {
  const newTask = {
    id: currentId++,
    text: req.body.text,
    completed: false
  };
  tasks.push(newTask);
  handleResponse(req, res, newTask);
});

// Actualizar estado de tarea
app.post('/tasks/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (task) {
    task.completed = !task.completed;
    handleResponse(req, res, task);
  } else {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

// Eliminar tarea
app.post('/tasks/:id/delete', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  handleResponse(req, res, { success: true, id: taskId });
});

// Eliminar tareas completadas
app.post('/tasks/clear-completed', (req, res) => {
  tasks = tasks.filter(t => !t.completed);
  handleResponse(req, res, { success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuraciones
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Cargar tareas desde archivo JSON (si existe)
let tareas = [];
const archivoTareas = __dirname + '/tareas.json';

if (fs.existsSync(archivoTareas)) {
  tareas = JSON.parse(fs.readFileSync(archivoTareas));
}

// Rutas
app.get('/', (req, res) => {
  const estado = req.query.estado;
  console.log('Estado recibido:', estado); // Depuración
  const tareasFiltradas = estado ? tareas.filter(t => t.estado === estado) : tareas;
  console.log('Tareas filtradas:', tareasFiltradas); // Depuración

  res.render('index', { tareas: tareasFiltradas, estado });
});

app.post('/crear', (req, res) => {
  const estado = req.query.estado;

  const nueva = {
    id: Date.now(),
    titulo: req.body.titulo,
    estado: 'pendiente'
  };

  tareas.push(nueva);
  guardar();
  res.redirect(`/${estado ? '?estado=' + estado : ''}`);
});

app.post('/completar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const estado = req.query.estado;

  tareas = tareas.map(t =>
    t.id === id
      ? { ...t, estado: 'completada' }
      : t
  );
  guardar();
  res.redirect(`/${estado ? '?estado=' + estado : ''}`);
});

app.post('/eliminar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const estado = req.query.estado;

  tareas = tareas.filter(t => t.id !== id);
  guardar();
  res.redirect(`/${estado ? '?estado=' + estado : ''}`);
});

app.post('/eliminar-completadas', (req, res) => {
  const estado = req.query.estado;

  tareas = tareas.filter(t => t.estado !== 'completada');
  guardar();
  res.redirect(`/${estado ? '?estado=' + estado : ''}`);
});

// Función para guardar tareas
function guardar() {
  fs.writeFileSync(archivoTareas, JSON.stringify(tareas, null, 2));
}

app.listen(PORT, () => {
  console.log(`Servidor andando en http://localhost:${PORT}`);
});

// HTML para los botones de filtro
const botonesFiltro = `
<form method="GET" action="/" style="display:inline">
    <button type="submit" name="estado" value="">All</button>
</form>
<form method="GET" action="/" style="display:inline">
    <button type="submit" name="estado" value="pendiente">Pending</button>
</form>
<form method="GET" action="/" style="display:inline">
    <button type="submit" name="estado" value="completada">Completed</button>
</form>
`;

module.exports = { app, botonesFiltro };



const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Archivo para almacenar los todos
const todosFile = path.join(__dirname, 'todos.json');

// Función para leer los todos
async function readTodos() {
  try {
    const data = await fs.readFile(todosFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para guardar los todos
async function saveTodos(todos) {
  await fs.writeFile(todosFile, JSON.stringify(todos, null, 2));
}

// Rutas
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await readTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las tareas' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text, category = 'personal' } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'El texto de la tarea es requerido' });
    }

    const todos = await readTodos();
    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await saveTodos(todos);
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const todos = await readTodos();
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    todos[todoIndex] = { ...todos[todoIndex], ...updates };
    await saveTodos(todos);
    
    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await readTodos();
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);
    await saveTodos(todos);
    
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
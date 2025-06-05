const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'todos.json');

// Middleware
app.use(cors());
app.use(express.json());

// Función para leer el archivo JSON
async function readTodos() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe, crear uno con datos iniciales
        const initialData = [
            {
                id: 1,
                text: "Aprender React",
                completed: false
            },
            {
                id: 2,
                text: "Crear una API",
                completed: false
            }
        ];
        await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2));
        return initialData;
    }
}

// Función para escribir en el archivo JSON
async function writeTodos(todos) {
    await fs.writeFile(dataFile, JSON.stringify(todos, null, 2));
}

// Obtener todas las tareas (sin paginación)
app.get('/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        res.set('X-Total-Count', todos.length);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer las tareas' });
    }
});

// Crear una nueva tarea
app.post('/todos', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'El texto es requerido' });
        }

        const todos = await readTodos();
        const newTodo = {
            id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
            text,
            completed: false
        };

        todos.push(newTodo);
        await writeTodos(todos);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Actualizar una tarea
app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, text } = req.body;
        
        const todos = await readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
        
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const updatedTodo = {
            ...todos[todoIndex],
            ...(completed !== undefined && { completed }),
            ...(text !== undefined && { text })
        };

        todos[todoIndex] = updatedTodo;
        await writeTodos(todos);
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
        
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const updatedTodos = todos.filter(todo => todo.id !== parseInt(id));
        await writeTodos(updatedTodos);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Eliminar todas las tareas completadas
app.delete('/todos/completed', async (req, res) => {
    try {
        const todos = await readTodos();
        const updatedTodos = todos.filter(todo => !todo.completed);
        await writeTodos(updatedTodos);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al limpiar tareas completadas' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 
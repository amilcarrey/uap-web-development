const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Archivos para almacenar los datos
const boardsFile = path.join(__dirname, 'boards.json');
const todosFile = path.join(__dirname, 'todos.json');

// Función para leer los boards
async function readBoards() {
  try {
    const data = await fs.readFile(boardsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para guardar los boards
async function saveBoards(boards) {
  await fs.writeFile(boardsFile, JSON.stringify(boards, null, 2));
}

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

// Rutas para boards
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await readBoards();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los tableros' });
  }
});

app.get('/api/boards/:id', async (req, res) => {
  try {
    const boards = await readBoards();
    const board = boards.find(b => b.id === req.params.id);
    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el tablero' });
  }
});

app.post('/api/boards', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del tablero es requerido' });
    }

    const boards = await readBoards();
    const newBoard = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    boards.push(newBoard);
    await saveBoards(boards);
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
});

app.put('/api/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const boards = await readBoards();
    
    const boardIndex = boards.findIndex(board => board.id === id);
    if (boardIndex === -1) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    boards[boardIndex] = {
      ...boards[boardIndex],
      name: name.trim(),
      updatedAt: new Date().toISOString()
    };

    await saveBoards(boards);
    res.json(boards[boardIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tablero' });
  }
});

app.delete('/api/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const boards = await readBoards();
    const todos = await readTodos();
    
    const boardIndex = boards.findIndex(board => board.id === id);
    if (boardIndex === -1) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    // Eliminar el tablero
    const deletedBoard = boards[boardIndex];
    boards.splice(boardIndex, 1);
    await saveBoards(boards);

    // Eliminar todas las tareas asociadas al tablero
    const updatedTodos = todos.filter(todo => todo.boardId !== id);
    await saveTodos(updatedTodos);
    
    res.json(deletedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
});

// Rutas para todos
app.get('/api/todos/board/:boardId', async (req, res) => {
  try {
    const todos = await readTodos();
    const boardTodos = todos.filter(todo => todo.boardId === req.params.boardId);
    res.json(boardTodos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las tareas' });
  }
});

app.post('/api/todos/board/:boardId', async (req, res) => {
  try {
    const { text, category = 'personal' } = req.body;
    const { boardId } = req.params;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'El texto de la tarea es requerido' });
    }

    const todos = await readTodos();
    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      completed: false,
      boardId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await saveTodos(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const todos = await readTodos();
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
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

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 
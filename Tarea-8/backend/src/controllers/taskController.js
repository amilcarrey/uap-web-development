// backend/src/controllers/taskController.js
const asyncHandler = require('express-async-handler');
const { Task, Board, User } = require('../../models'); // Importa los modelos

// @desc    Obtener todas las tareas para un tablero específico
// @route   GET /api/boards/:boardId/tasks
// @access  Private (requiere autenticación y ser dueño del tablero)
exports.getAllTasks = asyncHandler(async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id; // ID del usuario autenticado

    // Primero, verifica que el tablero exista y pertenezca al usuario autenticado
    const board = await Board.findByPk(boardId);

    if (!board) {
        res.status(404);
        throw new Error('Tablero no encontrado');
    }

    if (board.userId !== userId) {
        res.status(403);
        throw new Error('No autorizado para acceder a este tablero');
    }

    // Si el tablero existe y pertenece al usuario, obtener las tareas
    const tasks = await Task.findAll({
        where: { boardId: boardId },
        include: [
            { model: User, as: 'user', attributes: ['id', 'username', 'email'] } // Incluye datos del usuario asociado a la tarea
        ],
        order: [['createdAt', 'ASC']] // Ordenar por fecha de creación
    });

    res.status(200).json(tasks);
});

// @desc    Crear una nueva tarea para un tablero específico
// @route   POST /api/boards/:boardId/tasks
// @access  Private (requiere autenticación y ser dueño del tablero)
exports.createTask = asyncHandler(async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id; // ID del usuario autenticado
    const { title, description, status, dueDate } = req.body; // Añadido dueDate aquí para manejarlo si está presente

    // Validaciones básicas
    if (!title) {
        res.status(400);
        throw new Error('El título de la tarea es requerido.');
    }

    // Verifica que el tablero exista y pertenezca al usuario autenticado
    const board = await Board.findByPk(boardId);

    if (!board) {
        res.status(404);
        throw new Error('Tablero no encontrado');
    }

    if (board.userId !== userId) {
        res.status(403);
        throw new Error('No autorizado para crear tareas en este tablero');
    }

    // Crea la tarea
    const task = await Task.create({
        title,
        description,
        status: status || 'to-do', // Usará 'to-do' si no se especifica o si es un valor inválido para ENUM
        dueDate: dueDate || null, // Guarda dueDate si se proporciona, de lo contrario null
        boardId: boardId,
        userId: userId, // La tarea es creada por el usuario autenticado
    });

    // Opcional: Puedes devolver la tarea con los datos del usuario si lo necesitas en el frontend
    const newTask = await Task.findByPk(task.id, {
         include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });

    res.status(201).json(newTask);
});

// @desc    Obtener una tarea específica
// @route   GET /api/tasks/:id
// @access  Private (requiere autenticación y ser dueño de la tarea/tablero)
exports.getTaskById = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findByPk(taskId, {
        include: [
            {
                model: Board,
                as: 'board',
                attributes: ['id', 'name', 'userId'], // Incluye userId del tablero para verificar propiedad
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'email']
            }
        ],
    });

    if (!task) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    // Verifica que el tablero al que pertenece la tarea sea del usuario autenticado
    if (task.board.userId !== userId) {
        res.status(403);
        throw new Error('No autorizado para acceder a esta tarea');
    }

    res.status(200).json(task);
});

// @desc    Actualizar una tarea específica
// @route   PUT /api/tasks/:id
// @access  Private (requiere autenticación y ser dueño de la tarea/tablero)
exports.updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, status, dueDate } = req.body; // Añadido dueDate aquí

    const task = await Task.findByPk(taskId, {
        include: [
            {
                model: Board,
                as: 'board',
                attributes: ['userId'], // Solo necesitamos el userId del tablero para verificar
            },
        ],
    });

    if (!task) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    // Verifica que el tablero al que pertenece la tarea sea del usuario autenticado
    if (task.board.userId !== userId) {
        res.status(403);
        throw new Error('No autorizado para actualizar esta tarea');
    }

    // Actualiza los campos
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description; // Permite setear descripción a null
    
    // Solo actualiza el status si se proporciona un valor válido para el ENUM
    if (status && ['to-do', 'in-progress', 'done'].includes(status)) {
        task.status = status;
    } else if (status !== undefined && !['to-do', 'in-progress', 'done'].includes(status)) {
        // Opcional: podrías enviar un error 400 si el status es inválido explícitamente
        // Por ahora, simplemente ignoraremos el status si es inválido, manteniendo el anterior
        console.warn(`Estado de tarea inválido proporcionado: ${status}. Manteniendo estado anterior.`);
    }

    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate; // Permite setear dueDate a null o actualizarlo

    await task.save();

    // Opcional: Devolver la tarea actualizada con datos del usuario
    const updatedTask = await Task.findByPk(task.id, {
         include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });

    res.status(200).json(updatedTask);
});

// @desc    Eliminar una tarea específica
// @route   DELETE /api/tasks/:id
// @access  Private (requiere autenticación y ser dueño de la tarea/tablero)
exports.deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findByPk(taskId, {
        include: [
            {
                model: Board,
                as: 'board',
                attributes: ['userId'],
            },
        ],
    });

    if (!task) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    // Verifica que el tablero al que pertenece la tarea sea del usuario autenticado
    if (task.board.userId !== userId) {
        res.status(403);
        throw new Error('No autorizado para eliminar esta tarea');
    }

    await task.destroy();

    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
});
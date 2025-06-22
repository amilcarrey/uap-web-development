const taskService = require('../services/taskService');
const permissionService = require('../services/permissionService');

const getTasks = async (req, res) => {
    try {
        console.log('🔍 getTasks - Iniciando...');
        console.log('🔍 Parámetros:', req.params);
        console.log('🔍 Usuario:', req.user);
        console.log('🔍 boardName desde req:', req.boardName);
        
        const boardName = req.boardName || req.params.boardName;
        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'viewer');

        console.log('🔍 Permisos:', permission);

        if (!permission.hasPermission) {
            console.log('❌ Sin permisos:', permission.error);
            return res.status(permission.status).json({ error: permission.error });
        }

        const tasks = await taskService.getTasks(permission.boardId);
        console.log('✅ Tareas obtenidas:', tasks.length);
        res.json(tasks);
    } catch (error) {
        console.error('❌ Error en getTasks:', error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

const createTask = async (req, res) => {
    try {
        console.log('🔍 createTask - Iniciando...');
        console.log('🔍 Parámetros:', req.params);
        console.log('🔍 Body:', req.body);
        console.log('🔍 Usuario:', req.user);
        console.log('🔍 boardName desde req:', req.boardName);
        
        const boardName = req.boardName || req.params.boardName;
        const { text } = req.body;

        if (!text || !text.trim()) {
            console.log('❌ Texto de tarea faltante');
            return res.status(400).json({ error: 'El texto de la tarea es requerido' });
        }

        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');

        console.log('🔍 Permisos:', permission);

        if (!permission.hasPermission) {
            console.log('❌ Sin permisos:', permission.error);
            return res.status(permission.status).json({ error: permission.error });
        }

        const newTask = await taskService.createTask(permission.boardId, text.trim());
        console.log('✅ Tarea creada:', newTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('❌ Error en createTask:', error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

const updateTask = async (req, res) => {
    try {
        const boardName = req.boardName || req.params.boardName;
        const { taskId } = req.params;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Se requieren campos para actualizar' });
        }

        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        // Verificar que la tarea pertenece al tablero
        const task = await taskService.getTaskById(taskId);
        if (task.board_id !== permission.boardId) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const updatedTask = await taskService.updateTask(taskId, updates);
        res.json(updatedTask);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error al actualizar la tarea';
        res.status(status).json({ error: message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const boardName = req.boardName || req.params.boardName;
        const { taskId } = req.params;

        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        // Verificar que la tarea pertenece al tablero
        const task = await taskService.getTaskById(taskId);
        if (task.board_id !== permission.boardId) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        await taskService.deleteTask(taskId);
        res.status(204).send();
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error al eliminar la tarea';
        res.status(status).json({ error: message });
    }
};

const deleteCompletedTasks = async (req, res) => {
    try {
        const boardName = req.boardName || req.params.boardName;

        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const deletedTasks = await taskService.deleteCompletedTasks(permission.boardId);
        res.json({ message: `${deletedTasks.length} tareas completadas eliminadas` });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar las tareas completadas' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    deleteCompletedTasks
}; 
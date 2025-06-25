const taskService = require('../services/taskService');
const permissionService = require('../services/permissionService');

const getTasks = async (req, res) => {
    try {
        const boardName = req.boardName || req.params.boardName;
        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'viewer');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        // Extraer parámetros de paginación y filtros
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const filter = req.query.filter || 'all';

        const result = await taskService.getTasksPaginated(
            permission.boardId, 
            page, 
            limit, 
            search, 
            filter
        );
        
        res.json(result);
    } catch (error) {
        console.error('❌ Error en getTasks:', error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

const createTask = async (req, res) => {
    try {
        const boardName = req.boardName || req.params.boardName;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'El texto de la tarea es requerido' });
        }

        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const newTask = await taskService.createTask(permission.boardId, text.trim());
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

        console.log('--- updateTask ---');
        console.log('boardName:', boardName);
        console.log('taskId:', taskId);
        console.log('updates:', updates);
        console.log('user:', req.user);

        if (!updates || Object.keys(updates).length === 0) {
            console.log('No hay campos para actualizar');
            return res.status(400).json({ error: 'Se requieren campos para actualizar' });
        }

        // Verificar que la tarea pertenece al tablero primero
        const task = await taskService.getTaskById(taskId);
        console.log('task:', task);
        
        // Obtener permisos del usuario
        const permission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'viewer');
        console.log('permission:', permission);

        if (!permission.hasPermission) {
            console.log('Sin permiso');
            return res.status(permission.status).json({ error: permission.error });
        }

        // Verificar que la tarea pertenece al tablero
        if (task.board_id !== permission.boardId) {
            console.log('Tarea no pertenece al tablero');
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        // Si solo está actualizando el estado 'completed', permitir para 'viewer'
        // Si está actualizando texto u otros campos, requerir 'editor'
        const isOnlyCompletedUpdate = Object.keys(updates).length === 1 && updates.completed !== undefined;
        console.log('isOnlyCompletedUpdate:', isOnlyCompletedUpdate);
        
        if (!isOnlyCompletedUpdate) {
            const editorPermission = await permissionService.checkBoardPermission(boardName, req.user.userId, 'editor');
            console.log('editorPermission:', editorPermission);
            if (!editorPermission.hasPermission) {
                console.log('Sin permiso de editor');
                return res.status(editorPermission.status).json({ error: editorPermission.error });
            }
        }

        const updatedTask = await taskService.updateTask(taskId, updates);
        console.log('updatedTask:', updatedTask);
        res.json(updatedTask);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error al actualizar la tarea';
        console.error('❌ Error en updateTask:', error);
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

        const result = await taskService.deleteCompletedTasks(permission.boardId);
        res.json({ message: `${result.deletedCount} tareas completadas eliminadas` });
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
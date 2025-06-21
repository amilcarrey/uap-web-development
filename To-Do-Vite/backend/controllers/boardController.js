const boardService = require('../services/boardService');
const permissionService = require('../services/permissionService');

const getBoards = async (req, res) => {
    try {
        const boards = await boardService.getBoardsForUser(req.user.userId);
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tableros' });
    }
};

const createBoard = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'El nombre y la categoría son requeridos' });
        }
        if (!['Personal', 'Universidad'].includes(category)) {
            return res.status(400).json({ error: 'La categoría debe ser Personal o Universidad' });
        }

        const newBoard = await boardService.createBoard(name, category, req.user.userId);
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tablero' });
    }
};

const deleteBoard = async (req, res) => {
    try {
        const { name } = req.params;
        const permission = await permissionService.checkBoardPermission(name, req.user.userId, 'owner');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const deletedBoard = await boardService.deleteBoard(permission.boardId);
        if (!deletedBoard) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tablero' });
    }
};

const shareBoard = async (req, res) => {
    try {
        const { name } = req.params;
        const { username, role } = req.body;

        if (!username || !role) {
            return res.status(400).json({ error: 'Usuario y rol son requeridos' });
        }
        if (!['viewer', 'editor'].includes(role)) {
            return res.status(400).json({ error: 'El rol debe ser viewer o editor' });
        }

        const permission = await permissionService.checkBoardPermission(name, req.user.userId, 'owner');
        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const result = await boardService.shareBoard(permission.boardId, username, role);
        res.status(201).json(result);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error al compartir el tablero';
        res.status(status).json({ error: message });
    }
};

const getBoardUsers = async (req, res) => {
    try {
        const { name } = req.params;
        const permission = await permissionService.checkBoardPermission(name, req.user.userId, 'viewer');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const users = await boardService.getBoardUsers(permission.boardId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios del tablero' });
    }
};

const removeUserFromBoard = async (req, res) => {
    try {
        const { name, username } = req.params;
        const permission = await permissionService.checkBoardPermission(name, req.user.userId, 'owner');

        if (!permission.hasPermission) {
            return res.status(permission.status).json({ error: permission.error });
        }

        const result = await boardService.removeUserFromBoard(permission.boardId, username);
        res.json(result);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Error al remover el usuario';
        res.status(status).json({ error: message });
    }
};

module.exports = {
    getBoards,
    createBoard,
    deleteBoard,
    shareBoard,
    getBoardUsers,
    removeUserFromBoard
}; 
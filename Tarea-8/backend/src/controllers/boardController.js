// backend/src/controllers/boardController.js
const db = require('../../models'); // Asegurate que la ruta sea correcta
const Board = db.Board;
const User = db.User; // Necesitamos el modelo User para algunas validaciones o relaciones

// @desc    Obtener todos los tableros del usuario autenticado
// @route   GET /api/boards
// @access  Private
exports.getBoards = async (req, res) => {
    try {
        // Buscamos todos los tableros donde el userId coincida con el usuario autenticado
        const boards = await Board.findAll({
            where: { userId: req.user.id } // req.user.id viene del middleware de autenticación
        });
        res.status(200).json(boards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al obtener tableros.' });
    }
};

// @desc    Obtener un tablero por ID
// @route   GET /api/boards/:id
// @access  Private
exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id // Aseguramos que solo el propietario pueda ver su tablero
            }
        });

        if (!board) {
            return res.status(404).json({ message: 'Tablero no encontrado o no autorizado.' });
        }

        res.status(200).json(board);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al obtener el tablero.' });
    }
};

// @desc    Crear un nuevo tablero
// @route   POST /api/boards
// @access  Private
exports.createBoard = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'El nombre del tablero es requerido.' });
    }

    try {
        const newBoard = await Board.create({
            name,
            description,
            userId: req.user.id // Asignamos el tablero al usuario autenticado
        });
        res.status(201).json(newBoard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al crear el tablero.' });
    }
};

// @desc    Actualizar un tablero
// @route   PUT /api/boards/:id
// @access  Private
exports.updateBoard = async (req, res) => {
    const { name, description } = req.body;

    try {
        const board = await Board.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id // Solo el propietario puede actualizar
            }
        });

        if (!board) {
            return res.status(404).json({ message: 'Tablero no encontrado o no autorizado.' });
        }

        board.name = name || board.name;
        board.description = description || board.description;

        await board.save();
        res.status(200).json({ message: 'Tablero actualizado exitosamente.', board });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al actualizar el tablero.' });
    }
};

// @desc    Eliminar un tablero
// @route   DELETE /api/boards/:id
// @access  Private
exports.deleteBoard = async (req, res) => {
    try {
        const board = await Board.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id // Solo el propietario puede eliminar
            }
        });

        if (!board) {
            return res.status(404).json({ message: 'Tablero no encontrado o no autorizado.' });
        }

        await board.destroy();
        res.status(200).json({ message: 'Tablero eliminado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al eliminar el tablero.' });
    }
};
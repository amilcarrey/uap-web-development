const prisma = require("../../prisma/client");

// Obtener tableros donde el usuario tiene acceso
exports.getUserBoards = async (req, res) => {
  const userId = req.user.id;
  try {
    const accessList = await prisma.boardAccess.findMany({
      where: { userId },
      include: { board: true }
    });

    const boards = accessList.map(a => ({
      id: a.board.id,
      name: a.board.name,
      role: a.role
    }));

    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tableros" });
  }
};

// Crear un nuevo tablero y dar acceso OWNER
exports.createBoard = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
        accesses: {
          create: {
            userId,
            role: "OWNER"
          }
        }
      }
    });

    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ error: "No se pudo crear el tablero" });
  }
};

// Eliminar un tablero (solo OWNER puede hacerlo)
exports.deleteBoard = async (req, res) => {
  const userId = req.user.id;
  const boardId = parseInt(req.params.id);

  const access = await prisma.boardAccess.findFirst({
    where: { boardId, userId }
  });

  if (!access || access.role !== "OWNER") {
    return res.status(403).json({ error: "No autorizado" });
  }

  try {
    await prisma.board.delete({
      where: { id: boardId }
    });
    res.json({ message: "Tablero eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar tablero" });
  }
};

// Compartir un tablero con otro usuario
exports.shareBoard = async (req, res) => {
  const { email, boardId, role } = req.body;
  const userId = req.user.id;

  const board = await prisma.board.findUnique({
    where: { id: boardId }
  });

  if (!board || board.ownerId !== userId) {
    return res.status(403).json({ error: "Solo el propietario puede compartir" });
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) return res.status(404).json({ error: "Usuario no encontrado" });

  try {
    await prisma.boardAccess.upsert({
      where: {
        userId_boardId: {
          userId: targetUser.id,
          boardId
        }
      },
      update: { role },
      create: {
        userId: targetUser.id,
        boardId,
        role
      }
    });

    res.json({ message: "Acceso otorgado correctamente" });
  } catch (err) {
    res.status(400).json({ error: "No se pudo compartir el tablero" });
  }
};

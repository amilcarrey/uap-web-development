const tableroService = require('../services/tableroService');

// Crea un nuevo tablero para el usuario autenticado
const crearTablero = async (req, res) => {
  const usuarioId = req.usuario.id_usuario;
  const { nombre, descripcion } = req.body;

  try {
    const tablero = await tableroService.crearTablero(usuarioId, { nombre, descripcion });
    res.status(201).json(tablero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear tablero' });
  }
};

// Obtiene los tableros propios del usuario autenticado
const obtenerTablerosPropios = async (req, res) => {
  try {
    const tableros = await tableroService.obtenerTablerosPropios(req.usuario.id_usuario);
    res.json(tableros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tableros propios' });
  }
};

// Obtiene los tableros compartidos con el usuario autenticado
const obtenerTablerosCompartidos = async (req, res) => {
  try {
    const tableros = await tableroService.obtenerTablerosCompartidos(req.usuario.id_usuario);
    res.json(tableros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tableros compartidos' });
  }
};

// Obtiene un tablero por su ID
const obtenerTableroPorId = async (req, res) => {
  try {
    const tablero = await tableroService.obtenerTableroPorId(req.params.id);
    if (!tablero) return res.status(404).json({ mensaje: 'Tablero no encontrado' });
    res.json(tablero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tablero' });
  }
};

// Edita un tablero existente por su ID
const editarTablero = async (req, res) => {
  try {
    const tablero = await tableroService.editarTablero(req.params.id, req.body);
    if (!tablero) return res.status(404).json({ mensaje: 'Tablero no encontrado' });
    res.json(tablero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al editar tablero' });
  }
};

// Elimina un tablero por su ID
const eliminarTablero = async (req, res) => {
  try {
    const eliminado = await tableroService.eliminarTablero(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Tablero no encontrado' });
    res.json({ mensaje: 'Tablero eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar tablero' });
  }
};

module.exports = {
  crearTablero,
  obtenerTablerosPropios,
  obtenerTablerosCompartidos,
  obtenerTableroPorId,
  editarTablero,
  eliminarTablero,
};

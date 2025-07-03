// Importa los modelos Tablero y Permiso
const Tablero = require('../models/Tablero');
const Permiso = require('../models/Permiso');

// Crea un nuevo tablero y asigna el permiso de propietario al usuario creador
const crearTablero = async (usuarioId, { nombre, descripcion }) => {
  const tablero = await Tablero.create({
    nombre,
    descripcion,
    propietario_id: usuarioId
  });

  // Crea el permiso de propietario para el usuario en el nuevo tablero
  await Permiso.create({
    usuario_id: usuarioId,
    tablero_id: tablero.id_tablero,
    permiso: 'propietario'
  });

  return tablero;
};

// Obtiene todos los tableros donde el usuario es propietario
const obtenerTablerosPropios = async (usuarioId) => {
  return await Tablero.findAll({
    where: { propietario_id: usuarioId }
  });
};

// Obtiene todos los tableros compartidos con el usuario (como editor o lector)
const obtenerTablerosCompartidos = async (usuarioId) => {
  // Busca los permisos de tipo editor o lector del usuario
  const permisos = await Permiso.findAll({
    where: {
      usuario_id: usuarioId,
      permiso: ['editor', 'lector']
    }
  });

  // Extrae los IDs de los tableros compartidos
  const tableroIds = permisos.map(p => p.tablero_id);

  // Busca los tableros correspondientes a esos IDs
  return await Tablero.findAll({
    where: { id_tablero: tableroIds }
  });
};

// Obtiene un tablero por su ID
const obtenerTableroPorId = async (tableroId) => {
  return await Tablero.findByPk(tableroId);
};

// Edita el nombre y/o descripción de un tablero existente
const editarTablero = async (tableroId, { nombre, descripcion }) => {
  const tablero = await Tablero.findByPk(tableroId);
  if (!tablero) return null;

  tablero.nombre = nombre || tablero.nombre;
  tablero.descripcion = descripcion || tablero.descripcion;
  await tablero.save();

  return tablero;
};

// Elimina un tablero y sus permisos asociados
const eliminarTablero = async (tableroId) => {
  const tablero = await Tablero.findByPk(tableroId);
  if (!tablero) return false;

  // Elimina los permisos asociados al tablero para evitar errores de clave foránea
  await Permiso.destroy({ where: { tablero_id: tableroId } });

  // Elimina el tablero
  await tablero.destroy();
  return true;
};

// Exporta las funciones del servicio
module.exports = {
  crearTablero,
  obtenerTablerosPropios,
  obtenerTablerosCompartidos,
  obtenerTableroPorId,
  editarTablero,
  eliminarTablero,
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Tablero = require('./Tablero');

// Definición del modelo Permiso
const Permiso = sequelize.define('Permiso', {
  // Clave foránea y primaria: usuario_id
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario, // Referencia al modelo Usuario
      key: 'id_usuario'
    }
  },
  // Clave foránea y primaria: tablero_id
  tablero_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Tablero, // Referencia al modelo Tablero
      key: 'id_tablero'
    }
  },
  // Tipo de permiso
  permiso: {
    type: DataTypes.ENUM('propietario', 'editor', 'lector'),
    allowNull: false
  }
}, {
  tableName: 'Permisos', // Nombre de la tabla en la base de datos
  timestamps: false // No usar campos createdAt/updatedAt
});

// Relaciones con otros modelos
Permiso.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Permiso.belongsTo(Tablero, { foreignKey: 'tablero_id' });

module.exports = Permiso;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

// Definición del modelo Tablero
const Tablero = sequelize.define('Tablero', {
  id_tablero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Clave primaria autoincremental
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false // El nombre es obligatorio
  },
  descripcion: DataTypes.TEXT, // Descripción opcional
  propietario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario, // Relación con el modelo Usuario
      key: 'id_usuario'
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Fecha de creación por defecto
  }
}, {
  tableName: 'Tableros', // Nombre de la tabla en la base de datos
  timestamps: false // No usar campos createdAt y updatedAt
});

// Relación: Un tablero pertenece a un usuario (propietario)
Tablero.belongsTo(Usuario, { foreignKey: 'propietario_id' });

module.exports = Tablero;

// Importa los tipos de datos de Sequelize
const { DataTypes } = require('sequelize');
// Importa la instancia de conexión a la base de datos
const sequelize = require('../config/database');

// Define el modelo Usuario
const Usuario = sequelize.define('Usuario', {
  // Campo ID de usuario, clave primaria y autoincremental
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Nombre de usuario, no puede ser nulo
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Correo electrónico, único y no puede ser nulo
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Contraseña, no puede ser nula
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Fecha de creación, valor por defecto: ahora
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  // Nombre de la tabla en la base de datos
  tableName: 'Usuarios',
  // No usar timestamps automáticos (createdAt, updatedAt)
  timestamps: false,
});

// Exporta el modelo Usuario
module.exports = Usuario;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tablero = require('./Tablero');

// Definición del modelo Tarea
const Tarea = sequelize.define('Tarea', {
  id_tarea: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Clave primaria
    autoIncrement: true // Autoincremental
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false // No permite valores nulos
  },
  completada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Valor por defecto: false
  },
  tablero_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Tablero, // Relación con el modelo Tablero
      key: 'id_tablero'
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Fecha de creación por defecto: ahora
  }
}, {
  tableName: 'Tareas', // Nombre de la tabla en la base de datos
  timestamps: false // No usa campos createdAt ni updatedAt
});

// Relación: una tarea pertenece a un tablero
Tarea.belongsTo(Tablero, { foreignKey: 'tablero_id' });

module.exports = Tarea;

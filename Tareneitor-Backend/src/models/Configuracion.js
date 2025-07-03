const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

// Definición del modelo Configuracion
const Configuracion = sequelize.define('Configuracion', {
  id_config: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Clave primaria autoincremental
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    unique: true, // Cada usuario tiene una configuración única
    allowNull: false,
    references: {
      model: Usuario, // Relación con el modelo Usuario
      key: 'id_usuario'
    }
  },
  auto_refresh_interval: {
    type: DataTypes.INTEGER // Intervalo de auto-refresco (en minutos, por ejemplo)
  },
  tema: {
    type: DataTypes.TEXT,
    defaultValue: 'claro' // Tema por defecto: claro
  },
  notificaciones: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // Notificaciones activadas por defecto
  },
  idioma: {
    type: DataTypes.TEXT,
    defaultValue: 'es' // Idioma por defecto: español
  }
}, {
  tableName: 'Configuraciones', // Nombre de la tabla en la base de datos
  timestamps: false // No se usan campos createdAt ni updatedAt
});

// Relación con Usuario (Configuracion pertenece a Usuario)
Configuracion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Configuracion;

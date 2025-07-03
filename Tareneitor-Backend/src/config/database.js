// Importa el módulo Sequelize desde la librería 'sequelize'
const { Sequelize } = require('sequelize');
// Importa el módulo 'path' para trabajar con rutas de archivos
const path = require('path');

// Crea una nueva instancia de Sequelize configurada para usar SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite', // Especifica que se usará SQLite como base de datos
  storage: path.join(__dirname, '../../tareas.db'), // Ruta al archivo de la base de datos
  logging: false, // Desactiva el logging de consultas SQL en consola
});

// Exporta la instancia de Sequelize para usarla en otros archivos
module.exports = sequelize;

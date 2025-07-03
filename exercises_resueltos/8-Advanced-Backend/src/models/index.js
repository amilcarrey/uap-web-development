const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Use our programmatic config first, then CLI config as fallback
const dbConfig = require(__dirname + '/../config/database.js')[env];
const cliConfig = require(__dirname + '/../config/config.json')[env]; // For CLI compatibility if needed

const db = {};

let sequelize;
if (dbConfig.url) { // Prioritize programmatic config with DATABASE_URL
  sequelize = new Sequelize(dbConfig.url, dbConfig);
} else if (cliConfig.use_env_variable) { // Fallback to CLI style if programmatic URL not set
  sequelize = new Sequelize(process.env[cliConfig.use_env_variable], cliConfig);
} else { // Fallback to individual params (less common with our setup)
  sequelize = new Sequelize(cliConfig.database, cliConfig.username, cliConfig.password, cliConfig);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

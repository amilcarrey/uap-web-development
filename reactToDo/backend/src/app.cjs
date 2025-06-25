const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sincroniza la base de datos
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Cambia si tu frontend está en otro puerto
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
});

module.exports = app;
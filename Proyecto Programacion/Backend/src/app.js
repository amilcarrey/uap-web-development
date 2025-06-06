// Configuración de la app Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;

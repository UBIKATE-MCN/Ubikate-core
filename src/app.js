const path = require('path');
const express = require('express');
const cors = require('cors');
const { corsOrigins } = require('../config/env');
const healthRoutes = require('./routes/health');

const app = express();

// CORS: el frontend (React/Vite) y el backend viven en puertos distintos
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

// Archivos estáticos (/public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de la API
app.use('/api/health', healthRoutes);

// 404 para rutas de la API que no existen
app.use('/api', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

// Gestor de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

module.exports = app;

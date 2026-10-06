const { Router } = require('express');
const { comprobarConexion } = require('../../config/db');

const router = Router();

// GET /api/health -> el servidor está vivo
router.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'ubikate-core', timestamp: new Date().toISOString() });
});

// GET /api/health/db -> la base de datos responde
router.get('/db', async (req, res) => {
    try {
        await comprobarConexion();
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(503).json({ status: 'error', database: 'unreachable', code: err.code || 'UNKNOWN' });
    }
});

module.exports = router;

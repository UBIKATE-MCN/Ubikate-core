const mysql = require('mysql2/promise');
const { db } = require('./env');

// El pool no abre conexiones hasta la primera consulta.
const pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    charset: 'utf8mb4', // ñ y tildes de los nombres de barrios
    waitForConnections: true,
    connectionLimit: 10
});

// Comprueba que la BD responde. Lanza error si no hay conexión. //
async function comprobarConexion() {
    await pool.query('SELECT 1');
    return true;
}

module.exports = { pool, comprobarConexion };

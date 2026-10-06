require('dotenv').config({ quiet: true });

module.exports = {
    port: Number(process.env.PORT) || 5000,
    corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3307,
        user: process.env.DB_USER || 'ubikate_user',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ubikate_db'
    },
    madridApi: {
        baseUrl: process.env.MADRID_API_BASE_URL || 'https://datos.madrid.es',
        token: process.env.MADRID_API_TOKEN || ''
    }
};

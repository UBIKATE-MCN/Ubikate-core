const app = require('./app');
const { port } = require('../config/env');

app.listen(port, () => {
    console.log(`Ubikate backend escuchando en http://localhost:${port}`);
});

// Desde la raíz del repositorio: node tests/fase5/banco.cjs
const { once } = require('node:events');
const { conBaseTemporal } = require('./entorno.cjs');

const estados = [];
function ficha(id, titulo, lineas, estado) {
  console.log('\n[' + id + '] ' + titulo);
  for (const linea of lineas) console.log(linea);
  console.log('Estado: ' + estado);
  estados.push(estado);
}
const evaluar = (ok) => ok ? 'Conforme' : 'No conforme';

async function ejecutar({ version, detener }) {
  // El pool debe tomar las variables de la instancia temporal antes de abrir la primera conexión.
  const app = require('../../src/app');
  const Usuario = require('../../src/models/Usuario');
  const { pool } = require('../../config/db');
  const api = app.listen(0, '127.0.0.1');
  await once(api, 'listening');
  const origen = 'http://127.0.0.1:' + api.address().port;
  async function get(ruta) {
    const r = await fetch(origen + ruta, { signal: AbortSignal.timeout(5000) });
    return { status: r.status, tipo: r.headers.get('content-type'), json: await r.json() };
  }
  const huella = (r) => ['HTTP ' + r.status + ' | ' + r.tipo, JSON.stringify(r.json)];
  console.log('UBIKATE | Grupo 8 | ' + new Date().toISOString());
  console.log('Node ' + process.version + ' | MariaDB ' + version + ' | ' + origen);
  try {
    const r = await get('/api/health');
    const fecha = r.json.timestamp;
    ficha('CP-01', 'Estado de la API', ['GET /api/health', ...huella(r)], evaluar(
      r.status === 200 && r.tipo?.includes('application/json') && r.json.status === 'ok' &&
      r.json.service === 'ubikate-core' && typeof fecha === 'string' &&
      !Number.isNaN(Date.parse(fecha)) && new Date(fecha).toISOString() === fecha));

    const ruta = '/api/qa-inexistente';
    const e = await get(ruta);
    ficha('CP-02', 'Ruta desconocida', ['GET ' + ruta, ...huella(e)], evaluar(
      e.status === 404 && e.tipo?.includes('application/json') &&
      e.json.status === 'error' && e.json.message === 'Ruta no encontrada'));

    const bd = await get('/api/health/db');
    ficha('CP-03', 'Conexión con MariaDB', ['GET /api/health/db', ...huella(bd)], evaluar(
      bd.status === 200 && bd.json.status === 'ok' && bd.json.database === 'connected'));

    const correo = 'prueba@example.test';
    const usuario = new Usuario(1, correo, 'clave-de-prueba');
    const valida = usuario.login(correo, 'clave-de-prueba');
    const erronea = usuario.login(correo, 'otra-clave');
    const vacia = usuario.login(correo, '');
    ficha('CP-05', 'Validación de la contraseña', ['Usuario.login() | instancia en memoria',
      'Clave correcta -> ' + valida, 'Clave incorrecta -> ' + erronea, 'Clave vacía -> ' + vacia],
      evaluar(valida === true && erronea === false && vacia === false));

    const ejes = ['seguridad', 'salud', 'movilidad', 'servicios'];
    await pool.query("INSERT INTO DISTRITO (id_distrito,nombre) VALUES (901,'Centro'),(902,'Retiro')");
    for (const [i, eje] of ejes.entries()) {
      await pool.execute('INSERT INTO DATOS_MUNICIPIO (id_distrito,eje,valor,fuente) VALUES (901,?,?,?), (902,?,?,?)',
        [eje, i + 5, 'fixture QA', eje, i + 1, 'fixture QA']);
    }
    const trazas = ['Distritos 901 y 902 | 8 indicadores sintéticos', 'GET /api/distritos/901/indicadores?eje=…'];
    const respuestas = [];
    let filtrosCorrectos = true;
    for (const [i, eje] of ejes.entries()) {
      const f = await get('/api/distritos/901/indicadores?eje=' + eje);
      respuestas.push(f);
      trazas.push(eje + ' -> ' + f.status + ' ' + JSON.stringify(f.json));
      const fila = Array.isArray(f.json) && f.json.length === 1 && f.json[0];
      filtrosCorrectos &&= f.status === 200 && fila?.id_distrito === 901 && fila.eje === eje &&
        Number(fila.valor) === i + 5;
    }
    const sinRuta = respuestas.every(v => v.status === 404 && v.json.message === 'Ruta no encontrada');
    ficha('CP-06', 'Filtro por distrito y eje', trazas, sinRuta ? 'Bloqueado' : evaluar(filtrosCorrectos));

    const sesion = await pool.getConnection();
    try {
      await sesion.beginTransaction();
      const insertar = 'INSERT INTO VIVIENDA (id_distrito,direccion) VALUES (?,?)';
      const [alta] = await sesion.execute(insertar, [901, 'Vivienda QA']);
      let codigo = 'ACEPTADO';
      try { await sesion.execute(insertar, [999, 'Vivienda QA']); }
      catch (err) { codigo = err.code; }
      const [[antes]] = await sesion.query("SELECT COUNT(*) AS n FROM VIVIENDA WHERE direccion='Vivienda QA'");
      await sesion.rollback();
      const [[despues]] = await sesion.query("SELECT COUNT(*) AS n FROM VIVIENDA WHERE direccion='Vivienda QA'");
      ficha('CP-07', 'Integridad de la vivienda', ['INSERT con distrito 901 -> ' + alta.affectedRows + ' fila',
        'INSERT con distrito 999 -> ' + codigo, 'Filas antes de ROLLBACK: ' + antes.n,
        'Filas después de ROLLBACK: ' + despues.n],
        evaluar(alta.affectedRows === 1 && codigo === 'ER_NO_REFERENCED_ROW_2' && antes.n === 1 && despues.n === 0));
    } finally { await sesion.rollback(); sesion.release(); }

    await detener();
    const caida = await get('/api/health/db');
    const salud = await get('/api/health');
    ficha('CP-04', 'Caída de la base de datos', ['MariaDB temporal detenida', 'GET /api/health/db',
      ...huella(caida), 'GET /api/health -> ' + salud.status + ' ' + salud.json.status], evaluar(
      caida.status === 503 && caida.json.status === 'error' && caida.json.database === 'unreachable' &&
      typeof caida.json.code === 'string' && caida.json.code.length > 0 &&
      salud.status === 200 && salud.json.status === 'ok'));
  } finally {
    await pool.end();
    await new Promise((ok) => api.close(ok));
  }
}

conBaseTemporal(ejecutar).then(() => {
  console.log('\nRESULTADO | ' + estados.filter(e => e === 'Conforme').length + ' conformes | ' +
    estados.filter(e => e === 'No conforme').length + ' no conformes | ' +
    estados.filter(e => e === 'Bloqueado').length + ' bloqueados');
  if (estados.some(e => e !== 'Conforme')) process.exitCode = 1;
}).catch(err => { console.error('Banco interrumpido:', err.message); process.exitCode = 2; });


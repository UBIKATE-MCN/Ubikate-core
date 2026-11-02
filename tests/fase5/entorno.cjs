// Arranca una instancia desechable de MariaDB. No utiliza el servicio de XAMPP del equipo.
const { execFileSync, spawn } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { setTimeout: esperar } = require('node:timers/promises');
const mysql = require('mysql2/promise');

const esquema = path.resolve(__dirname, '../../config/ubikate_db.sql');

async function puertoLibre() {
  const reserva = net.createServer();
  reserva.listen(0, '127.0.0.1');
  await once(reserva, 'listening');
  const puerto = reserva.address().port;
  await new Promise((ok) => reserva.close(ok));
  return puerto;
}

async function conBaseTemporal(probar) {
  const carpetaMaria = process.env.XAMPP_MYSQL ||
    (fs.existsSync('C:/XamppJava/mysql/bin/mysqld.exe') ? 'C:/XamppJava/mysql' : 'C:/xampp/mysql');
  const bin = path.join(carpetaMaria, 'bin');
  if (!['mysqld.exe', 'mysql_install_db.exe'].every(nombre => fs.existsSync(path.join(bin, nombre)))) {
    throw new Error('Indica la carpeta mysql de XAMPP para Windows en la variable XAMPP_MYSQL.');
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ubikate-qa-'));
  const datos = path.join(dir, 'datos');
  const puerto = await puertoLibre();
  const claveAdmin = randomBytes(24).toString('hex');
  const claveApp = randomBytes(24).toString('hex');
  let servidor, salida, admin, verificada = false;
  async function detener() {
    if (!servidor || servidor.exitCode !== null || servidor.signalCode) return;
    if (admin && verificada) {
      try { await admin.query('SHUTDOWN'); } catch (error) {
        if (!['PROTOCOL_CONNECTION_LOST', 'ECONNRESET', 'EPIPE'].includes(error.code)) throw error;
      }
    } else servidor.kill();
    await salida;
  }
  try {
    execFileSync(path.join(bin, 'mysql_install_db.exe'),
      ['--datadir=' + datos, '--port=' + puerto, '--password=' + claveAdmin, '--silent'],
      { windowsHide: true, stdio: 'ignore', timeout: 90000 });
    servidor = spawn(path.join(bin, 'mysqld.exe'), ['--no-defaults', '--datadir=' + datos,
      '--port=' + puerto, '--bind-address=127.0.0.1', '--log-error=' + path.join(dir, 'maria.log')],
      { windowsHide: true, stdio: 'ignore' });
    salida = once(servidor, 'exit');
    for (let i = 0; i < 100 && !admin; i++) {
      if (servidor.exitCode !== null) throw new Error('MariaDB no pudo arrancar.');
      try {
        admin = await mysql.createConnection({ host: '127.0.0.1', port: puerto, user: 'root',
          password: claveAdmin, multipleStatements: true });
      } catch (e) {
        if (e.code !== 'ECONNREFUSED') throw e;
        await esperar(150);
      }
    }
    if (!admin) throw new Error('La instancia de prueba no respondió a tiempo.');
    const [[motor]] = await admin.query('SELECT @@datadir AS dir, VERSION() AS version');
    if (path.resolve(motor.dir).toLowerCase() !== path.resolve(datos).toLowerCase()) {
      throw new Error('El directorio de MariaDB no coincide con el creado por el banco.');
    }
    verificada = true;
    await admin.query(fs.readFileSync(esquema, 'utf8'));
    await admin.query("CREATE USER 'ubikate_qa'@'localhost' IDENTIFIED BY ?", [claveApp]);
    await admin.query("GRANT SELECT, INSERT, UPDATE, DELETE ON ubikate_db.* TO 'ubikate_qa'@'localhost'");
    Object.assign(process.env, { DB_HOST: '127.0.0.1', DB_PORT: String(puerto), DB_NAME: 'ubikate_db',
      DB_USER: 'ubikate_qa', DB_PASSWORD: claveApp });
    await probar({ version: motor.version, detener });
  } finally {
    try { await detener(); } finally {
      if (admin) admin.destroy();
      if (servidor && servidor.exitCode === null && !servidor.signalCode) {
        servidor.kill(); await salida;
      }
      // Solo se limpia el directorio devuelto por mkdtempSync en esta ejecución.
      if (path.dirname(dir) === path.resolve(os.tmpdir()) && path.basename(dir).startsWith('ubikate-qa-')) {
        fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      }
    }
  }
}

module.exports = { conBaseTemporal };


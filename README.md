# UBIKATE (Ubikate-core)

Plataforma web que **puntúa viviendas de Madrid con 4 ejes** usando datos abiertos oficiales (Open Data del Ayuntamiento de Madrid), para que quien busca casa pueda ver cómo es el entorno y no solo el precio y los metros cuadrados.

Este repositorio contiene el **backend** (Node.js + Express), el modelo de clases POO, la configuración y el script de base de datos.

> **Equipo (Grupo 8, DAW):** Manuel Rodríguez Vaca · Ignacio de Loyola Cortés Martínez · Carlos Piñas López

---

## 1. Stack tecnológico y por qué

| Pieza | Uso en Ubikate | Por qué |
|---|---|---|
| **Node.js + Express** | Backend / API REST | E/S no bloqueante: permite consultar varias APIs externas a la vez sin bloquear el hilo principal. |
| **React + Vite** | Frontend (mapa y 4 ejes) | Interfaz por componentes; el mapa y los colores de los ejes se actualizan sin recargar la página. *(Pendiente de incorporar al repositorio.)* |
| **MariaDB (MySQL) + XAMPP** | Base de datos relacional | Motor **InnoDB**: claves foráneas e integridad referencial entre viviendas, usuarios y distritos. |
| **Postman** | Pruebas de API | Inspeccionar cabeceras, validar el JSON y medir latencia del portal de datos abiertos antes de programar la lógica. |
| **VS Code + Live Share** | Desarrollo | Trabajo colaborativo síncrono entre los tres integrantes. |
| **GitHub + Render** | Control de versiones y despliegue | Cada cambio en `main` puede lanzar un despliegue automático en Render. |

---

## 2. Requisitos del sistema

**Software**

- Node.js **22 LTS o superior** y npm (`node -v`, `npm -v`)
- XAMPP **v3.3.0** (incluye MariaDB y su panel de control)
- Git
- Recomendado: VS Code con la extensión Live Share y MySQL Workbench

**Hardware recomendado:** CPU de 4 núcleos, 16 GB de RAM y SSD.
**Sistemas probados:** Windows 10/11 (también válido en macOS y Ubuntu).

---

## 3. Estructura del repositorio

```
ubikate-core/
├── src/                  # Código del backend
│   ├── models/           # Clases POO: Usuario, Vivienda, Distrito, Calculadora4ejes, APIConnector
│   ├── routes/           # Rutas de la API (health, ...)
│   ├── app.js            # Configuración de Express (CORS, JSON, rutas)
│   └── server.js         # Arranque del servidor
├── public/               # Archivos estáticos que sirve Express
├── config/               # Configuración
│   ├── env.js            # Lectura de variables de entorno
│   ├── db.js             # Conexión a MariaDB (pool mysql2)
│   └── ubikate_db.sql    # Script de creación de la base de datos
├── docs/                 # Documentación del proyecto
│   ├── guia-instalacion.md # Guía rápida de instalación y despliegue local
│   ├── git-workflow.md   # Flujo de ramas y commits
│   ├── troubleshooting.md# Registro de problemas y soluciones
│   └── img/              # Capturas de evidencias
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Instalación paso a paso

> Versión resumida para el equipo: [`docs/guia-instalacion.md`](docs/guia-instalacion.md).

### 4.1 Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/UBIKATE-MCN/Ubikate-core.git
cd Ubikate-core
npm install
```

### 4.2 Arrancar la base de datos (XAMPP + MariaDB)

1. Abre el **Panel de control de XAMPP** y pulsa **Start** en *MySQL*.
2. En este proyecto MariaDB escucha en el **puerto 3307** (el 3306 estaba ocupado en nuestros equipos; ver [troubleshooting](docs/troubleshooting.md)). Está configurado en `xampp/mysql/bin/my.ini`:

   ```ini
   [client]
   port=3307

   [mysqld]
   port=3307
   ```

3. Crea el esquema ejecutando `config/ubikate_db.sql` desde MySQL Workbench (conexión a `localhost:3307`) o por consola:

   ```bash
   mysql -u root -P 3307 -h 127.0.0.1 < config/ubikate_db.sql
   ```

   El script crea la base `ubikate_db` con codificación `utf8mb4` y cotejamiento `utf8mb4_spanish_ci` (soporte de "ñ" y tildes en los nombres de barrios) y las tablas `DISTRITO`, `VIVIENDA`, `USUARIO`, `USUARIO_FAVORITOS` y `DATOS_MUNICIPIO`.

4. Crea un usuario dedicado para el backend (no se usa `root`), con permisos solo de lectura y escritura de datos:

   ```sql
   CREATE USER 'ubikate_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ubikate_db.* TO 'ubikate_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 4.3 Variables de entorno

Copia la plantilla y rellena tus valores (el archivo `.env` **no se sube a GitHub**):

```bash
cp .env.example .env      # en Windows (cmd): copy .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor Express | `5000` |
| `CORS_ORIGIN` | Origen(es) del frontend permitidos, separados por comas | `http://localhost:3000` |
| `DB_HOST` | Servidor de la base de datos | `localhost` |
| `DB_PORT` | Puerto de MariaDB | `3307` |
| `DB_USER` | Usuario dedicado de la BD | `ubikate_user` |
| `DB_PASSWORD` | Contraseña del usuario | *(la tuya)* |
| `DB_NAME` | Nombre de la base de datos | `ubikate_db` |
| `MADRID_API_BASE_URL` | URL base del portal de datos abiertos | `https://datos.madrid.es` |
| `MADRID_API_TOKEN` | Token de la API, si hiciera falta | *(vacío)* |

---

## 5. Ejecución

```bash
npm start        # arranca el servidor en http://localhost:5000
npm run dev      # arranca con recarga automática al guardar (node --watch)
```

### Comprobar que todo funciona

| Prueba | Resultado esperado |
|---|---|
| `GET http://localhost:5000/api/health` | `200` y `{"status":"ok", ...}` |
| `GET http://localhost:5000/api/health/db` | `200` si MariaDB responde; `503` si no hay conexión |
| Abrir `http://localhost:5000/` | Página estática de `public/` |

---

## 6. Modelo de clases (POO)

Las relaciones entre clases se modelan con **referencias a objetos**, no con ids de base de datos:

- `Vivienda.distrito` → objeto `Distrito` (permite `vivienda.getDistrito().getCalidadAire()`).
- `Distrito.viviendas` → lista de objetos `Vivienda` (agregación 1 → 0..*).
- `Usuario.favoritos` → lista de objetos `Vivienda`.
- `Calculadora4ejes.procesarDatos(distrito: Distrito)` recibe el objeto completo.

Los ids (`id_distrito`, `id_vivienda`...) pertenecen a la base de datos relacional y solo se usan al guardar y leer. Como `Vivienda` y `Distrito` se referencian entre sí, cada clase define `toJSON()` para poder serializarlas sin referencias circulares (y `Usuario` nunca expone la contraseña).

---

## 7. Flujo de trabajo en Git

**Ningún commit ni push directo a `main`:** una rama `feature/...` por tarea y Pull Request revisado por otro integrante. Ramas y convención de commits en [`docs/git-workflow.md`](docs/git-workflow.md).

## 8. Problemas conocidos

Registro de errores reales y sus soluciones en [`docs/troubleshooting.md`](docs/troubleshooting.md).

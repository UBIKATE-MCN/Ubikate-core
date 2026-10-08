# Guía de configuración y despliegue local

Proyecto: **Ubikate-core**. Resumen práctico para poner el backend en marcha en un equipo nuevo. La documentación de referencia es el [README](../README.md).

## 1. Requisitos previos

- **Git**
- **Node.js 22 LTS o superior** y npm (`node -v`, `npm -v`)
- **XAMPP** (incluye MySQL/MariaDB)
- **Visual Studio Code** (o tu editor preferido)

## 2. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/UBIKATE-MCN/Ubikate-core.git
cd Ubikate-core
npm install
```

## 3. Variables de entorno (`.env`)

El archivo `.env` guarda tus credenciales locales y **nunca se sube a GitHub**.

```bash
copy .env.example .env      # PowerShell / cmd
cp .env.example .env        # Git Bash / macOS / Linux
```

Abre `.env` en VS Code y ajusta los valores:

| Variable | Valor | Descripción |
|---|---|---|
| `PORT` | `5000` | Puerto del servidor Express |
| `CORS_ORIGIN` | `http://localhost:3000` | Origen del frontend permitido |
| `DB_HOST` | `localhost` | Servidor de la base de datos |
| `DB_PORT` | `3307` (o `3306` si no reconfiguraste XAMPP) | Puerto de tu MySQL en XAMPP |
| `DB_USER` | `ubikate_user` | Usuario dedicado (se crea en el paso 4) |
| `DB_PASSWORD` | la que elijas en el paso 4 | Contraseña de ese usuario |
| `DB_NAME` | `ubikate_db` | Nombre de la base de datos |

## 4. Base de datos

1. Abre el **Panel de control de XAMPP** y pulsa *Start* en **MySQL** (y en Apache si vas a usar phpMyAdmin).
2. Abre phpMyAdmin (`http://localhost/phpmyadmin` o botón *Admin*).
3. **No crees la base de datos a mano.** Con ninguna base seleccionada, ve a la pestaña **Importar**, elige `config/ubikate_db.sql` y pulsa *Importar*. El script crea la base **`ubikate_db`** (codificación `utf8mb4`, cotejamiento `utf8mb4_spanish_ci`) y sus 5 tablas.
4. Ve a la pestaña **SQL** y crea el usuario dedicado (cambia la contraseña):

   ```sql
   CREATE USER 'ubikate_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ubikate_db.* TO 'ubikate_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Escribe esa contraseña en `DB_PASSWORD` de tu `.env`.

> Si tu MySQL escucha en el puerto 3307 y phpMyAdmin no conecta, añade `$cfg['Servers'][$i]['port'] = '3307';` en `xampp/phpMyAdmin/config.inc.php`, o usa MySQL Workbench con la conexión `localhost:3307`.

## 5. Verificar el backend

```bash
npm start
```

| Dirección | Resultado esperado |
|---|---|
| `http://localhost:5000/api/health` | `{"status":"ok","service":"ubikate-core", ...}` |
| `http://localhost:5000/api/health/db` | `{"status":"ok","database":"connected"}` (si da 503, revisa el `.env` y que MySQL esté iniciado) |

Comprueba además en phpMyAdmin que dentro de **`ubikate_db`** aparecen las tablas `DISTRITO`, `VIVIENDA`, `USUARIO`, `USUARIO_FAVORITOS` y `DATOS_MUNICIPIO`. (`/api/health/db` solo comprueba la conexión, no que existan las tablas.)

## 6. Normas de trabajo en Git

Resumen: **ningún commit ni push directo a `main`**. Una rama por tarea (`feature/nombre-de-tu-tarea`), Pull Request hacia `main` y revisión de otro integrante. El detalle está en [`git-workflow.md`](git-workflow.md).

Asegúrate también de que `.env` sigue en `.gitignore`.

## 7. Problemas frecuentes

Ver [`troubleshooting.md`](troubleshooting.md): puerto 3306 ocupado en XAMPP y scripts de PowerShell deshabilitados.

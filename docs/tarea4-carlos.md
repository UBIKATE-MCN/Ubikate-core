# Documentación de Despliegue y Requisitos - Tarea 4 (Carlos)

## 1. Entorno de Despliegue e Infraestructura
- **Estado actual:** Aplicación en desarrollo y pruebas en entorno local.
- **Infraestructura:** XAMPP (MariaDB / MySQL) para persistencia y Node.js con Express para el servidor backend.
- **Evolución futura:** Despliegue previsto en la nube mediante Render (con base de datos independiente).

## 2. Requisitos Mínimos
- **Sistema operativo:** Windows 10/11, macOS o Ubuntu.
- **Navegador:** Chrome, Edge o Firefox.
- **Dependencias:** Node.js 22+, npm y XAMPP.
- **URL de acceso:** Ejecutándose en local en `http://localhost:5000` (sin URL pública por el momento).

## 3. Pasos de Puesta en Marcha
1. Clonar el repositorio y ejecutar `npm install`.
2. Configurar el archivo `.env` (puerto `5000` y MariaDB en puerto `3307`).
3. Importar el script `config/ubikate_db.sql` en phpMyAdmin dentro de la base de datos `ubikate`.
4. Arrancar el servidor con `node src/server.js` y verificar en `http://localhost:5000/api/health`.
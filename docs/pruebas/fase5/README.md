# Banco de pruebas de UBIKATE · Fase 5

El [banco de pruebas](banco-de-pruebas.pdf) contiene siete fichas sobre la API, MariaDB, el acceso de usuarios y el filtrado por distrito y eje. Cada ficha incluye la captura de su caso en el [registro de la primera ejecución](ejecucion.txt).

## Repetir la ejecución

En Windows, abre PowerShell en la raíz del repositorio. Necesitas Node.js 22 o superior y MariaDB de XAMPP. Si acabas de clonar el repositorio, instala las dependencias con `npm ci`. El banco detecta las instalaciones en `C:\xampp\mysql` y `C:\XamppJava\mysql`. Para otra ubicación, define `$env:XAMPP_MYSQL` con la ruta a la carpeta `mysql` de XAMPP.

```powershell
node .\tests\fase5\banco.cjs
$LASTEXITCODE
```

El banco crea una instancia temporal de MariaDB en un puerto libre de la interfaz local, importa el esquema del proyecto y arranca Express. El panel de XAMPP puede permanecer cerrado. La prueba de caída se ejecuta al final y detiene esa instancia. Al terminar, el banco cierra Express y limpia sus datos temporales.

## Interpretar la salida

| Caso | Comprobación | Primera ejecución |
| --- | --- | --- |
| CP-01 | Estado de la API | Conforme |
| CP-02 | Ruta desconocida | Conforme |
| CP-03 | Respuesta con MariaDB disponible | Conforme |
| CP-04 | Respuesta con MariaDB detenida | Conforme |
| CP-05 | Rechazo de contraseñas incorrectas o vacías | No conforme. El modelo devuelve `true` en los tres intentos. |
| CP-06 | Selección de indicador por distrito y eje | Bloqueado. La ruta propuesta devuelve 404 en las cuatro consultas. |
| CP-07 | Integridad entre vivienda y distrito | Conforme |

El proceso devuelve **0** si pasan los siete casos, **1** si termina con algún fallo o bloqueo, y **2** si el banco se interrumpe. En la versión documentada el resultado es **1**. Los datos de Centro y Retiro son ficticios.

Las capturas corresponden al 2 de noviembre de 2026, con Node.js 24.21.0 y MariaDB 10.4.32. El código de aplicación, el esquema y las dependencias de la copia probada (`ed8b0af`) coinciden con los de [la revisión de main usada como base de esta aportación](https://github.com/UBIKATE-MCN/Ubikate-core/tree/b7c225e100c32c477d520aba20280c3e1dacc693).

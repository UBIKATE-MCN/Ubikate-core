# Flujo de trabajo en Git

Objetivo: que el historial de commits sea **activo y colaborativo**: que se vea el trabajo de los tres integrantes, en pasos pequeños y con mensajes claros.

## Ramas

| Rama | Uso |
|---|---|
| `main` | Versión estable. Es la que se despliega. Solo se llega aquí mediante *Pull Request*. |
| `develop` | Integración del trabajo del equipo. |
| `feature/<tema>` | Una rama por tarea, creada desde `develop` (p. ej. `feature/modelo-poo`, `feature/readme`, `feature/api-aire`). |

## Mensajes de commit

Formato: `tipo: descripción corta en presente`

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `refactor` | Cambio de código sin cambiar el comportamiento |
| `docs` | Documentación (README, /docs) |
| `chore` | Configuración, dependencias, estructura |

Ejemplos: `refactor: Vivienda referencia a objeto Distrito en lugar de id`, `docs: añade guía de instalación al README`, `chore: añade .env.example y .gitignore`.

## Cómo trabaja cada persona

```bash
git checkout develop
git pull
git checkout -b feature/nombre-de-la-tarea

# ... trabajar, y hacer commits pequeños y frecuentes ...
git add <archivos>
git commit -m "feat: descripción"

git push -u origin feature/nombre-de-la-tarea
```

Después se abre un **Pull Request** hacia `develop` en GitHub y **otro integrante lo revisa** antes de hacer *merge*. Cuando `develop` está estable, se hace Pull Request de `develop` a `main`.

## Reglas del equipo

- Cada integrante hace commits con **su propio usuario** (`git config user.name` / `user.email` configurados en su equipo).
- Nada de contraseñas ni del archivo `.env` en el repositorio.
- Antes de empezar a trabajar: `git pull`. Antes de subir: comprobar que `npm start` arranca.

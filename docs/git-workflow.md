# Flujo de trabajo en Git

Objetivo: que el historial de commits sea **activo y colaborativo**: que se vea el trabajo de los tres integrantes, en pasos pequeños y con mensajes claros.

## Regla principal

**Está prohibido hacer commit o push directamente en `main`.** Todo cambio entra mediante una rama propia y un *Pull Request* revisado por otro integrante.

## Ramas

| Rama | Uso |
|---|---|
| `main` | Versión estable. Es la que se despliega. Solo recibe cambios mediante *Pull Request*. |
| `feature/<tema>` | Una rama por tarea, creada desde `main` (p. ej. `feature/modelo-poo`, `feature/diseno-figma`, `feature/despliegue-render`). |

## Mensajes de commit

Formato: `tipo: descripción corta en presente`

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `refactor` | Cambio de código sin cambiar el comportamiento |
| `docs` | Documentación (README, /docs) |
| `chore` | Configuración, dependencias, estructura |

Ejemplos: `refactor: Vivienda referencia a objeto Distrito en lugar de id`, `docs: añade guía de instalación`, `chore: añade .env.example y .gitignore`.

## Cómo trabaja cada persona

```bash
git checkout main
git pull
git checkout -b feature/nombre-de-la-tarea

# ... trabajar, y hacer commits pequeños y frecuentes ...
git add <archivos>
git commit -m "docs: descripción"

git push -u origin feature/nombre-de-la-tarea
```

Después, en GitHub se abre un **Pull Request** de `feature/nombre-de-la-tarea` hacia `main`, se asigna a **otro integrante como revisor** y, cuando lo aprueba, se hace *merge*. Para seguir trabajando: `git checkout main` y `git pull`.

## Reglas del equipo

- Cada integrante hace commits con **su propio usuario** (`git config user.name` / `user.email` configurados en su equipo).
- Nada de contraseñas ni del archivo `.env` en el repositorio.
- Antes de empezar a trabajar: `git pull`. Antes de subir: comprobar que `npm start` arranca.

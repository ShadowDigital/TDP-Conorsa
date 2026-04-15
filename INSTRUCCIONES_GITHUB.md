# Guía: Cómo crear y conectar un repositorio en GitHub

Esta guía explica paso a paso cómo crear un nuevo repositorio en GitHub y subir tu proyecto local por primera vez.

## Paso 1: Crear el repositorio en GitHub
1. Inicia sesión en tu cuenta de [GitHub](https://github.com/).
2. Haz clic en el botón **"New"** (Nuevo) en la esquina superior derecha o ve directamente a [github.com/new](https://github.com/new).
3. **Repository name**: Elige un nombre para tu proyecto.
4. **Description**: (Opcional) Escribe una breve descripción.
5. **Public / Private**: Elige si quieres que el código sea público (visible para todos) o privado (solo tú y tus colaboradores pueden verlo).
6. **IMPORTANTE**: Deja desmarcadas las opciones de inicializar con un `README`, `.gitignore` o `License`. Esto es necesario porque vamos a subir un proyecto que ya existe.
7. Haz clic en **"Create repository"**.

## Paso 2: Inicializar Git en tu proyecto local (Si aún no lo has hecho)
Abre una terminal, asegúrate de estar en la carpeta raíz de tu proyecto y ejecuta el siguiente comando para inicializar Git:
```bash
git init
```

*Nota: Es recomendable tener un archivo `.gitignore` para no subir carpetas pesadas o archivos con contraseñas (como `node_modules` o `.env`).*

## Paso 3: Agregar los archivos y hacer el primer commit
Añade todos tus archivos al control de versiones y guarda los cambios creando un "commit":
```bash
# Añade todos los archivos
git add .

# Crea el commit con un mensaje descriptivo
git commit -m "Commit inicial"
```

## Paso 4: Conectar y subir el proyecto a GitHub
En la página del repositorio que creaste en el Paso 1, GitHub te mostrará varias instrucciones. Copia los comandos de la sección que dice **"…or push an existing repository from the command line"**. 

Serán similares a estos tres comandos (asegúrate de ejecutarlos uno por uno en tu terminal):

```bash
# 1. Cambia el nombre de tu rama principal a 'main'
git branch -M main

# 2. Conecta tu proyecto local con el repositorio remoto (usando tu propia URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 3. Sube los archivos a GitHub
git push -u origin main
```

## Resumen: Cómo subir cambios en el futuro
Una vez hayas hecho estos pasos, tu proyecto ya estará en GitHub. Cuando hagas nuevos cambios en tu código y quieras subirlos, solo tendrás que ejecutar estos tres comandos:

```bash
git add .
git commit -m "Breve descripción de lo que cambiaste"
git push
```

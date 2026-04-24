@echo off
echo Iniciando la API y el Frontend...

:: Iniciar la API en una nueva ventana
start "API" cmd /c "cd api && npm run start:dev"

:: Iniciar el Frontend en una nueva ventana
start "Frontend" cmd /c "cd front && npm run dev"

echo Servicios iniciados en ventanas separadas.
echo Puedes cerrar esta ventana.

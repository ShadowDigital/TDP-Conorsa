#!/bin/bash

echo "Iniciando la API y el Frontend..."

# Iniciar la API en segundo plano
(cd api && npm run start:dev) &
API_PID=$!

# Iniciar el Frontend en segundo plano
(cd front && npm run dev) &
FRONT_PID=$!

echo "========================================="
echo "Servicios iniciados:"
echo "- API (PID: $API_PID) en http://localhost:3000 (por defecto)"
echo "- Frontend (PID: $FRONT_PID) en http://localhost:5173 (por defecto)"
echo "Presiona Ctrl+C para detener ambos."
echo "========================================="

# Función para detener los procesos si se presiona Ctrl+C
cleanup() {
    echo "Deteniendo servicios..."
    kill $API_PID $FRONT_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Esperar a que los procesos terminen
wait

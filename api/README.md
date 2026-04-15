# BaseIA - API (Backend)

Este es el backend del proyecto BaseIA, construido con **NestJS** y utilizando **MySQL** como base de datos a través de TypeORM.

## 🚀 Requisitos

- Node.js (v18+)
- MySQL
- npm o yarn

## 🛠️ Instalación

```bash
npm install
```

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del directorio `api/` basándote en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=baseia
DB_USER=root
DB_PASS=
JWT_SECRET=tu_secreto_super_seguro
```

## 🏃 Ejecución

```bash
# desarrollo
npm run start

# modo watch
npm run start:dev

# producción
npm run start:prod
```

## 📚 Documentación

La documentación de la API está generada con Swagger. Una vez levantado el servidor, visita:
[http://localhost:3000/api](http://localhost:3000/api)

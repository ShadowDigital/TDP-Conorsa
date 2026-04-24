# BaseIA - Proyecto Base Fullstack

Este proyecto es una base sólida para el desarrollo de aplicaciones modernas, utilizando **NestJS** para el backend y **React** con **Tailwind CSS** para el frontend.

## 🚀 Estructura del Proyecto

El repositorio está dividido en dos directorios principales:

- `api/`: Backend desarrollado con NestJS (Node.js).
- `front/`: Frontend desarrollado con React, Vite y Tailwind CSS.

### Árbol de Carpetas

```
TDP/
├── INSTRUCCIONES_GITHUB.md
├── README.md
│
├── api/                          # Backend - NestJS
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       └── css/
│   │           └── styles.css
│   └── src/
│       ├── app.controller.ts
│       ├── app.module.ts
│       ├── app.service.ts
│       ├── data-source.ts
│       ├── main.ts
│       ├── auth/                 # Módulo de autenticación
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── decorators/
│       │   ├── dto/
│       │   ├── guards/
│       │   ├── interfaces/
│       │   └── strategies/
│       ├── common/               # Módulo compartido
│       │   ├── common.module.ts
│       │   ├── dto/
│       │   └── filters/
│       ├── migrations/           # Migraciones de BD
│       ├── seeds/                # Seeds de datos
│       ├── usuarios/             # Módulo de usuarios
│       │   ├── usuarios.controller.ts
│       │   ├── usuarios.module.ts
│       │   ├── usuarios.service.ts
│       │   ├── dto/
│       │   ├── entities/
│       │   └── interfaces/
│       └── test/                 # Tests E2E
│
└── front/                        # Frontend - React
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── package.json
    ├── README.md
    ├── public/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── App.css
        ├── api/                  # Cliente HTTP
        │   ├── apiClient.ts
        │   ├── authApi.ts
        │   └── usersApi.ts
        ├── components/           # Componentes reutilizables
        │   ├── AdminRoute.tsx
        │   ├── MainLayout.tsx
        │   └── PrivateRoute.tsx
        ├── context/              # Context API
        │   └── AuthContext.tsx
        ├── pages/                # Páginas
        │   ├── LoginPage.tsx
        │   ├── ProfilePage.tsx
        │   ├── WelcomePage.tsx
        │   ├── public/
        │   │   ├── EntradaDatosPage.tsx
        │   │   └── HomePage.tsx
        │   └── users/
        │       ├── UserFormPage.tsx
        │       └── UsersPage.tsx
        └── assets/               # Recursos estáticos
```

---

## 🛠️ Tecnologías Utilizadas

### Backend (`api`)
- **Framework:** [NestJS](https://nestjs.com/)
- **Lenguaje:** TypeScript
- **Base de Datos:** MySQL (vía TypeORM)
- **Documentación:** Swagger (disponible en `/api` por defecto)
- **Autenticación:** Passport.js + JWT

### Frontend (`front`)
- **Framework:** [React](https://reactjs.org/) (Vite)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestión de Rutas:** React Router DOM
- **Cliente HTTP:** Axios

---

## 📦 Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto localmente.

### 1. Requisitos Previos
- Node.js (versión 18 o superior recomendada)
- npm o yarn
- Una instancia de MySQL corriendo

### 2. Configuración del Backend (`api`)

1. Entra en el directorio de la API:
   ```bash
   cd api
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a un nuevo archivo llamado `.env`:
     ```bash
     cp .env.example .env
     ```
   - Abre `.env` y configura las credenciales de tu base de datos (MySQL) y la clave `JWT_SECRET`.
4. Lanza el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```
   *La API estará disponible en `http://localhost:3000`.*

### 3. Configuración del Frontend (`front`)

1. Entra en el directorio del frontend:
   ```bash
   cd ../front
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a un nuevo archivo llamado `.env`:
     ```bash
     cp .env.example .env
     ```
   - Asegúrate de que `VITE_API_URL` apunte a tu servidor de backend (por defecto `http://localhost:3000/api/v1`).
4. Lanza el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`.*

---

## 📖 Notas Adicionales

- **Swagger:** Puedes acceder a la documentación interactiva de la API navegando a `http://localhost:3000/api` una vez que el backend esté corriendo.
- **Linting:** Ambos proyectos incluyen configuraciones de ESLint para mantener la calidad del código. Puedes ejecutarlos con `npm run lint`.

# Guía de Despliegue en Linux (Nginx + PM2)

Esta guía detalla los pasos para desplegar la aplicación **TDP-Conorsa** en un servidor Linux (Ubuntu/Debian).

## 1. Requisitos Previos

Actualiza el sistema e instala las herramientas necesarias:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx mysql-server
```

### Instalar Node.js (LTS recomendado)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Instalar PM2 globalmente
```bash
sudo npm install -g pm2
```

## 2. Preparación de la Base de Datos

Entra en MySQL y crea la base de datos y el usuario:

```sql
CREATE DATABASE conorsa_tdp;
CREATE USER 'desarrollo'@'localhost' IDENTIFIED BY 'PalAfome';
GRANT ALL PRIVILEGES ON conorsa_tdp.* TO 'desarrollo'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> [!NOTE]
> Se recomienda cambiar la contraseña en entornos de producción reales.

## 3. Clonar y Configurar el Proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd TDP
```

## 4. Despliegue del Backend (API)

```bash
cd api
npm install
```

Crea el archivo `.env` basándote en `.env.example` y ajusta las variables:
```bash
cp .env.example .env
nano .env
```

En el VPS, si la BD está en el panel de Hostinger, Hay que crear acceso remoto, "Acceso Remoto" y añadir la IP del VPS para que pueda conectar.

Genera el build y arranca con PM2:
```bash
npm run build
pm2 start dist/main.js --name "tdp-api"
pm2 save
pm2 startup
```

## 5. Despliegue del Frontend

```bash
cd ../front
npm install
```

Configura la URL de la API en el archivo `.env`:
```bash
echo "VITE_API_URL=/api/v1" > .env
```

Genera el build:
```bash
npm run build
```

Los archivos generados estarán en `front/dist`.

## 6. Configuración de Nginx

Crea un archivo de configuración para el sitio:

```bash
sudo nano /etc/nginx/sites-available/tdp-conorsa
```

Pega el siguiente contenido (ajusta `server_name` a tu dominio o IP):

```nginx
server {
    listen 80;
    server_name tdp.tu-dominio.com; # O la dirección IP del servidor

    # Frontend
    location / {
        root /ruta/al/proyecto/TDP/front/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend Proxy
    location /api/v1/ {
        proxy_pass http://localhost:3000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activa el sitio y reinicia Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/tdp-conorsa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Comandos Útiles

- **Ver logs del backend**: `pm2 logs tdp-api`
- **Reiniciar backend**: `pm2 restart tdp-api`
- **Estado de Nginx**: `sudo systemctl status nginx`
- **Logs de error de Nginx**: `sudo tail -f /var/log/nginx/error.log`

## 8. Certificado SSL (Let's Encrypt)

Si tienes un dominio apuntando al servidor, puedes añadir SSL fácilmente:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tdp.tu-dominio.com
```

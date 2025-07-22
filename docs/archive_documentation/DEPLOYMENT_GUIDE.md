# 🚀 Guía de Despliegue - Centro Cultural

## 📋 Índice
1. [Preparación Pre-Despliegue](#preparación-pre-despliegue)
2. [Opción 1: Despliegue Rápido (Recomendado)](#opción-1-despliegue-rápido-recomendado)
3. [Opción 2: VPS con Docker](#opción-2-vps-con-docker)
4. [Opción 3: Cloud Providers](#opción-3-cloud-providers)
5. [Configuración de Dominio](#configuración-de-dominio)
6. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)

## 🔧 Preparación Pre-Despliegue

### 1. Variables de Entorno de Producción

Crear `backend/.env.production`:
```env
ENVIRONMENT=production
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/cultural_center
SECRET_KEY=genera-una-clave-super-segura-aqui
SENDGRID_API_KEY=tu-api-key-real
SENDGRID_FROM_EMAIL=noreply@tudominio.com
DEBUG=False
```

Crear `frontend/.env.production`:
```env
REACT_APP_BACKEND_URL=https://api.tudominio.com
REACT_APP_WEBSOCKET_URL=wss://api.tudominio.com
REACT_APP_ENABLE_DEBUG=false
```

### 2. Actualizar Configuración de CORS

En `backend/core/config.py`:
```python
ALLOWED_ORIGINS = [
    "https://tudominio.com",
    "https://www.tudominio.com",
    "https://cultural-center.vercel.app"  # Si usas Vercel
]
```

## 🌟 Opción 1: Despliegue Rápido (Recomendado)

### Frontend con Vercel

1. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Configurar Variables de Entorno en Vercel**:
   - Ir a dashboard.vercel.com
   - Settings → Environment Variables
   - Agregar las variables de producción

### Backend con Railway

1. **Crear cuenta en Railway** (railway.app)

2. **Crear `railway.json`** en backend/:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

3. **Crear `Procfile`** en backend/:
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

4. **Deploy**:
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login y deploy
railway login
railway up
```

### MongoDB Atlas

1. **Crear cuenta gratuita** en mongodb.com/atlas

2. **Crear Cluster**:
   - Elegir plan M0 (gratis)
   - Seleccionar región cercana

3. **Configurar acceso**:
   - Database Access → Add New Database User
   - Network Access → Add IP Address (0.0.0.0/0 para permitir Railway)

4. **Obtener connection string**:
   - Connect → Connect your application
   - Copiar la URL y reemplazar en Railway

## 🐳 Opción 2: VPS con Docker

### Docker Compose para Producción

Crear `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - ENVIRONMENT=production
      - MONGO_URL=${MONGO_URL}
      - SECRET_KEY=${SECRET_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
    depends_on:
      - mongo

  mongo:
    image: mongo:6.0
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    ports:
      - "27017:27017"

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  mongo_data:
```

### Dockerfile Frontend

Crear `frontend/Dockerfile.prod`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile Backend

Crear `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Deploy en VPS

1. **Comprar VPS** (DigitalOcean, Linode, Vultr)
   - Ubuntu 22.04
   - Mínimo 2GB RAM

2. **Configurar servidor**:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

3. **Deploy**:
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/cultural-center.git
cd cultural-center

# Crear archivo .env
cp .env.example .env
nano .env  # Editar con valores de producción

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Opción 3: Cloud Providers

### AWS (Más complejo pero escalable)

```yaml
# serverless.yml para AWS Lambda
service: cultural-center-api

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  environment:
    MONGO_URL: ${env:MONGO_URL}
    SECRET_KEY: ${env:SECRET_KEY}

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-python-requirements
  - serverless-offline
```

### Google Cloud Platform

1. **Frontend en Firebase Hosting**:
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar
firebase init hosting

# Deploy
firebase deploy
```

2. **Backend en Cloud Run**:
```bash
# Build y push imagen
gcloud builds submit --tag gcr.io/PROJECT-ID/cultural-center-api

# Deploy
gcloud run deploy --image gcr.io/PROJECT-ID/cultural-center-api --platform managed
```

## 🌐 Configuración de Dominio

### Con Cloudflare (Recomendado)

1. **Registrar dominio** (Namecheap, GoDaddy, etc.)

2. **Configurar Cloudflare**:
   - Agregar sitio
   - Cambiar nameservers en registrador
   - Configurar registros DNS:
   ```
   A     @          -> IP del servidor
   A     www        -> IP del servidor
   A     api        -> IP del backend
   CNAME frontend   -> tu-app.vercel.app
   ```

3. **SSL/TLS**:
   - Cloudflare: Modo "Full (strict)"
   - Generar certificado origen

### Nginx Configuration

Crear `nginx.conf`:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /ws {
        proxy_pass http://backend:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 📊 Monitoreo y Mantenimiento

### 1. Monitoreo con UptimeRobot
- Gratis para 50 monitores
- Alertas por email/SMS
- Status page pública

### 2. Logs con Logtail
```python
# En backend/core/config.py
import logtail

if settings.is_production:
    handler = logtail.LogtailHandler(source_token="tu-token")
    logging.getLogger().addHandler(handler)
```

### 3. Backups Automáticos

Script `backup.sh`:
```bash
#!/bin/bash
# Backup MongoDB
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri=$MONGO_URL --out=/backups/mongo_$DATE

# Upload to S3
aws s3 cp /backups/mongo_$DATE s3://tu-bucket/backups/ --recursive

# Limpiar backups viejos (mantener últimos 7 días)
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

Cron job:
```bash
# Backup diario a las 3 AM
0 3 * * * /home/usuario/backup.sh
```

### 4. Monitoreo de Performance

```python
# Integrar Sentry
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if settings.is_production:
    sentry_sdk.init(
        dsn="tu-dsn-de-sentry",
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
    )
```

## 🔒 Checklist de Seguridad

- [ ] Cambiar todas las claves por defecto
- [ ] Habilitar HTTPS en todos los servicios
- [ ] Configurar firewall correctamente
- [ ] Limitar IPs en MongoDB Atlas
- [ ] Habilitar 2FA en todas las cuentas
- [ ] Configurar rate limiting
- [ ] Backups automáticos configurados
- [ ] Monitoreo activo
- [ ] Logs centralizados
- [ ] Actualizar dependencias regularmente

## 💰 Estimación de Costos

### Opción 1: Despliegue Rápido
- Frontend (Vercel): **Gratis**
- Backend (Railway): **$5/mes**
- MongoDB Atlas: **Gratis** (512MB)
- **Total: $5/mes**

### Opción 2: VPS
- DigitalOcean Droplet: **$12/mes** (2GB RAM)
- Backups: **$2/mes**
- **Total: $14/mes**

### Opción 3: AWS
- EC2 t3.small: **~$15/mes**
- RDS MongoDB compatible: **~$25/mes**
- CloudFront: **~$5/mes**
- **Total: ~$45/mes**

## 🎯 Recomendación Final

Para empezar, recomiendo la **Opción 1** (Vercel + Railway + MongoDB Atlas):
- ✅ Más económica
- ✅ Más fácil de configurar
- ✅ Escalable
- ✅ Sin mantenimiento de servidor
- ✅ Deploy automático con GitHub

Cuando crezcas, puedes migrar a la Opción 2 o 3 para mayor control.

---

¿Necesitas ayuda con algún paso específico del despliegue? 🚀
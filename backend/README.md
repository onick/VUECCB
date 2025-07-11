# Configuración del Backend - Centro Cultural Banreservas

## Variables de Entorno Requeridas

Crear un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```bash
# Base de datos MongoDB
MONGO_URL=mongodb://localhost:27017/cultural_center

# Configuración de autenticación JWT
SECRET_KEY=tu-clave-secreta-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SendGrid para emails (opcional)
SENDGRID_API_KEY=tu-sendgrid-api-key-aqui
SENDGRID_FROM_EMAIL=noreply@banreservas.com.do

# Redis para analytics (opcional)
REDIS_URL=redis://localhost:6379

# Configuración general
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

## Credenciales de Administrador

El sistema incluye usuarios administradores pre-configurados:

### Usuario Principal
- **Email**: `admin@banreservas.com.do`
- **Contraseña**: `Admin2024CCB!`
- **Nombre**: Administrador CCB

### Usuarios de Prueba
- **Email**: `admin@culturalcenter.com`
- **Contraseña**: `admin123`

## Instalación

1. **Instalar dependencias**:
   ```bash
   cd backend
   pip3 install -r requirements.txt
   pip3 install redis
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

3. **Iniciar servidor**:
   ```bash
   python3 -m uvicorn server:app --reload --port 8002
   ```

## Gestión de Usuarios Admin

Usar el script `admin_manager.py`:

```bash
# Listar administradores
python3 admin_manager.py list

# Crear admin por defecto
python3 admin_manager.py create-default

# Crear admin personalizado
python3 admin_manager.py create "Nombre" "email@domain.com" "password" "telefono"
```

## URLs del Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8002
- **Documentación API**: http://localhost:8002/docs
- **Panel Admin**: http://localhost:3000/admin

## Servicios Opcionales

### MongoDB
```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O instalación local
brew install mongodb-community  # macOS
```

### Redis (para analytics)
```bash
# Con Docker
docker run -d -p 6379:6379 --name redis redis:alpine

# O instalación local
brew install redis  # macOS
```

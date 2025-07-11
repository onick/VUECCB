# 🎭 Sistema de Gestión de Visitantes - Centro Cultural Banreservas

<div align="center">
  <img src="logo.png" alt="Centro Cultural Logo" width="200"/>
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-00684A.svg)](https://www.mongodb.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

## 📋 Descripción

Sistema integral de gestión de visitantes y eventos para el Centro Cultural Banreservas. Permite a los usuarios explorar eventos culturales, realizar reservas, y hacer check-in mediante códigos QR. Los administradores pueden gestionar eventos, usuarios y generar reportes detallados.

## ✨ Características Principales

- 🎫 **Gestión de Eventos**: Creación y administración de eventos culturales en 8 categorías
- 👥 **Gestión de Usuarios**: Registro, autenticación y perfiles de usuarios
- 📱 **Sistema de Reservas**: Reservas con códigos QR y check-in múltiple
- 📧 **Notificaciones Automáticas**: Emails de confirmación y recordatorios
- 📊 **Analytics Avanzado**: Dashboard en tiempo real y segmentación de usuarios con ML
- 📄 **Reportes Profesionales**: Generación de reportes en PDF y exportación de datos
- 🔐 **Panel de Administración**: Control total del sistema para administradores

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Frontend       │────▶│  Backend API    │────▶│  MongoDB        │
│  (React)        │     │  (FastAPI)      │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│  Tailwind CSS   │     │  SendGrid       │
│  Socket.io      │     │  Analytics      │
└─────────────────┘     └─────────────────┘
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ y npm/yarn
- Python 3.8+
- MongoDB 4.4+
- SendGrid API Key (para emails)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/cultural-center.git
cd cultural-center
```

2. **Configurar variables de entorno**

Backend (.env):
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales
```

Frontend (.env):
```bash
cd ../frontend
cp .env.example .env
# Editar .env con la URL del backend
```

3. **Instalar dependencias del Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Instalar dependencias del Frontend**
```bash
cd ../frontend
npm install
# o
yarn install
```

5. **Iniciar MongoDB**
```bash
# Si tienes MongoDB instalado localmente
mongod

# O usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

6. **Iniciar el Backend**
```bash
cd backend
uvicorn server:app --reload --port 8001
```

7. **Iniciar el Frontend**
```bash
cd frontend
npm start
# o
yarn start
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- Documentación API: http://localhost:8001/docs

## 🔧 Configuración

### Variables de Entorno - Backend

Crear archivo `backend/.env`:

```env
# Base de datos
MONGO_URL=mongodb://localhost:27017/cultural_center

# Seguridad
SECRET_KEY=tu-clave-secreta-super-segura
ALGORITHM=HS256

# SendGrid
SENDGRID_API_KEY=tu-api-key-de-sendgrid
SENDGRID_FROM_EMAIL=noreply@tudominio.com

# Configuración general
ENVIRONMENT=development
DEBUG=True
```

### Variables de Entorno - Frontend

Crear archivo `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_WEBSOCKET_URL=ws://localhost:8001
```

## 📖 Uso

### Para Usuarios

1. **Registro**: Crear una cuenta con información personal
2. **Explorar Eventos**: Ver eventos disponibles por categoría
3. **Hacer Reservas**: Reservar espacios en eventos
4. **Check-in**: Usar QR, código, email o teléfono

### Para Administradores

1. **Gestión de Eventos**: Crear, editar y eliminar eventos
2. **Gestión de Usuarios**: Ver, editar y gestionar usuarios
3. **Reportes**: Generar reportes de asistencia y analytics
4. **Dashboard**: Monitorear métricas en tiempo real

### Credenciales de Prueba

```
Admin:
Email: admin@culturalcenter.com
Password: admin123

Usuario:
Email: user@example.com
Password: user123
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
cultural-center/
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Punto de entrada
│   └── package.json
│
├── backend/               # API FastAPI
│   ├── server.py         # Servidor principal
│   ├── analytics/        # Sistema de analytics
│   ├── reports/          # Generación de reportes
│   └── requirements.txt
│
└── docs/                 # Documentación adicional
```

### Comandos Útiles

```bash
# Backend - Ejecutar tests
cd backend
pytest

# Frontend - Ejecutar tests
cd frontend
npm test

# Generar build de producción
cd frontend
npm run build

# Linting
cd frontend
npm run lint
```

## 📊 API Endpoints

### Autenticación
- `POST /api/register` - Registro de usuarios
- `POST /api/login` - Inicio de sesión

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento (admin)
- `GET /api/categories` - Listar categorías

### Reservas
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations` - Mis reservas
- `DELETE /api/reservations/{id}` - Cancelar reserva
- `POST /api/checkin` - Check-in

### Admin
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/stats` - Estadísticas
- `GET /api/admin/reports/*` - Generar reportes

[Ver documentación completa de la API](http://localhost:8001/docs)

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests del backend
cd backend && pytest

# Tests e2e
npm run test:e2e
```

## 🚀 Deployment

### Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Producción

1. Configurar variables de entorno de producción
2. Construir frontend: `npm run build`
3. Servir archivos estáticos con nginx
4. Ejecutar backend con gunicorn/uvicorn
5. Configurar SSL/TLS

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Guía de Estilo

- Frontend: [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- Backend: [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Commits: [Conventional Commits](https://www.conventionalcommits.org/)

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo**: Equipo de TI - Centro Cultural Banreservas
- **Diseño**: Departamento de Comunicaciones
- **Analytics**: Departamento de Data Science

## 📞 Soporte

- Email: soporte@culturalcenter.com
- Documentación: [Wiki del Proyecto](https://github.com/tu-usuario/cultural-center/wiki)
- Issues: [GitHub Issues](https://github.com/tu-usuario/cultural-center/issues)

---

<div align="center">
  Hecho con ❤️ por el equipo del Centro Cultural Banreservas
</div>

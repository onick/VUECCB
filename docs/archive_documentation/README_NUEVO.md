# 🎭 Centro Cultural Banreservas - Sistema de Gestión Moderno

Una plataforma completa de gestión de visitantes y eventos culturales construida con tecnologías modernas y arquitectura escalable.

## ✨ Características Principales

### 🎫 Gestión de Eventos
- **8 Categorías Culturales**: Cinema Dominicano, Cine Clásico, Cine General, Talleres, Conciertos, Charlas/Conferencias, Exposiciones de Arte, Experiencias 3D Inmersivas
- **CRUD Completo**: Creación, edición, eliminación y gestión de eventos
- **Subida de Imágenes**: Sistema de upload para promocionales
- **Gestión de Capacidad**: Control automático de cupos y disponibilidad

### 👥 Sistema de Usuarios
- **Autenticación Segura**: JWT con NextAuth.js
- **Roles y Permisos**: Usuario estándar y Administrador
- **Perfil Completo**: Información personal y profesional
- **Registros Detallados**: Seguimiento de actividad

### 📱 Reservas Inteligentes
- **Códigos QR**: Generación automática para check-in
- **Códigos Alfanuméricos**: Sistema de 8 caracteres único
- **Check-in Multiple**: Por QR, código, email o teléfono
- **Notificaciones**: Confirmaciones y recordatorios automáticos

### 📊 Panel Administrativo
- **Dashboard en Tiempo Real**: Métricas y estadísticas actualizadas
- **Gestión de Usuarios**: Control completo del sistema
- **Reportes Avanzados**: Análisis de asistencia y preferencias
- **Analytics con ML**: Segmentación inteligente de usuarios

## 🏗️ Arquitectura Técnica

### Frontend (Next.js 14)
```
frontend/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticación
│   ├── events/            # Gestión de eventos
│   ├── admin/             # Panel administrativo
│   └── globals.css        # Estilos globales
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Componentes de formularios
│   ├── layout/            # Layouts y navegación
│   ├── features/          # Funcionalidades específicas
│   └── providers/         # Context providers
├── lib/                   # Utilidades y configuraciones
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # Definiciones TypeScript
```

### Backend (FastAPI)
```
backend/
├── server.py             # Servidor principal FastAPI
├── analytics/            # Sistema de analytics avanzado
├── core/                 # Configuraciones centrales
├── models/               # Modelos de datos
├── reports/              # Generación de reportes
└── services/             # Lógica de negocio
```

## 🚀 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14+ con App Router
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS con variables CSS
- **Autenticación**: NextAuth.js
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **Animaciones**: Framer Motion
- **TypeScript**: Configuración estricta

### Backend
- **Framework**: FastAPI (Python)
- **Base de Datos**: MongoDB
- **Autenticación**: JWT
- **Analytics**: Redis + Scikit-learn
- **Emails**: SendGrid
- **Reportes**: ReportLab + Matplotlib

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- Python 3.8+
- MongoDB 4.4+
- Redis (para analytics)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/onick/emergentCCB.git ccb-platform
cd ccb-platform
git checkout cursor/explore-available-options-05e5
```

### 2. Configurar Backend
```bash
cd backend
pip3 install -r requirements.txt
pip3 install redis

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Frontend
```bash
cd frontend
npm install

# Variables de entorno ya configuradas
# NEXT_PUBLIC_API_URL=http://localhost:8002
```

### 4. Iniciar Servicios
```bash
# Terminal 1 - Backend
cd backend
python3 -m uvicorn server:app --reload --port 8002

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8002
- **Documentación API**: http://localhost:8002/docs

## 🎨 Funcionalidades Implementadas

### ✅ Completadas
- [x] Configuración base de Next.js 14 con App Router
- [x] Sistema de autenticación completo (Login/Register)
- [x] Componentes UI con shadcn/ui
- [x] Gestión de estado con Zustand
- [x] Navegación responsive con dark/light mode
- [x] Integración Frontend-Backend funcional
- [x] Tipos TypeScript completos
- [x] Sistema de toasts y notificaciones

### 🔄 En Desarrollo
- [ ] CRUD completo de eventos
- [ ] Sistema de reservas con QR
- [ ] Panel administrativo
- [ ] Dashboard con métricas
- [ ] Upload de imágenes
- [ ] Sistema de notificaciones por email

### 📋 Próximas Funcionalidades
- [ ] Tests unitarios e integración
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Analytics avanzado
- [ ] Integración con redes sociales
- [ ] Sistema de comentarios y reviews

## 📱 Diseño Responsive

La aplicación está optimizada para:
- **Desktop**: Experiencia completa
- **Tablet**: Navegación adaptada
- **Mobile**: Mobile-first approach
- **Dark Mode**: Soporte completo

## 🔐 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Validación**: Zod para validación de schemas
- **CORS**: Configuración adecuada
- **Rate Limiting**: Protección contra abuso
- **Sanitización**: Limpieza de datos de entrada

## 📊 Performance

- **Lazy Loading**: Carga bajo demanda
- **Code Splitting**: Optimización automática
- **Image Optimization**: Next.js Image component
- **Caching**: Estrategias de caché inteligentes
- **Bundle Analysis**: Monitoreo de tamaño

## 🚀 Deployment

### Desarrollo
```bash
npm run dev          # Frontend
python3 -m uvicorn server:app --reload --port 8002  # Backend
```

### Producción
```bash
npm run build        # Build optimizado
npm start           # Servidor de producción
```

## 📖 Documentación

- **API Docs**: http://localhost:8002/docs
- **Componentes**: Storybook (próximamente)
- **Arquitectura**: Ver carpeta `/docs`

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'Agregar nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Frontend**: Next.js + TypeScript + Tailwind
- **Backend**: FastAPI + MongoDB + Redis
- **DevOps**: Docker + CI/CD
- **Analytics**: Python + ML

---

**Centro Cultural Banreservas** - Transformando la experiencia cultural digital 🎭✨

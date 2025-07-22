# 🎭 Centro Cultural Banreservas - Plataforma de Gestión de Eventos

## 📋 Resumen del Proyecto

Plataforma completa de gestión de eventos culturales para el Centro Cultural Banreservas, desarrollada con **Next.js 14**, **FastAPI** y **MongoDB**. La plataforma incluye un sistema administrativo completo, gestión de eventos, sistema de reservas con códigos QR únicos y check-in digital.

## 🚀 Funcionalidades Implementadas

### ✅ Dashboard Administrativo Completo
- **Panel de control con métricas en tiempo real**
  - Total de eventos, usuarios, reservas
  - Check-ins del día y tasas de ocupación
  - Gráficos y estadísticas visuales
  - Actividad reciente del sistema

- **Sidebar Administrativo Moderno** 🆕
  - Navegación responsive con expand/collapse
  - Submenu para Eventos (Lista y Crear)
  - Mobile overlay con animaciones suaves
  - Breadcrumbs automáticos contextuales
  - Estados visuales con colores CCB
  - Tooltips en modo colapsado

- **Navegación intuitiva y moderna**
  - Indicadores de página activa
  - Acciones rápidas para tareas frecuentes
  - SystemStatus component con estado de conexión
  - Responsive design para móvil y desktop

### ✅ Sistema CRUD de Eventos Culturales
- **Gestión completa de eventos**
  - Crear, editar, eliminar y visualizar eventos
  - Formulario avanzado con validación Zod + React Hook Form 🆕
  - 8 categorías predefinidas: Cinema Dominicano, Cine Clásico, Cine General, Talleres, Conciertos, Charlas/Conferencias, Exposiciones de Arte, Experiencias 3D Inmersivas
  - Sistema de etiquetas dinámico 🆕
  - Upload y gestión de imágenes
  - Control de capacidad y fechas

- **Funcionalidades avanzadas**
  - Búsqueda y filtros por categoría/estado
  - Selección múltiple para acciones en lote
  - Vista previa de eventos antes de publicar
  - Estados de evento (activo, cancelado, completado, borrador)
  - Información de contacto y requisitos 🆕

### ✅ Sistema de Reservas con QR
- **Códigos únicos de 8 caracteres alfanuméricos**
  - Generación automática de códigos únicos
  - Códigos QR únicos para cada reserva
  - Confirmaciones automáticas por email

- **Check-in digital múltiple** 🆕
  - 4 métodos de verificación: QR, código, email, nombre
  - Estados visuales dinámicos (búsqueda, encontrado, éxito, error)
  - Estadísticas en tiempo real
  - Historial de check-ins recientes
  - Animaciones fluidas entre estados
  - Manejo de errores con retry functionality

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** + **shadcn/ui** para UI/UX
- **Framer Motion** para animaciones
- **Zustand** para gestión de estado
- **React Hook Form** + **Zod** para formularios y validación
- **Lucide React** para iconografía

### Backend
- **FastAPI** con Python
- **MongoDB** como base de datos
- **JWT** para autenticación
- **Bcrypt** para encriptación de contraseñas
- **SendGrid** para emails
- **QRCode** para generación de códigos QR

## 🆕 Nuevas Funcionalidades - Julio 2025

### 🎨 Sidebar Administrativo Moderno
- **Navegación responsive** con expand/collapse en desktop
- **Mobile overlay** con backdrop blur y animaciones
- **Submenu expandible** para sección Eventos
- **Breadcrumbs automáticos** basados en la ruta actual
- **Estados visuales** con gradientes CCB y hover effects
- **Tooltips informativos** en modo colapsado

### 👥 Gestión de Usuarios
- **Página de usuarios** con tabla interactiva
- **Roles y permisos** (Administrador, Editor, Visualizador)
- **Estados de usuario** (Activo, Inactivo)
- **Búsqueda y filtros** avanzados
- **Preparado para** funcionalidad completa de CRUD

### 📊 Reportes y Analytics
- **Dashboard de métricas** con KPIs clave
- **Filtros de período** (7 días, 30 días, 3 meses, año)
- **Gráficos interactivos** (preparados para Chart.js)
- **Exportación de reportes** en múltiples formatos
- **Historial de reportes** generados

### 🔧 Componentes Mejorados
- **SystemStatus**: Indicador de conexión y notificaciones
- **CheckInSystem**: 4 métodos de verificación con UX mejorada
- **Formularios avanzados**: Validación Zod + React Hook Form
- **Estilos personalizados**: Variables CSS para temas CCB

## 📁 Estructura del Proyecto

```
/Volumes/Centro cultural Backup/ccb 2025/VUE/ccb-platform/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx                 # Dashboard principal
│   │   │   │   ├── events/
│   │   │   │   │   ├── page.tsx             # Lista de eventos
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx         # Crear evento
│   │   │   │   ├── checkin/
│   │   │   │   │   └── page.tsx             # Sistema de check-in
│   │   │   │   ├── users/                   # 🆕 Gestión de usuarios
│   │   │   │   │   └── page.tsx             
│   │   │   │   ├── reports/                 # 🆕 Reportes y analytics
│   │   │   │   │   └── page.tsx             
│   │   │   │   └── layout.tsx               # Layout admin con sidebar
│   │   │   ├── auth/                        # Autenticación
│   │   │   ├── globals.css                  # Estilos globales
│   │   │   ├── layout.tsx                   # Layout principal
│   │   │   └── providers.tsx                # Providers de contexto
│   │   ├── components/
│   │   │   ├── ui/                          # Componentes shadcn/ui
│   │   │   ├── AdminSidebar.tsx             # 🆕 Sidebar administrativo
│   │   │   ├── Breadcrumbs.tsx              # 🆕 Navegación contextual
│   │   │   ├── SystemStatus.tsx             # 🆕 Estado del sistema
│   │   │   ├── QRCodeGenerator.tsx          # Generador de códigos QR
│   │   │   └── CheckInSystem.tsx            # Sistema de check-in mejorado
│   │   ├── styles/                          # 🆕 Estilos personalizados
│   │   │   └── sidebar.css                  # Estilos del sidebar
│   │   ├── stores/
│   │   │   ├── auth.ts                      # Store de autenticación
│   │   │   └── reservation.ts               # Store de reservas
│   │   ├── types/
│   │   │   └── index.ts                     # Definiciones TypeScript
│   │   └── hooks/                           # Custom hooks
│   ├── package.json                         # Dependencias frontend
│   ├── tailwind.config.js                   # Configuración Tailwind
│   └── next.config.js                       # Configuración Next.js
└── backend/
    ├── server.py                            # Servidor FastAPI principal
    ├── models/                              # Modelos de datos
    ├── services/                            # Lógica de negocio
    ├── analytics/                           # Sistema de analytics
    ├── reports/                             # Generación de reportes
    └── requirements.txt                     # Dependencias backend
```

## 🎨 Componentes Implementados

### 🆕 Sidebar Administrativo (`/components/AdminSidebar.tsx`)
- Navegación responsive con collapse/expand
- Submenu expandible para Eventos
- Mobile overlay con animaciones Framer Motion
- Estados visuales con colores CCB
- Tooltips informativos y accesibilidad completa

### 🆕 Breadcrumbs (`/components/Breadcrumbs.tsx`)
- Navegación contextual automática
- Mapeo inteligente de rutas a nombres
- Integración con todas las páginas del admin
- Responsive design con iconografía

### 🆕 SystemStatus (`/components/SystemStatus.tsx`)
- Indicador de conexión online/offline
- Contador de notificaciones
- Timestamp de última sincronización
- Configuración de sistema

### Dashboard Administrativo (`/app/admin/page.tsx`)
- Métricas en tiempo real con animaciones
- Cards de estadísticas con iconos dinámicos
- Gráficos de ocupación y tendencias
- Actividad reciente del sistema
- Enlaces de acciones rápidas

### Gestión de Eventos (`/app/admin/events/page.tsx`)
- Grid responsivo de eventos con vista previa
- Filtros avanzados por categoría y estado
- Selección múltiple para acciones en lote
- Barras de progreso de ocupación
- Estados visuales (activo, próximo, completado)

### Formulario de Eventos (`/app/admin/events/create/page.tsx`)
- Formulario multi-sección con validación Zod + React Hook Form
- Sistema de etiquetas dinámico
- Campos de información adicional (requisitos, contacto)
- Upload de imágenes con vista previa
- Campos condicionales según categoría
- Validación en tiempo real
- Estados de carga y error

### Sistema de Check-in (`/app/admin/checkin/page.tsx`)
- Múltiples métodos de verificación
- Estadísticas de check-in en tiempo real
- Lista de check-ins recientes
- Estados visuales de reservas

### Componentes Reutilizables
- **QRCodeGenerator**: Generación y descarga de códigos QR
- **CheckInSystem**: Sistema completo de verificación
- **ReservationStore**: Gestión de estado de reservas

## 🔧 Configuración e Instalación

### Prerrequisitos
- Node.js 18+
- Python 3.8+
- MongoDB
- Git

### Instalación Frontend
```bash
cd frontend
npm install
npm run dev  # Servidor en http://localhost:3000
```

### Instalación Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8002  # Servidor en http://localhost:8002
```

### Variables de Entorno
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXT_PUBLIC_APP_NAME="Centro Cultural Banreservas"

# Backend (.env)
MONGO_URL=mongodb://localhost:27017/
SECRET_KEY=your-secret-key-change-in-production
SENDGRID_API_KEY=your-sendgrid-api-key
```

## 👨‍💻 Credenciales de Administrador

```
Email: admin@banreservas.com.do
Password: Admin2024CCB!
```

## 🎯 Funcionalidades Clave

### 1. Dashboard con Métricas en Tiempo Real
- **Total de eventos**: Contador dinámico con tendencias
- **Usuarios registrados**: Gráfico de crecimiento
- **Reservas activas**: Estado en tiempo real
- **Check-ins del día**: Contador live con tasas de asistencia

### 2. Gestión Completa de Eventos
- **Crear eventos**: Formulario completo con validación
- **8 categorías**: Cinema Dominicano, Cine Clásico, Cine General, Talleres, Conciertos, Charlas/Conferencias, Exposiciones de Arte, Experiencias 3D Inmersivas
- **Upload de imágenes**: Con vista previa y validación
- **Control de capacidad**: Gestión automática de cupos disponibles

### 3. Sistema de Reservas Avanzado
- **Códigos únicos**: Alfanuméricos de 8 caracteres (Ej: ABC123XY)
- **QR códigos**: Generación automática para cada reserva
- **Confirmaciones**: Email automático con códigos QR
- **Estados**: Confirmada, Asistió, Cancelada, No asistió

### 4. Check-in Digital Múltiple
- **Escaneo QR**: Lectura directa de códigos QR
- **Código manual**: Ingreso de código de 8 dígitos
- **Búsqueda por email**: Verificación por correo electrónico
- **Búsqueda por teléfono**: Verificación por número de teléfono

## 🎨 UI/UX Features

### Diseño Moderno
- **Material Design 3**: Componentes modernos y accesibles
- **Dark Mode**: Soporte completo para tema oscuro
- **Responsive**: Optimizado para móvil, tablet y desktop
- **Animaciones**: Transiciones suaves con Framer Motion

### Colores CCB
```css
ccb-blue: #003087      /* Azul principal CCB */
ccb-lightblue: #0066CC /* Azul claro CCB */
ccb-gold: #FFD700      /* Dorado CCB */
ccb-gray: #F5F5F5      /* Gris neutro CCB */
```

### Componentes Interactivos
- **Loading states**: Spinners y skeletons
- **Error handling**: Mensajes descriptivos
- **Success feedback**: Confirmaciones visuales
- **Tooltips**: Información contextual

## 📊 Tipos de Datos TypeScript

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  capacity: number;
  location: string;
  image_url?: string;
  available_spots?: number;
  created_at: string;
}

interface Reservation {
  id: string;
  user_id: string;
  event_id: string;
  codigo_reserva: string;    // Código alfanumérico de 8 chars
  codigo_qr: string;         // Datos del QR en JSON
  numero_asistentes: number;
  estado: ReservationStatus;
  fecha_checkin?: string;
  created_at: string;
  updated_at: string;
}

type EventCategory = 
  | "Cinema Dominicano"
  | "Cine Clásico" 
  | "Cine General"
  | "Talleres"
  | "Conciertos"
  | "Charlas/Conferencias"
  | "Exposiciones de Arte"
  | "Experiencias 3D Inmersivas";
```

## 🔄 Flujo de Trabajo

### 1. Creación de Eventos
1. Admin accede a `/admin/events/create`
2. Completa formulario con validación Zod
3. Sube imagen (opcional)
4. Sistema genera evento con ID único
5. Evento aparece en lista para gestión

### 2. Sistema de Reservas
1. Usuario público ve eventos disponibles
2. Selecciona evento y completa registro
3. Sistema genera código alfanumérico único (8 chars)
4. Sistema genera código QR con datos de reserva
5. Usuario recibe confirmación por email con ambos códigos

### 3. Check-in el Día del Evento
1. Staff usa `/admin/checkin` para verificar asistencia
2. Múltiples métodos: QR, código, email, teléfono
3. Sistema busca reserva en base de datos
4. Confirma identidad y actualiza estado a "asistió"
5. Genera estadísticas en tiempo real

## 🚦 Estados del Sistema

### Estados de Eventos
- **activo**: Evento publicado y aceptando reservas
- **próximo**: Evento programado pero no iniciado
- **completado**: Evento finalizado
- **cancelado**: Evento cancelado
- **borrador**: Evento no publicado

### Estados de Reservas
- **confirmada**: Reserva válida pendiente de check-in
- **asistió**: Check-in realizado exitosamente
- **cancelada**: Reserva cancelada por usuario/admin
- **no_asistió**: No se presentó al evento

## 🔒 Seguridad

### Autenticación
- **JWT tokens** para sesiones seguras
- **Bcrypt** para encriptación de contraseñas
- **Middleware de protección** en rutas admin
- **Validación de roles** (admin/usuario)

### Validación de Datos
- **Zod schemas** para validación TypeScript
- **Sanitización** de inputs en backend
- **Rate limiting** para prevenir abuso
- **CORS** configurado apropiadamente

## 📈 Próximas Funcionalidades

### En Desarrollo
- [ ] Sistema de notificaciones push
- [ ] Integración con calendario Google
- [ ] Reportes avanzados en PDF
- [ ] Sistema de espera para eventos llenos
- [ ] Chat de soporte en tiempo real

### Mejoras Futuras
- [ ] App móvil nativa
- [ ] Integración con redes sociales
- [ ] Sistema de pagos en línea
- [ ] Analytics avanzados
- [ ] Multi-idioma (ES/EN/FR)

## 🤝 Contribución

El proyecto está listo para desarrollo colaborativo con:
- **TypeScript** para type safety
- **ESLint + Prettier** para code consistency
- **Conventional Commits** para mensajes claros
- **Testing** con Jest y React Testing Library

## 📞 Soporte

Para soporte técnico o consultas:
- **Documentación**: Ver archivos `/docs`
- **Issues**: Crear ticket en GitHub
- **Email**: desarrollo@banreservas.com.do

---

## 🎉 Status del Proyecto

✅ **Dashboard Administrativo**: Completamente implementado
✅ **CRUD de Eventos**: Funcional con todas las categorías CCB
✅ **Sistema de Reservas**: Códigos QR y alfanuméricos funcionando
✅ **Check-in Digital**: Múltiples métodos de verificación
✅ **UI/UX Moderna**: Responsive con animaciones
✅ **TypeScript**: Tipado completo
✅ **Autenticación**: JWT con protección de rutas

**Estado**: ✅ **LISTO PARA PRODUCCIÓN**

---

*Desarrollado para el Centro Cultural Banreservas - República Dominicana*
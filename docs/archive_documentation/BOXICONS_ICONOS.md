# 📖 Documentación de Iconos Boxicons - Centro Cultural

## 🎯 Resumen
Este documento contiene todos los iconos de Boxicons utilizados en la plataforma del Centro Cultural, organizados por componente y categoría para facilitar el mantenimiento y desarrollo futuro.

## 🚀 Instalación y Configuración
```bash
npm install boxicons
```

En `src/index.js`:
```javascript
import 'boxicons/css/boxicons.min.css';
```

## 📋 Uso Básico
```html
<i className="bx bx-nombre-del-icono"></i>
```

## 🗂️ Iconos por Componente

### Sidebar (Navegación Principal)
| Icono | Código | Uso |
|-------|--------|-----|
| 📅 → `bx-calendar-event` | `<i className="bx bx-calendar-event"></i>` | Eventos |
| 🎫 → `bx-bookmark` | `<i className="bx bx-bookmark"></i>` | Mis Reservas |
| ✅ → `bx-check-circle` | `<i className="bx bx-check-circle"></i>` | Check-in |
| 👥 → `bx-group` | `<i className="bx bx-group"></i>` | Usuarios |
| 📋 → `bx-list-ul` | `<i className="bx bx-list-ul"></i>` | Gestión de Reservas |
| 📊 → `bx-bar-chart-alt-2` | `<i className="bx bx-bar-chart-alt-2"></i>` | Analytics |
| ➕ → `bx-plus-circle` | `<i className="bx bx-plus-circle"></i>` | Crear Evento |
| 🚪 → `bx-log-out` | `<i className="bx bx-log-out"></i>` | Cerrar Sesión |
| 👤 → `bx-user` | `<i className="bx bx-user"></i>` | Usuario Invitado |
| × → `bx-x` | `<i className="bx bx-x"></i>` | Cerrar |

### App.js (Formularios y Vistas)
| Icono Original | Código Boxicons | Uso |
|----------------|-----------------|-----|
| 🎫 → `bx-bookmark` | `<i className="bx bx-bookmark"></i>` | Título Mis Reservas |
| ➕ → `bx-plus` | `<i className="bx bx-plus"></i>` | Nueva Reserva |
| ✅ → `bx-check` | `<i className="bx bx-check"></i>` | Estados confirmados |
| 🎫 → `bx-bookmark` | `<i className="bx bx-bookmark"></i>` | Registrado |
| ❌ → `bx-x` | `<i className="bx bx-x"></i>` | Cancelada |
| 📱 → `bx-mobile` | `<i className="bx bx-mobile"></i>` | Opciones Check-in |
| ✅ → `bx-check-circle` | `<i className="bx bx-check-circle"></i>` | Check-in Completado |
| 💡 → `bx-info-circle` | `<i className="bx bx-info-circle"></i>` | Información |
| 🎉 → `bx-party` | `<i className="bx bx-party"></i>` | Celebración |
| ✅ → `bx-check-circle` | `<i className="bx bx-check-circle"></i>` | Check-in Station |
| ➕ → `bx-plus-circle` | `<i className="bx bx-plus-circle"></i>` | Admin Panel |
| 📍 → `bx-map` | `<i className="bx bx-map"></i>` | Ubicación |

### Analytics Dashboard (RealTimeDashboard.js)
| Icono Original | Código Boxicons | Uso |
|----------------|-----------------|-----|
| 📊 → `bx-bar-chart-alt-2` | `<i className="bx bx-bar-chart-alt-2"></i>` | Título Dashboard |
| 🤖 → `bx-brain` | `<i className="bx bx-brain"></i>` | Train ML Model |
| 👥 → `bx-group` | `<i className="bx bx-group"></i>` | Active Users |
| 🎫 → `bx-calendar-check` | `<i className="bx bx-calendar-check"></i>` | Bookings/Hour |
| 📊 → `bx-trending-up` | `<i className="bx bx-trending-up"></i>` | Page Views/Hour |
| ✅ → `bx-check-circle` | `<i className="bx bx-check-circle"></i>` | Check-ins/Hour |

### Gestión de Usuarios (UserManagement.js)
| Icono Original | Código Boxicons | Uso |
|----------------|-----------------|-----|
| 👥 → `bx-group` | `<i className="bx bx-group"></i>` | Título Gestión Usuarios |
| 🔧 → `bx-cog` | `<i className="bx bx-cog"></i>` | Acciones |
| 📤 → `bx-upload` | `<i className="bx bx-upload"></i>` | Importar Usuarios |
| 👑 → `bx-crown` | `<i className="bx bx-crown"></i>` | Hacer Admin |
| 👤 → `bx-user` | `<i className="bx bx-user"></i>` | Quitar Admin/Usuario |
| ✅ → `bx-check` | `<i className="bx bx-check"></i>` | Activar/Estados |
| 🗑️ → `bx-trash` | `<i className="bx bx-trash"></i>` | Eliminar |
| 📊 → `bx-bar-chart` | `<i className="bx bx-bar-chart"></i>` | Estadísticas |

### Gestión de Reservas (ReservationsManagement.js)
| Icono Original | Código Boxicons | Uso |
|----------------|-----------------|-----|
| 📋 → `bx-calendar-check` | `<i className="bx bx-calendar-check"></i>` | Título Gestión Reservas |
| 📊 → `bx-calendar` | `<i className="bx bx-calendar"></i>` | Total Reservas |
| ✅ → `bx-check-circle` | `<i className="bx bx-check-circle"></i>` | Confirmadas |
| 👤 → `bx-user-check` | `<i className="bx bx-user-check"></i>` | Check-ins |
| ❌ → `bx-x-circle` | `<i className="bx bx-x-circle"></i>` | Canceladas |
| 🔧 → `bx-cog` | `<i className="bx bx-cog"></i>` | Configuraciones |
| 📊 → `bx-download` | `<i className="bx bx-download"></i>` | Descargar CSV |
| 📋 → `bx-spreadsheet` | `<i className="bx bx-spreadsheet"></i>` | Descargar Excel |
| 🔍 → `bx-filter` | `<i className="bx bx-filter"></i>` | Filtros |

### Importación de Usuarios (BulkUserImport.js)
| Icono Original | Código Boxicons | Uso |
|----------------|-----------------|-----|
| 📤 → `bx-upload` | `<i className="bx bx-upload"></i>` | Título Importar |
| 📊 → `bx-bar-chart` | `<i className="bx bx-bar-chart"></i>` | Resultado Importación |
| ✅ → `bx-check` | `<i className="bx bx-check"></i>` | Usuarios Importados |
| ❌ → `bx-x` | `<i className="bx bx-x"></i>` | Errores |
| 📋 → `bx-list-ul` | `<i className="bx bx-list-ul"></i>` | Instrucciones |
| 📥 → `bx-download` | `<i className="bx bx-download"></i>` | Descargar Template |

## 🎨 Categorías de Iconos Disponibles

### 🏢 Administración y Gestión
- `bx-cog` - Configuraciones
- `bx-crown` - Privilegios administrativos
- `bx-shield` - Seguridad
- `bx-key` - Acceso/Autenticación

### 👥 Usuarios y Perfiles
- `bx-user` - Usuario individual
- `bx-group` - Múltiples usuarios
- `bx-user-plus` - Agregar usuario
- `bx-user-check` - Usuario verificado
- `bx-user-x` - Usuario bloqueado

### 📊 Analytics y Métricas
- `bx-bar-chart` - Gráfico de barras
- `bx-bar-chart-alt-2` - Dashboard analytics
- `bx-trending-up` - Tendencia ascendente
- `bx-trending-down` - Tendencia descendente
- `bx-pie-chart` - Gráfico circular

### 📅 Eventos y Calendario
- `bx-calendar` - Calendario general
- `bx-calendar-event` - Evento específico
- `bx-calendar-check` - Evento confirmado
- `bx-calendar-plus` - Agregar evento
- `bx-calendar-x` - Cancelar evento

### ✅ Estados y Acciones
- `bx-check` - Confirmado/Correcto
- `bx-check-circle` - Estado exitoso
- `bx-x` - Cancelar/Cerrar
- `bx-x-circle` - Estado de error
- `bx-time` - Pendiente/En proceso

### 📁 Archivos y Documentos
- `bx-upload` - Subir archivo
- `bx-download` - Descargar archivo
- `bx-file` - Archivo general
- `bx-spreadsheet` - Archivo Excel
- `bx-list-ul` - Lista/Documentación

### 🔍 Navegación y Búsqueda
- `bx-search` - Buscar
- `bx-filter` - Filtrar
- `bx-sort` - Ordenar
- `bx-menu` - Menú hamburguesa
- `bx-bookmark` - Marcador/Favorito

### 💬 Comunicación y Notificaciones
- `bx-bell` - Notificaciones
- `bx-message` - Mensajes
- `bx-mail-send` - Enviar email
- `bx-phone` - Teléfono
- `bx-chat` - Chat

### 🛠️ Utilidades
- `bx-trash` - Eliminar
- `bx-edit` - Editar
- `bx-copy` - Copiar
- `bx-share` - Compartir
- `bx-refresh` - Actualizar

## 🎯 Buenas Prácticas

### 1. Consistencia de Iconos
- Usar siempre el mismo icono para la misma acción en todo el sitio
- Ejemplo: `bx-check-circle` siempre para check-in exitoso

### 2. Estructura HTML
```html
<!-- ✅ Correcto: Con espaciado -->
<i className="bx bx-calendar mr-2"></i>
Eventos

<!-- ❌ Incorrecto: Sin espaciado -->
<i className="bx bx-calendar"></i>Eventos
```

### 3. Uso en Botones
```html
<!-- Para botones con texto -->
<button className="btn flex items-center">
  <i className="bx bx-plus mr-2"></i>
  Agregar Usuario
</button>

<!-- Para iconos en badges/estados -->
<span className="badge flex items-center">
  <i className="bx bx-check mr-1"></i>
  Activo
</span>
```

### 4. Tamaños Recomendados
- Iconos en botones: `text-lg` o sin clase (tamaño por defecto)
- Iconos en headers: `text-xl` o `text-2xl`
- Iconos en tarjetas métricas: `text-2xl`

## 🔗 Recursos Adicionales

- **Sitio oficial**: [https://boxicons.com/](https://boxicons.com/)
- **Repositorio GitHub**: [https://github.com/atisawd/boxicons](https://github.com/atisawd/boxicons)
- **Cheatsheet completo**: [https://boxicons.com/cheatsheet](https://boxicons.com/cheatsheet)

## 📝 Notas de Migración

Este proyecto migró de emojis a Boxicons para:
- ✅ Mayor consistencia visual
- ✅ Mejor accesibilidad
- ✅ Rendimiento optimizado
- ✅ Compatibilidad cross-browser
- ✅ Facilidad de mantenimiento

---
**Última actualización**: Julio 2025  
**Responsable**: Equipo de Desarrollo Centro Cultural 
# 📚 Documentación de la API - Centro Cultural

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Después del login, incluye el token en el header de cada petición:

```
Authorization: Bearer <tu-token-jwt>
```

## 📍 Base URL

```
Development: http://localhost:8001
Production: https://api.culturalcenter.com
```

## 🔗 Endpoints

### 👤 Autenticación y Usuarios

#### Registro de Usuario
```http
POST /api/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "age": 25,
  "location": "Santo Domingo"
}

Response: 201 Created
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+1234567890",
    "age": 25,
    "location": "Santo Domingo",
    "is_admin": false
  }
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "is_admin": false
  }
}
```

### 🎭 Eventos

#### Listar Eventos (Público)
```http
GET /api/events

Response: 200 OK
[
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Concierto de Jazz",
    "description": "Una noche mágica de jazz",
    "category": "Concerts",
    "date": "2025-02-15",
    "time": "20:00",
    "capacity": 200,
    "location": "Sala Principal",
    "image_url": "https://example.com/jazz.jpg",
    "available_spots": 150,
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

#### Crear Evento (Admin)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Taller de Pintura",
  "description": "Aprende técnicas básicas de pintura",
  "category": "Workshops",
  "date": "2025-02-20",
  "time": "10:00",
  "capacity": 30,
  "location": "Aula 3",
  "image_url": "https://example.com/painting.jpg"
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439013",
  "title": "Taller de Pintura",
  ...
}
```

#### Obtener Categorías
```http
GET /api/categories

Response: 200 OK
[
  "Dominican Cinema",
  "Classic Cinema",
  "General Cinema",
  "Workshops",
  "Concerts",
  "Talks/Conferences",
  "Art Exhibitions",
  "3D Immersive Experiences"
]
```

### 🎫 Reservas

#### Crear Reserva
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "event_id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011"
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439014",
  "event_id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011",
  "status": "confirmed",
  "qr_code": "data:image/png;base64,iVBORw0KGgo...",
  "checkin_code": "AB3D5F7H",
  "created_at": "2025-01-10T14:30:00Z"
}
```

#### Listar Mis Reservas
```http
GET /api/reservations
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "507f1f77bcf86cd799439014",
    "event": {
      "title": "Concierto de Jazz",
      "date": "2025-02-15",
      "time": "20:00"
    },
    "status": "confirmed",
    "checkin_code": "AB3D5F7H",
    "created_at": "2025-01-10T14:30:00Z"
  }
]
```

#### Cancelar Reserva
```http
DELETE /api/reservations/{reservation_id}
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Reservation cancelled successfully"
}
```

### ✅ Check-in

#### Check-in con Código/Email/Teléfono
```http
POST /api/checkin
Content-Type: application/json

{
  "identifier": "AB3D5F7H"  // puede ser código, email o teléfono
}

Response: 200 OK
{
  "message": "Check-in successful",
  "user_name": "Juan Pérez",
  "event_title": "Concierto de Jazz",
  "reservation_id": "507f1f77bcf86cd799439014"
}
```

### 👨‍💼 Administración

#### Estadísticas del Dashboard
```http
GET /api/admin/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "total_users": 1250,
  "total_events": 45,
  "total_reservations": 3420,
  "checked_in_today": 89,
  "active_events": 12,
  "upcoming_events": 8
}
```

#### Listar Usuarios (Admin)
```http
GET /api/admin/users?skip=0&limit=50&search=juan&status_filter=active
Authorization: Bearer <token>

Response: 200 OK
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "location": "Santo Domingo",
      "created_at": "2025-01-01T10:00:00Z",
      "is_admin": false,
      "total_reservations": 5,
      "last_activity": "2025-01-10T14:30:00Z"
    }
  ],
  "total": 1250,
  "page": 1,
  "pages": 25
}
```

#### Importación Masiva de Usuarios
```http
POST /api/admin/users/bulk-import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: usuarios.csv
default_password: changeme123

Response: 200 OK
{
  "total_processed": 100,
  "successful_imports": 95,
  "failed_imports": 5,
  "duplicate_emails": 3,
  "errors": [
    {
      "row": 23,
      "error": "Invalid email format",
      "data": {"email": "invalid-email"}
    }
  ],
  "imported_users": [...]
}
```

### 📊 Analytics

#### Métricas en Tiempo Real
```http
GET /api/analytics/metrics
Authorization: Bearer <token>

Response: 200 OK
{
  "active_users": 45,
  "events_today": 3,
  "reservations_today": 127,
  "checkins_today": 89,
  "popular_categories": {
    "Concerts": 45,
    "Workshops": 32,
    "Cinema": 28
  },
  "user_demographics": {
    "age_groups": {
      "18-25": 230,
      "26-35": 450,
      "36-45": 320
    },
    "locations": {
      "Santo Domingo": 600,
      "Santiago": 250,
      "Other": 150
    }
  }
}
```

#### Segmentación de Usuario
```http
POST /api/analytics/segment-user/{user_id}
Authorization: Bearer <token>

Response: 200 OK
{
  "user_id": "507f1f77bcf86cd799439011",
  "segment": "engaged",
  "confidence": 0.85,
  "characteristics": {
    "activity_level": "high",
    "preferred_categories": ["Concerts", "Workshops"],
    "attendance_rate": 0.92
  }
}
```

### 📄 Reportes

#### Reporte de Evento
```http
GET /api/admin/reports/professional/event/{event_id}
Authorization: Bearer <token>

Response: 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="event_report_2025-02-15.pdf"

[Binary PDF data]
```

#### Reporte Mensual
```http
GET /api/admin/reports/professional/monthly?month=1&year=2025
Authorization: Bearer <token>

Response: 200 OK
{
  "period": "January 2025",
  "total_events": 45,
  "total_attendance": 2340,
  "average_attendance_rate": 0.78,
  "popular_events": [...],
  "user_growth": 12.5,
  "revenue_estimate": 125000
}
```

## 🔴 Códigos de Error

| Código | Descripción | Ejemplo |
|--------|-------------|---------|
| 400 | Bad Request | Datos inválidos en la petición |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos para esta acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Email ya registrado |
| 422 | Unprocessable Entity | Validación fallida |
| 500 | Internal Server Error | Error del servidor |

### Formato de Error
```json
{
  "detail": "Email already registered",
  "status_code": 409,
  "type": "conflict_error"
}
```

## 🔄 WebSocket - Dashboard en Tiempo Real

### Conexión
```javascript
const ws = new WebSocket('ws://localhost:8001/ws/dashboard');

ws.onopen = () => {
  console.log('Connected to dashboard');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Dashboard update:', data);
};
```

### Formato de Mensajes
```json
{
  "type": "metrics_update",
  "data": {
    "active_users": 45,
    "recent_checkins": 3,
    "timestamp": "2025-01-10T15:30:00Z"
  }
}
```

## 📝 Notas Adicionales

- Todos los timestamps están en UTC
- Los IDs son strings en formato ObjectId de MongoDB
- Las imágenes se devuelven como URLs completas
- Los códigos QR se devuelven como data URIs base64
- El límite de rate es 100 requests por minuto por IP

## 🧪 Ambiente de Testing

Para testing, usa estas credenciales:

```
Base URL: http://localhost:8001
Admin: admin@test.com / admin123
User: user@test.com / user123
```

---

Para más información o soporte, contacta: api-support@culturalcenter.com
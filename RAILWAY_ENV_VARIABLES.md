# 🚀 VARIABLES DE ENTORNO PARA RAILWAY

## Variables obligatorias que debes configurar en Railway:

```bash
# =========================================
# APPLICATION SETTINGS
# =========================================
ENVIRONMENT=production
DEBUG=False
APP_NAME=Centro Cultural Banreservas API

# =========================================
# SECURITY SETTINGS (CRITICAL)
# =========================================
SECRET_KEY=f2LjPEg1-K4blEkf-Do2a8glKn6bzCqmPNBEMjHJpKQ
ACCESS_TOKEN_EXPIRE_MINUTES=30
SESSION_TIMEOUT_MINUTES=60
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15

# =========================================
# CORS CONFIGURATION (ACTUALIZAR CON TU DOMINIO)
# =========================================
ALLOWED_ORIGINS=https://tu-frontend-railway.up.railway.app,https://ccb-platform-production.up.railway.app

# =========================================
# DATABASE CONFIGURATION (MongoDB Atlas)
# =========================================
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
DATABASE_NAME=cultural_center

# =========================================
# EMAIL CONFIGURATION (SendGrid) - OPCIONAL
# =========================================
SENDGRID_API_KEY=tu-sendgrid-api-key-aqui
FROM_EMAIL=noreply@banreservas.com.do

# =========================================
# SECURITY HEADERS
# =========================================
SECURITY_HEADERS=true
HSTS_MAX_AGE=31536000

# =========================================
# RATE LIMITING
# =========================================
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_BURST=10

# =========================================
# ANALYTICS
# =========================================
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=90
```

## 📋 PASOS SIGUIENTES:

1. Ve a Railway.app y crea una cuenta
2. Conecta tu repositorio de GitHub 
3. Configura estas variables en el dashboard de Railway
4. Configura MongoDB Atlas (o usa Railway's MongoDB plugin)
5. ¡Despliega!

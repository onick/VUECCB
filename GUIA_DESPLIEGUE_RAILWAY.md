# 🚀 GUÍA PASO A PASO: DESPLEGAR EN RAILWAY

## 📋 **PREPARACIÓN (YA ESTÁ LISTA)**
✅ **Tu proyecto ya está 100% preparado para despliegue**
✅ **Build exitoso**: ✓ Compilado correctamente
✅ **Repositorio actualizado**: https://github.com/onick/VUECCB.git
✅ **Archivos de configuración**: Todos presentes

---

## 🔥 **DESPLIEGUE EN 10 PASOS SIMPLES**

### **PASO 1: CREAR CUENTA EN RAILWAY**
1. Ve a: https://railway.app
2. Haz clic en **"Sign Up"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza Railway para acceder a tu GitHub

### **PASO 2: CREAR NUEVO PROYECTO**
1. En Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: **`onick/VUECCB`**
4. Haz clic en **"Deploy"**

### **PASO 3: CONFIGURAR SERVICIOS**
Railway detectará automáticamente 2 carpetas:
- ✅ **Backend** (Python/FastAPI) - en `/backend/`
- ✅ **Frontend** (Next.js) - en `/frontend/`

### **PASO 4: CONFIGURAR VARIABLES DE ENTORNO DEL BACKEND**
En el servicio de **Backend**, ve a **"Variables"** y agrega:

```bash
# OBLIGATORIAS
ENVIRONMENT=production
SECRET_KEY=f2LjPEg1-K4blEkf-Do2a8glKn6bzCqmPNBEMjHJpKQ
DEBUG=False

# BASE DE DATOS (usar el paso 5 primero)
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/cultural_center
DATABASE_NAME=cultural_center

# CORS (actualizar después con tu dominio)
ALLOWED_ORIGINS=https://tu-frontend.up.railway.app

# OPCIONALES
ACCESS_TOKEN_EXPIRE_MINUTES=30
ANALYTICS_ENABLED=true
```

### **PASO 5: CONFIGURAR MONGODB ATLAS**
1. Ve a: https://cloud.mongodb.com
2. Crea cuenta gratuita
3. Crea un **cluster gratuito**
4. Ve a **"Database Access"** → Crear usuario
5. Ve a **"Network Access"** → Permitir acceso desde **"0.0.0.0/0"**
6. Ve a **"Connect"** → **"Connect your application"**
7. Copia la **connection string** y úsala en `MONGO_URL`

### **PASO 6: CONFIGURAR VARIABLES DEL FRONTEND**
En el servicio de **Frontend**, agrega:

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app
```

### **PASO 7: OBTENER URLS DE RAILWAY**
1. Una vez desplegado, Railway te dará 2 URLs:
   - **Backend**: `https://backend-xxx.up.railway.app`
   - **Frontend**: `https://frontend-xxx.up.railway.app`

### **PASO 8: ACTUALIZAR VARIABLES CON URLs REALES**
1. **En Backend**: Cambia `ALLOWED_ORIGINS` por tu URL real del frontend
2. **En Frontend**: Cambia `NEXT_PUBLIC_API_URL` por tu URL real del backend

### **PASO 9: REDESPEGAR**
Después de cambiar las variables:
1. Ve a **"Deployments"** en cada servicio
2. Haz clic en **"Redeploy"**

### **PASO 10: ¡PROBAR!**
1. Visita tu URL del frontend
2. Crea una cuenta de usuario
3. ¡Tu plataforma está en línea! 🎉

---

## 🔧 **CONFIGURACIONES OPCIONALES**

### **📧 Email (SendGrid)**
```bash
SENDGRID_API_KEY=tu-api-key
FROM_EMAIL=noreply@tudominio.com
```

### **🔒 Dominios Personalizados**
1. En Railway → "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones

---

## ⚡ **COMANDOS QUE RAILWAY EJECUTARÁ**

### **Backend (Automático)**
```bash
# Build
pip install -r requirements.txt

# Start
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### **Frontend (Automático)**
```bash
# Build
npm install && npm run build

# Start
npm start
```

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Backend no inicia:**
- ✅ Verifica `MONGO_URL` en variables
- ✅ Verifica que MongoDB Atlas acepta conexiones
- ✅ Revisa logs en Railway

### **Frontend no conecta con Backend:**
- ✅ Verifica `NEXT_PUBLIC_API_URL` 
- ✅ Verifica `ALLOWED_ORIGINS` en backend
- ✅ Asegúrate que ambos servicios estén corriendo

### **Error 500:**
- ✅ Revisa los logs en Railway
- ✅ Verifica todas las variables de entorno

---

## 🎯 **RESULTADO FINAL**

Tu plataforma estará disponible en:
- **🌐 Web Pública**: `https://tu-frontend.up.railway.app`
- **⚙️ API Backend**: `https://tu-backend.up.railway.app`

**Funcionalidades activas:**
- ✅ Sistema de usuarios y autenticación
- ✅ Gestión de eventos  
- ✅ Sistema de noticias con editor visual
- ✅ Dashboard administrativo
- ✅ Sistema de reservas
- ✅ Analytics y reportes

---

## 💰 **COSTOS**

**Railway Plan Gratuito:**
- ✅ $5 USD de crédito mensual gratuito
- ✅ Suficiente para proyectos pequeños/medianos
- ✅ Sin límite de tiempo

**MongoDB Atlas:**
- ✅ Plan gratuito: 512MB
- ✅ Perfecto para empezar

---

**¿Necesitas ayuda con algún paso? ¡Solo pregunta!** 🚀 
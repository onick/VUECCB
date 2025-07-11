# 📧 Guía Completa de Configuración de Emails - Centro Cultural Banreservas

## 🎯 **OBJETIVO:** 
Activar el sistema de emails automáticos que ya está programado en la plataforma.

## 📊 **ESTADO ACTUAL:**
- ✅ **Sistema de emails COMPLETAMENTE programado**
- ✅ **Templates HTML profesionales listos**
- ✅ **Integración SendGrid implementada**
- ❌ **Solo falta configurar las credenciales**

---

## 🚀 **PASO 1: Crear Cuenta SendGrid (GRATIS)**

### **Registro:**
1. Ve a: https://sendgrid.com
2. Haz clic en "Start for Free"
3. Completa el registro con:
   - Email de trabajo
   - Contraseña segura
   - Información de la empresa: "Centro Cultural Banreservas"

### **Plan Gratuito:**
- ✅ **12,000 emails gratis/mes**
- ✅ **Perfecto para la plataforma**
- ✅ **Sin costo por 30 días, luego plan gratuito permanente**

---

## 🔧 **PASO 2: Configurar SendGrid**

### **A) Verificar Dominio/Email:**
1. En SendGrid Dashboard → **Settings** → **Sender Authentication**
2. **Opción 1 - Single Sender Verification (MÁS FÁCIL):**
   - Usa email personal/trabajo (ej: admin@culturalcenter.com)
   - SendGrid envía email de verificación
   - Confirma desde tu bandeja de entrada

### **B) Crear API Key:**
1. **Settings** → **API Keys** → **Create API Key**
2. **Nombre:** "Cultural Center App"
3. **Permisos:** "Full Access" (para inicio)
4. **GUARDAR LA CLAVE** (se muestra solo una vez)

---

## ⚙️ **PASO 3: Configurar la Aplicación**

### **Agregar Variables de Entorno:**

Crea archivo `.env` en la carpeta `backend/`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=admin@culturalcenter.com

# Opcional: MongoDB y JWT
MONGO_URL=mongodb://localhost:27017/
SECRET_KEY=your-secret-key-change-in-production
```

### **O exportar en terminal:**
```bash
export SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxx"
export FROM_EMAIL="admin@culturalcenter.com"
```

---

## 📧 **EMAILS QUE SE ENVIARÁN AUTOMÁTICAMENTE:**

### **1. Email de Bienvenida** (Registro)
- Mensaje de bienvenida personalizado
- Instrucciones de uso de la plataforma
- Enlaces útiles

### **2. Confirmación de Reserva**
- Detalles del evento
- Código QR para check-in
- Código de 8 caracteres backup
- Instrucciones de llegada

### **3. Confirmación de Check-in**
- Confirmación de asistencia
- Agradecimiento por participar

### **4. Cancelación de Reserva**
- Confirmación de cancelación
- Información del evento cancelado
- Invitación a futuros eventos

### **5. Notificaciones Admin**
- Notificaciones de cancelaciones
- Estadísticas importantes

---

## 🧪 **PASO 4: Probar el Sistema**

### **Comando de Prueba:**
```bash
cd backend
python3.11 -c "
from server import send_email
result = send_email('tu-email@gmail.com', 'Prueba', '<h1>Funciona!</h1>')
print('Email enviado:', result)
"
```

### **Prueba Completa:**
1. **Registrar usuario nuevo** → debe llegar email de bienvenida
2. **Hacer reserva** → debe llegar confirmación con código
3. **Cancelar reserva** → debe llegar email de cancelación

---

## 🎨 **PERSONALIZACIÓN AVANZADA (OPCIONAL):**

### **Cambiar Remitente:**
En `backend/server.py` línea 93:
```python
FROM_EMAIL = 'eventos@centroculturalbanreservas.com'  # Tu email
```

### **Personalizar Templates:**
Los templates están en las funciones:
- `send_welcome_email()` - línea 299
- `send_reservation_confirmation_email()` - línea 362
- `send_checkin_confirmation_email()` - línea 446
- `send_reservation_cancellation_email()` - línea 495

---

## 🔍 **VERIFICACIÓN DEL FUNCIONAMIENTO:**

### **Logs Exitosos:**
```
INFO:__main__:Email sent successfully to user@email.com, status: 202
INFO:__main__:Reservation confirmation email sent to user@email.com
```

### **Problemas Comunes:**
```
WARNING:__main__:SendGrid API key not configured - email not sent
```
**Solución:** Verificar que `SENDGRID_API_KEY` esté configurado

```
ERROR:__main__:Failed to send email: HTTP Error 401
```
**Solución:** API Key incorrecta o no tiene permisos

---

## 💰 **COSTOS:**
- **Plan Gratuito:** 12,000 emails/mes (≈400 emails/día)
- **Para Centro Cultural:** MÁS QUE SUFICIENTE
- **Si necesitas más:** Planes desde $19.95/mes

---

## ✅ **RESULTADO FINAL:**
Una vez configurado, tu plataforma enviará emails automáticamente profesionales y completamente funcionales sin intervención manual.

---

## 🆘 **SOPORTE:**
Si necesitas ayuda con la configuración, documenta cualquier error y te ayudo a resolverlo paso a paso. 
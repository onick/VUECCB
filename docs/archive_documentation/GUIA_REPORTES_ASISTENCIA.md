# 📊 Guía Completa: Reportes de Asistencia

## 🎯 **Resumen Ejecutivo**

El sistema del Centro Cultural Banreservas ahora incluye un **módulo completo de reportes de asistencia** que te permite analizar la participación en eventos de manera detallada y eficiente.

---

## 🚀 **Cómo Acceder a los Reportes**

### 1. **Acceso desde el Panel Administrativo**
1. Inicia sesión como **administrador**
2. En el menú lateral, ve a **"Reportes"** (ícono de documento)
3. Aparecerás en la sección **"Reportes de Asistencia"**

---

## 📋 **Tipos de Reportes Disponibles**

### 🎪 **1. Reporte Individual por Evento**
**¿Qué incluye?**
- Lista completa de participantes
- Estados de asistencia (Confirmado, Asistió, Cancelado)
- Información demográfica (edad, ubicación)
- Códigos de check-in y fechas
- Métricas del evento (tasa de asistencia, utilización de capacidad)

**¿Cómo generarlo?**
1. Ve a la pestaña **"Reporte Individual"**
2. Selecciona el evento en el dropdown
3. Haz clic en **"Generar Reporte"**
4. Exporta a CSV si necesitas trabajar con los datos

### 📈 **2. Reporte Resumen Multi-Evento**
**¿Qué incluye?**
- Vista consolidada de múltiples eventos
- Comparativas de asistencia entre eventos
- Métricas globales de rendimiento
- Filtros por fecha y categoría

**¿Cómo generarlo?**
1. Ve a la pestaña **"Reporte Resumen"**
2. Aplica filtros (fechas, categoría)
3. Haz clic en **"Generar Reporte"**
4. Revisa métricas comparativas

---

## 📊 **Métricas Clave Incluidas**

### **Métricas por Evento:**
- **Total de Reservas**: Cuántas personas se registraron
- **Total de Asistentes**: Cuántas personas realmente asistieron
- **Tasa de Asistencia**: Porcentaje de personas que asistieron
- **Utilización de Capacidad**: Qué porcentaje del aforo se utilizó
- **Cancelaciones**: Número de reservas canceladas

### **Análisis Demográfico:**
- **Grupos de Edad**: Distribución por rangos etarios
- **Ubicaciones**: De dónde vienen los asistentes
- **Patrones de Comportamiento**: Tendencias de participación

---

## 💾 **Opciones de Exportación**

### **Formato CSV (Recomendado para análisis)**
- Importa fácilmente a Excel, Google Sheets
- Perfecto para crear gráficos personalizados
- Incluye todos los datos granulares

### **Datos Incluidos en Exportación:**
```
- Nombre del participante
- Email y teléfono
- Edad y ubicación
- Código de check-in
- Estado de asistencia
- Fechas de reserva y check-in
```

---

## 🎯 **Casos de Uso Prácticos**

### **1. Análisis Post-Evento**
```
Después de cada evento:
1. Genera reporte individual
2. Revisa tasa de asistencia
3. Analiza demografía de asistentes
4. Identifica patrones de no-asistencia
```

### **2. Planificación de Eventos Futuros**
```
Para planificar mejor:
1. Usa reporte resumen mensual
2. Identifica categorías más populares
3. Ajusta capacidades según tendencias
4. Optimiza horarios basado en asistencia
```

### **3. Reportes para Dirección**
```
Para presentaciones ejecutivas:
1. Genera reporte resumen trimestral
2. Exporta métricas clave
3. Crea presentación con datos de utilización
4. Muestra ROI por categoría de evento
```

---

## 🔧 **Funcionalidades Avanzadas**

### **Filtros Inteligentes**
- **Por Fecha**: Selecciona rangos específicos
- **Por Categoría**: Analiza tipos de eventos particulares
- **Por Estado**: Enfócate en asistentes, cancelaciones, etc.

### **Análisis Demográfico Automático**
- Segmentación automática por edad (Menor de 18, 18-29, 30-44, 45-59, 60+)
- Mapa de procedencia de asistentes
- Identificación de audiencias objetivo

### **Métricas Comparativas**
- Tasa de asistencia promedio vs individual
- Utilización de capacidad por categoría
- Tendencias temporales de participación

---

## 📱 **Integración con el Sistema Existente**

### **Datos en Tiempo Real**
- Los reportes se actualizan automáticamente
- Incluyen check-ins del día
- Reflejan cancelaciones inmediatas

### **Compatibilidad con Check-in**
- Integra con códigos de 8 caracteres
- Funciona con check-in por email/teléfono
- Rastrea métodos de check-in utilizados

---

## 🛠️ **API Endpoints (Para Desarrolladores)**

### **Reporte Individual:**
```
GET /api/admin/events/{event_id}/attendance-report
Authorization: Bearer {token}
```

### **Reporte Resumen:**
```
GET /api/admin/reports/attendance-summary
?date_from=2025-01-01
&date_to=2025-12-31
&category=Workshops
Authorization: Bearer {token}
```

---

## 📋 **Ejemplos de Uso**

### **Ejemplo 1: Evento de Arte**
```
Evento: "Exposición de Arte Contemporáneo"
- Capacidad: 100 personas
- Reservas: 96 personas
- Asistentes: 78 personas
- Tasa de Asistencia: 81.3%
- Utilización: 96%

Conclusión: Excelente demanda, pero revisar 
factores que causan 18 no-asistencias.
```

### **Ejemplo 2: Taller de Fotografía**
```
Evento: "Taller de Fotografía Digital"
- Capacidad: 25 personas
- Reservas: 22 personas
- Asistentes: 20 personas
- Tasa de Asistencia: 90.9%
- Demografía: 70% entre 25-40 años

Conclusión: Formato taller tiene alta retención.
```

---

## ✅ **Checklist para Sacar Reportes**

### **Después de Cada Evento:**
- [ ] Esperar 24 horas post-evento para check-ins tardíos
- [ ] Generar reporte individual
- [ ] Exportar datos a CSV
- [ ] Analizar tasa de asistencia
- [ ] Documentar insights para eventos futuros

### **Reportes Mensuales:**
- [ ] Generar reporte resumen del mes
- [ ] Comparar con mes anterior
- [ ] Identificar eventos más exitosos
- [ ] Analizar tendencias demográficas
- [ ] Preparar presentación para dirección

### **Reportes Trimestrales:**
- [ ] Reporte resumen de 3 meses
- [ ] Análisis de capacidad vs demanda
- [ ] ROI por categoría de evento
- [ ] Recomendaciones para próximo trimestre

---

## 🎯 **Mejores Prácticas**

### **1. Consistencia en Reportes**
- Genera reportes el mismo día cada semana
- Usa los mismos filtros para comparabilidad
- Mantén archivo histórico de reportes

### **2. Análisis Contextual**
- Considera factores externos (clima, fechas especiales)
- Relaciona asistencia con marketing utilizado
- Compara eventos similares en ubicaciones diferentes

### **3. Acción Basada en Datos**
- Si tasa de asistencia < 70%, revisar proceso
- Si utilización < 80%, considerar reducir capacidad
- Si cancelaciones > 15%, mejorar comunicación previa

---

## 🔮 **Próximas Mejoras Planificadas**

- Dashboard visual con gráficos interactivos
- Reportes automáticos por email
- Predicción de asistencia basada en datos históricos
- Segmentación avanzada de audiencias
- Integración con sistemas de marketing

---

## 📞 **Soporte y Contacto**

Para dudas sobre los reportes:
1. Revisa esta guía primero
2. Prueba con eventos de prueba
3. Contacta al equipo técnico si persisten problemas

---

**¡Los reportes de asistencia están listos para usar!** 🎉

Empieza generando tu primer reporte y descubre insights valiosos sobre la participación en tus eventos. 
# 🚀 QUICK START - CENTRO CULTURAL BANRESERVAS

**Documentos importantes**:
- 📋 **DESARROLLO_ROADMAP.md** - Plan completo de desarrollo
- 📚 **README.md** - Documentación general del proyecto

---

## ⚡ **COMANDOS RÁPIDOS**

### **Iniciar servicios:**
```bash
# Frontend (Terminal 1)
cd "/Volumes/Centro cultural Backup/ccb 2025/VUE/ccb-platform/frontend" && npm run dev

# Backend (Terminal 2)  
cd "/Volumes/Centro cultural Backup/ccb 2025/VUE/ccb-platform/backend" && python3 -m uvicorn server:app --reload --port 8004
```

### **Verificar servicios activos:**
```bash
lsof -i :3000,8004  # Ver puertos ocupados
ps aux | grep mongod  # MongoDB status
```

### **Git workflow:**
```bash
git status
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/dashboard-crud-qr-complete
```

---

## 🔗 **URLs IMPORTANTES**

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin  
- **API Docs**: http://localhost:8004/docs
- **Backend**: http://localhost:8004

**Credenciales Admin**: admin@banreservas.com.do / Admin2024CCB!

---

## 🎯 **PRÓXIMA TAREA**

**Ver DESARROLLO_ROADMAP.md → "TAREA INMEDIATA"**

Actualmente: **Crear Editor de Eventos** (`/admin/events/[id]/edit/page.tsx`)

---

## 📁 **ESTRUCTURA PROYECTO**

```
ccb-platform/
├── frontend/src/
│   ├── app/admin/
│   │   ├── events/
│   │   │   ├── [id]/edit/    ← CREAR ESTO
│   │   │   └── [id]/         ← CREAR ESTO  
│   │   ├── users/
│   │   ├── checkin/
│   │   └── reports/
│   ├── components/
│   ├── services/api.ts       ← API centralizada
│   └── utils/eventUtils.ts   ← Utilities
└── backend/
    ├── api/                  ← Endpoints
    ├── models/               ← Schemas
    └── services/             ← Business logic
```

---

## ✅ **CHECKLIST ANTES DE EMPEZAR**

- [ ] Servicios corriendo (frontend + backend)
- [ ] MongoDB activo
- [ ] DESARROLLO_ROADMAP.md leído
- [ ] Git status limpio
- [ ] Tarea específica identificada

---

**🎯 SIEMPRE EMPEZAR AQUÍ Y LUEGO IR AL ROADMAP COMPLETO**
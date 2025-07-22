
# MIGRATION GUIDE: server.py → Modular Structure

## 🎯 OVERVIEW
This guide helps you migrate from the monolithic server.py (3,196 lines) to the new modular structure.

## 📁 NEW STRUCTURE
```
backend/
├── main.py                 # NEW entry point (replaces server.py)
├── core/                   # Core functionality
│   ├── config.py          # Configuration management
│   ├── database.py        # Database connection & operations
│   ├── security.py        # JWT & password utilities
│   └── analytics_init.py  # Analytics initialization
├── models/                 # Pydantic models (extracted from server.py)
│   ├── users.py           # User-related models
│   ├── events.py          # Event-related models
│   ├── reservations.py    # Reservation & check-in models
│   └── common.py          # Common response models
├── services/               # Business logic
│   ├── user_service.py    # User operations
│   └── event_service.py   # Event operations
├── utils/                  # Utility functions
│   ├── email.py           # Email sending (SendGrid)
│   ├── validation.py      # Data validation
│   └── qr_codes.py        # QR code generation
└── api/                    # API endpoints (modular)
    ├── auth.py            # Authentication endpoints
    ├── users.py           # User management
    ├── events.py          # Event management
    ├── reservations.py    # Reservation system
    ├── checkin.py         # Check-in system
    ├── dashboard.py       # Dashboard data
    ├── analytics.py       # Analytics endpoints
    ├── reports.py         # Report generation
    └── admin.py           # Admin functions
```

## 🔄 MIGRATION STEPS

### Step 1: Backup Current System
```bash
# Keep server.py running on port 8004
cp server.py server_backup.py
```

### Step 2: Test New Structure
```bash
# Test the new modular structure
python3 test_structure.py

# Start new system on different port (8005)
cd backend
python3 -m uvicorn main:app --reload --port 8005
```

### Step 3: Verify Compatibility
```bash
# Test both systems side by side
curl http://localhost:8004/  # Old system
curl http://localhost:8005/  # New system

# Compare API responses
curl http://localhost:8004/api/events
curl http://localhost:8005/api/events
```

### Step 4: Switch Production
```bash
# Update frontend to use new backend
# Change API_BASE_URL from :8004 to :8005

# Stop old server
# Start new server on port 8004
python3 -m uvicorn main:app --reload --port 8004
```

## 🔍 KEY CHANGES

### Database Connection
- **Old**: Direct MongoClient in server.py
- **New**: Centralized in core/database.py with health checks

### Authentication
- **Old**: JWT functions scattered in server.py
- **New**: Organized in core/security.py with proper error handling

### API Structure
- **Old**: All endpoints in server.py (3,196 lines)
- **New**: Modular routers in api/ directory (50-400 lines each)

### Models
- **Old**: Pydantic models mixed with endpoints
- **New**: Organized by domain in models/ directory

### Business Logic
- **Old**: Mixed with API endpoints
- **New**: Separated into services/ directory

## ⚠️ BREAKING CHANGES
**NONE** - The new structure maintains 100% API compatibility

## 🧪 TESTING CHECKLIST
- [ ] All imports work correctly
- [ ] Database connection successful
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] User registration/login
- [ ] Event creation/retrieval
- [ ] Reservation system
- [ ] Check-in functionality
- [ ] Dashboard stats
- [ ] Frontend compatibility

## 🚀 BENEFITS
✅ **Maintainability**: Reduced from 3,196 lines to ~50-400 lines per module
✅ **Testability**: Each module can be tested independently
✅ **Scalability**: Easy to add new features
✅ **Debugging**: Easier to locate and fix issues
✅ **Team Development**: Multiple developers can work on different modules
✅ **Documentation**: Self-documenting structure

## 🔧 CONFIGURATION
The new structure uses the same environment variables as the old system:
- MONGO_URL
- SECRET_KEY
- SENDGRID_API_KEY
- DEBUG

## 📞 ROLLBACK PLAN
If issues arise, simply switch back to server.py:
```bash
# Stop new system
# Start old system
python3 -m uvicorn server:app --reload --port 8004
```

All data remains intact as database structure is unchanged.
